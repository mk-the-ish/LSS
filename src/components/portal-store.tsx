"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { calculatePricing } from "@/lib/pricing";
import { initialRegistration } from "@/lib/lss-data";
import type { RegistrationCategory, VerificationStatus, ViewState } from "@/lib/lss-data";
import { supabase, supabaseEnabled } from "@/lib/supabase";

const STORAGE_KEY = "lss_portal_v4";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const POP_BUCKET = "pop-uploads";
const PROFILES_TABLE = "profiles";

export type UploadFileRecord = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  path?: string;
};

export type PortalState = {
  view: ViewState;
  adminTab: "pending" | "verified";
  authStatus: "anonymous" | "authenticated";
  userId: string | null;
  email: string | null;
  registration: typeof initialRegistration & {
    popFile?: UploadFileRecord | null;
    rejectionReason?: string;
    generatedReference?: string;
  };
};

type PortalContextValue = PortalState & {
  hydrated: boolean;
  pricing: ReturnType<typeof calculatePricing>;
  authReady: boolean;
  supabaseEnabled: boolean;
  authError: string;
  setView: (view: ViewState) => void;
  setAdminTab: (tab: "pending" | "verified") => void;
  updateRegistration: (patch: Partial<PortalState["registration"]>) => void;
  uploadPop: (file: File) => Promise<{ ok: true } | { ok: false; error: string }>;
  approveApplication: () => Promise<void>;
  rejectApplication: (reason: string) => Promise<void>;
  clearState: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => Promise<void>;
  setFromProfile: (profile: Record<string, unknown> | null) => void;
};

const PortalContext = createContext<PortalContextValue | null>(null);

function buildInitialState(): PortalState {
  return {
    view: "public",
    adminTab: "pending",
    authStatus: "anonymous",
    userId: null,
    email: null,
    registration: {
      ...initialRegistration,
      popFile: null,
      rejectionReason: "",
      generatedReference: "",
    },
  };
}

function loadState(): PortalState {
  if (typeof window === "undefined") return buildInitialState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return buildInitialState();
  try {
    const parsed = JSON.parse(raw) as PortalState;
    return {
      ...buildInitialState(),
      ...parsed,
      registration: { ...buildInitialState().registration, ...parsed.registration },
    };
  } catch {
    return buildInitialState();
  }
}

function persist(state: PortalState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function makeReference(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const suffix = digits.slice(-4) || Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LSS26-${suffix}`;
}

function normalizeRegistration(
  registration: PortalState["registration"],
  profile?: Record<string, unknown> | null
): PortalState["registration"] {
  return {
    ...registration,
    fullName: (profile?.full_name as string) ?? registration.fullName,
    companyName: (profile?.company_name as string) ?? registration.companyName,
    phone: (profile?.phone as string) ?? registration.phone,
    email: (profile?.email as string) ?? registration.email,
    category: ((profile?.category as RegistrationCategory) ?? registration.category) as RegistrationCategory,
    vehiclePasses: Number(profile?.additional_vehicle_passes ?? registration.vehiclePasses ?? 0),
    multiTickets: Number(profile?.additional_multi_tickets ?? registration.multiTickets ?? 0),
    singleTickets: Number(profile?.additional_single_tickets ?? registration.singleTickets ?? 0),
    dinnerTickets: Number(profile?.dinner_tickets_qty ?? registration.dinnerTickets ?? 0),
    wantsAdvertising: Boolean(profile?.wants_advertising ?? registration.wantsAdvertising ?? false),
    sponsorships: ((profile?.selected_sponsorships as string[]) ?? registration.sponsorships ?? []) as string[],
    paymentMethod: (profile?.payment_method as "USD" | "ZWG") ?? registration.paymentMethod,
    verificationStatus: ((profile?.verification_status as VerificationStatus) ?? registration.verificationStatus) as VerificationStatus,
    popFileName: (profile?.pop_file_name as string) ?? registration.popFileName,
    popUploaded: Boolean(profile?.pop_url ?? registration.popUploaded),
    rejectionReason: (profile?.rejection_reason as string) ?? registration.rejectionReason ?? "",
    generatedReference: (profile?.payment_reference as string) ?? registration.generatedReference ?? "",
    popFile: registration.popFile ?? null,
  };
}

async function uploadToSupabase(file: File, userId: string) {
  if (!supabase) throw new Error("Connection not configured");
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from(POP_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(POP_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

async function fetchProfile(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from(PROFILES_TABLE).select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data as Record<string, unknown> | null;
}

async function upsertProfile(userId: string, payload: Record<string, unknown>) {
  if (!supabase) return;
  const { error } = await supabase.from(PROFILES_TABLE).upsert({ id: userId, ...payload }, { onConflict: "id" });
  if (error) throw error;
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortalState>(buildInitialState);
  const [hydrated, setHydrated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persist(state);
  }, [hydrated, state]);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!mounted) return;
      if (error) setAuthError(error.message);
      const session = data.session;
      if (session?.user) {
        const profile = await fetchProfile(session.user.id).catch((err: Error) => {
          setAuthError(err.message);
          return null;
        });
        setState((current) => ({
          ...current,
          authStatus: "authenticated",
          userId: session.user.id,
          email: session.user.email ?? null,
          registration: normalizeRegistration(current.registration, profile),
        }));
      }
      setAuthReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (!session?.user) {
        setState((current) => ({ ...current, authStatus: "anonymous", userId: null, email: null }));
        return;
      }

      const profile = await fetchProfile(session.user.id).catch((err: Error) => {
        setAuthError(err.message);
        return null;
      });

      setState((current) => ({
        ...current,
        authStatus: "authenticated",
        userId: session.user.id,
        email: session.user.email ?? null,
        registration: normalizeRegistration(current.registration, profile),
      }));
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const pricing = useMemo(
    () =>
      calculatePricing({
        category: state.registration.category,
        vehiclePasses: state.registration.vehiclePasses,
        multiTickets: state.registration.multiTickets,
        singleTickets: state.registration.singleTickets,
        dinnerTickets: state.registration.dinnerTickets,
        wantsAdvertising: state.registration.wantsAdvertising,
        sponsorships: state.registration.sponsorships,
      }),
    [state.registration]
  );

  async function clearState() {
    const next = buildInitialState();
    setState(next);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (userId) {
        await supabase.from(PROFILES_TABLE).update({ verification_status: "pending_payment" }).eq("id", userId);
      }
    }
  }

  async function syncProfile(patch: Partial<PortalState["registration"]>) {
    if (!supabase || !state.userId) return;

    const nextRegistration = { ...state.registration, ...patch };
    const nextPricing = calculatePricing({
      category: nextRegistration.category,
      vehiclePasses: nextRegistration.vehiclePasses,
      multiTickets: nextRegistration.multiTickets,
      singleTickets: nextRegistration.singleTickets,
      dinnerTickets: nextRegistration.dinnerTickets,
      wantsAdvertising: nextRegistration.wantsAdvertising,
      sponsorships: nextRegistration.sponsorships,
    });
    await upsertProfile(state.userId, {
      full_name: nextRegistration.fullName,
      company_name: nextRegistration.companyName,
      category: nextRegistration.category,
      phone: nextRegistration.phone,
      email: nextRegistration.email,
      additional_vehicle_passes: nextRegistration.vehiclePasses,
      additional_multi_tickets: nextRegistration.multiTickets,
      additional_single_tickets: nextRegistration.singleTickets,
      dinner_tickets_qty: nextRegistration.dinnerTickets,
      wants_advertising: nextRegistration.wantsAdvertising,
      selected_sponsorships: nextRegistration.sponsorships,
      payment_method: nextRegistration.paymentMethod,
      calculated_total_usd: nextPricing.total,
      is_early_bird: nextPricing.earlyBird,
      verification_status: nextRegistration.verificationStatus,
      pop_file_name: nextRegistration.popFileName,
      pop_url: nextRegistration.popFile?.path ? nextRegistration.popFile.path : null,
      rejection_reason: nextRegistration.rejectionReason || null,
      payment_reference: nextRegistration.generatedReference || makeReference(nextRegistration.phone),
    });
  }

  const actions: PortalContextValue = {
    ...state,
    hydrated,
    pricing,
    authReady,
    supabaseEnabled,
    authError,
    setView: (view) => setState((current) => ({ ...current, view })),
    setAdminTab: (tab) => setState((current) => ({ ...current, adminTab: tab })),
    updateRegistration: async (patch) => {
      setState((current) => ({
        ...current,
        registration: { ...current.registration, ...patch },
      }));
      if (state.userId) {
        await syncProfile(patch).catch((err: Error) => setAuthError(err.message));
      }
    },
    uploadPop: async (file) => {
      if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "File is larger than 5MB." };
      if (!state.userId || !supabase) {
        const dataUrl = await readAsDataUrl(file);
        setState((current) => ({
          ...current,
          view: "locked",
          registration: {
            ...current.registration,
            popFile: { name: file.name, type: file.type, size: file.size, dataUrl },
            popFileName: file.name,
            popUploaded: true,
            verificationStatus: "pending_verification",
            generatedReference: current.registration.generatedReference || makeReference(current.registration.phone),
          },
        }));
        return { ok: true };
      }

      try {
        const upload = await uploadToSupabase(file, state.userId);
        const next = {
          popFile: {
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: upload.publicUrl,
            path: upload.path,
          },
          popFileName: file.name,
          popUploaded: true,
          verificationStatus: "pending_verification" as VerificationStatus,
          generatedReference: state.registration.generatedReference || makeReference(state.registration.phone),
        };
        setState((current) => ({
          ...current,
          view: "locked",
          registration: { ...current.registration, ...next },
        }));
        await syncProfile(next);
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Failed to upload POP." };
      }
    },
  approveApplication: async () => {
      if (supabase && state.userId) {
        const response = await fetch("/api/admin/approval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: state.userId, action: "approve" }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          setAuthError(payload.error || "Approval failed.");
          return;
        }
      }

      const patch = { verificationStatus: "verified" as VerificationStatus, rejectionReason: "" };
      setState((current) => ({
        ...current,
        view: "verified",
        registration: { ...current.registration, ...patch },
      }));
      await syncProfile(patch).catch((err: Error) => setAuthError(err.message));
    },
    rejectApplication: async (reason) => {
      if (supabase && state.userId) {
        const response = await fetch("/api/admin/approval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: state.userId, action: "reject", rejectionReason: reason }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          setAuthError(payload.error || "Rejection failed.");
          return;
        }
      }

      const patch = {
        verificationStatus: "pending_payment" as VerificationStatus,
        rejectionReason: reason,
        popFile: null,
        popFileName: "",
        popUploaded: false,
      };
      setState((current) => ({
        ...current,
        view: "payment",
        registration: { ...current.registration, ...patch },
      }));
      await syncProfile(patch).catch((err: Error) => setAuthError(err.message));
    },
    clearState,
    signUp: async (email, password, fullName) => {
      if (!supabase) return { ok: false, error: "Connection is not configured." };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { ok: false, error: error.message };
      const user = data.user;
      if (user) {
        setState((current) => ({ ...current, authStatus: "authenticated", userId: user.id, email: user.email ?? email }));
      }
      return { ok: true };
    },
    signIn: async (email, password) => {
      if (!supabase) return { ok: false, error: "Connection is not configured." };
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };
      const user = data.user;
      if (user) {
        setState((current) => ({ ...current, authStatus: "authenticated", userId: user.id, email: user.email ?? email }));
      }
      return { ok: true };
    },
    signOut: async () => {
      if (supabase) await supabase.auth.signOut();
      setState((current) => ({ ...current, authStatus: "anonymous", userId: null, email: null }));
    },
    setFromProfile: (profile) => {
      setState((current) => ({
        ...current,
        registration: normalizeRegistration(current.registration, profile),
      }));
    },
  };

  return <PortalContext.Provider value={actions}>{children}</PortalContext.Provider>;
}

export function usePortalStore() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortalStore must be used inside PortalProvider");
  return ctx;
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read upload"));
    reader.readAsDataURL(file);
  });
}
