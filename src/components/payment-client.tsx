"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, Copy, Check, FileText, Trash2 } from "lucide-react";
import { usePortalStore } from "@/components/portal-store";
import { fmt } from "@/lib/format";

const BANK_DETAILS = {
  bankName: "CBZ Chiredzi Branch",
  zwgAccountNumber: "02822820570017",
  nostroUsdAccountNumber: "02822820570027",
  usdToZwgRate: 25.5,
  contactEmail: "lowveldshowsociety4@gmail.com",
};

export default function PaymentClient({ profile, userEmail }: { profile: Record<string, unknown>; userEmail: string | null }) {
  const { uploadPop, setView, signOut } = usePortalStore();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedText, setCopiedText] = useState<"zwg" | "usd" | "ref" | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const paymentReference = String(profile.payment_reference ?? "LSS26-[auto-generated]");
  const total = Number(profile.calculated_total_usd ?? 0);
  const zwgTotal = Math.round(total * BANK_DETAILS.usdToZwgRate * 100) / 100;

  const cleanPhone = String(profile.phone ?? "").replace(/[^0-9]/g, "");
  const refSuffix = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : String(profile.id ?? "").slice(0, 4).toUpperCase();
  const generatedReference = `LSS26-${refSuffix}`;

  const copyToClipboard = (text: string, type: "zwg" | "usd" | "ref") => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        dataUrl: reader.result as string,
      });
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmitPop = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError("");

    try {
      // Convert data URL back to File
      const arr = selectedFile.dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      const blob = new Blob([u8arr], { type: mime });
      const file = new File([blob], selectedFile.name, { type: mime });

      const result = await uploadPop(file);
      if (!result.ok) {
        setError(result.error);
        setIsUploading(false);
        return;
      }
      setSuccess("Proof of payment uploaded successfully. Your application is pending verification.");
      setView("locked");
      setTimeout(() => router.push("/portal"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
      setIsUploading(false);
    }
  };

  return (
    <main className="mx-auto w-[min(1000px,calc(100vw-2rem))] pb-16 pt-10">
      <section className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-glow backdrop-blur-xl">
        <div className="section-header">
          <p className="eyebrow">Payment</p>
          <h1>Bank transfer & proof of payment</h1>
        </div>
        <p className="mt-2 text-white/70">Signed in as {userEmail || "unknown user"}.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* LEFT: Bank Details */}
          <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Bank Transfer Instructions</h2>
              <p className="text-sm text-white/70">Complete a bank transfer using the details below and upload your receipt/statement to unlock your exhibition portal.</p>
            </div>

            {/* ZWG Account */}
            <div className="rounded-lg border border-white/10 bg-black/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-lss-green font-bold">ZWG Account</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-white/60 font-mono uppercase tracking-wider">Bank Name</div>
                <p className="font-semibold text-white">{BANK_DETAILS.bankName}</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-white/60 font-mono uppercase tracking-wider">Account Number</div>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-white text-sm">{BANK_DETAILS.zwgAccountNumber}</p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(BANK_DETAILS.zwgAccountNumber, "zwg")}
                    className="text-xs font-bold text-white/60 hover:text-lss-green transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === "zwg" ? (
                      <>
                        <Check className="h-3 w-3" /> COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> COPY
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-white/60 font-mono uppercase tracking-wider mb-1">Amount Due</div>
                <p className="text-lg font-bold text-lss-gold">{zwgTotal.toLocaleString("en-ZA", { style: "currency", currency: "ZWG" })}</p>
              </div>
            </div>

            {/* USD Account */}
            <div className="rounded-lg border border-white/10 bg-black/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-lss-green font-bold">NOSTRO USD Account</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-white/60 font-mono uppercase tracking-wider">Bank Name</div>
                <p className="font-semibold text-white">{BANK_DETAILS.bankName}</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-white/60 font-mono uppercase tracking-wider">Account Number</div>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-white text-sm">{BANK_DETAILS.nostroUsdAccountNumber}</p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(BANK_DETAILS.nostroUsdAccountNumber, "usd")}
                    className="text-xs font-bold text-white/60 hover:text-lss-green transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === "usd" ? (
                      <>
                        <Check className="h-3 w-3" /> COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> COPY
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-white/60 font-mono uppercase tracking-wider mb-1">Amount Due</div>
                <p className="text-lg font-bold text-lss-gold">${total}</p>
              </div>
            </div>

            {/* Reference Code */}
            <div className="rounded-lg border border-lss-green/30 bg-lss-green/5 p-4 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-lss-green font-bold block">Mandatory Bank Reference</span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-white bg-black/40 px-4 py-2 rounded-lg flex-1 text-center">{generatedReference}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedReference, "ref")}
                  className="bg-gradient-to-r from-lss-green to-lss-gold px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer font-bold text-xs uppercase tracking-widest text-[#041007]"
                >
                  {copiedText === "ref" ? (
                    <>
                      <Check className="h-3 w-3" /> COPIED
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> COPY REF
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Please input this reference code exactly in your banking platform. This will help us identify your payment automatically during audit processing.
              </p>
            </div>

            <button
              onClick={() => signOut().then(() => router.push("/login"))}
              className="text-white/50 hover:text-white underline text-xs font-mono uppercase tracking-wider self-start mt-4 cursor-pointer block"
            >
              &larr; Sign Out
            </button>
          </article>

          {/* RIGHT: POP Upload */}
          <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Upload Proof of Payment</h2>
                <p className="text-sm text-white/70">Exhibitor: <strong className="text-white">{profile.company_name}</strong></p>
              </div>

              {/* Drag & Drop Zone */}
              {!selectedFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[200px] transition duration-150 ${
                    dragActive ? "border-lss-green bg-lss-green/10" : "border-white/20 bg-white/5 hover:border-white/40"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    accept=".png, .jpg, .jpeg, .pdf"
                    className="hidden"
                  />
                  <div className="h-12 w-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-white/60" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    Drag and drop statement here, or <span className="underline hover:text-lss-green">browse files</span>
                  </h3>
                  <p className="text-xs text-white/60 mt-2 max-w-xs leading-normal">
                    Supports PNG, JPG, or PDF statement files up to 5MB. Must show CBZ transaction clearance.
                  </p>
                </div>
              ) : (
                /* Selected File Card */
                <div className="border border-white/10 rounded-lg p-4 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-white/60" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{selectedFile.name}</div>
                      <div className="text-xs text-white/60">{selectedFile.size}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    title="Remove File"
                    className="p-1.5 hover:bg-white/20 rounded-lg text-white/40 hover:text-red-400 transition cursor-pointer shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div className="rounded-lg border border-white/10 bg-black/40 p-4 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Need Immediate Approval?</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  If you have completed a cash payment directly at the LSS offices in Chiredzi or require express verification, contact the treasurer Fidelis Harry (+263 77 242 6985) or email{" "}
                  <a href="mailto:lowveldshowsociety4@gmail.com" className="underline text-lss-green hover:text-lss-gold">
                    lowveldshowsociety4@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Messages & Submit */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              {error && <p className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
              {success && <p className="rounded-lg border border-lss-green/40 bg-lss-green/10 p-3 text-xs text-lss-green">{success}</p>}

              <button
                disabled={!selectedFile || isUploading}
                onClick={handleSubmitPop}
                className={`w-full font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg transition duration-200 ${
                  selectedFile && !isUploading
                    ? "bg-gradient-to-r from-lss-green to-lss-gold text-[#041007] hover:opacity-90 cursor-pointer"
                    : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                }`}
              >
                {isUploading ? "SECURING TRANSFER FILES..." : "SUBMIT PROOF OF PAYMENT FOR AUDIT"}
              </button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
