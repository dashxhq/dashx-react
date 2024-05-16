import DashX from "@dashx/browser";
import React from "react";
import type { Client, ClientParams } from "@dashx/browser";

const DashXContext = React.createContext<Client | null>(null);

function DashXProvider({
  children,
  publicKey,
  baseUri,
  targetEnvironment,
}: React.PropsWithChildren<ClientParams>) {
  const dashX = React.useMemo(
    () =>
      DashX({
        publicKey: publicKey,
        baseUri: baseUri,
        targetEnvironment: targetEnvironment,
      }),
    [publicKey, baseUri, targetEnvironment]
  );

  return (
    <DashXContext.Provider value={dashX}>{children}</DashXContext.Provider>
  );
}

export default DashXProvider;
export { DashXContext }
