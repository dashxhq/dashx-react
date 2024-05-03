import DashX from "@dashx/browser";
import React from "react";
import Client, { ClientParams } from "@dashx/browser/dist/Client";

const DashXContext = React.createContext<Client | null>(null);

function DashXProvider({
  children,
  publicKey,
  baseUri,
  targetEnvironment,
}: React.PropsWithChildren<Partial<ClientParams>>) {
  const dashX = React.useMemo(
    () =>
      DashX({
        publicKey: publicKey || import.meta.env.REACT_APP_DASHX_PUBLIC_KEY,
        baseUri: baseUri || import.meta.env.REACT_APP_DASHX_BASE_URI,
        targetEnvironment:
          targetEnvironment || import.meta.env.REACT_APP_TARGET_ENVIRONMENT,
      }),
    [publicKey, baseUri, targetEnvironment]
  );

  return (
    <DashXContext.Provider value={dashX}>{children}</DashXContext.Provider>
  );
}

export const useDashXProvider = () => {
  const context = React.useContext(DashXContext);
  if (!context) {
    throw new Error(
      "DashXProvider not initialized. Make sure your app is wrapped in DashXProvider."
    );
  }
  return context;
};

export default DashXProvider;
