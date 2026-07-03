"use client";

import { PortalProvider } from "./portal-store";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <PortalProvider>{children}</PortalProvider>;
}
