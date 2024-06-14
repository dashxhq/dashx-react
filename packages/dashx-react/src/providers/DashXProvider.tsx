import DashX from '@dashx/browser';
import React from 'react';

import type { Client, ClientParams } from '@dashx/browser';

const DashXContext = React.createContext<Client | null>(null);

function DashXProvider({
  children,
  publicKey,
  baseUri,
  realtimeBaseUri,
  targetEnvironment,
}: React.PropsWithChildren<ClientParams>) {
  const dashX = React.useMemo(
    () =>
      DashX({
        publicKey: publicKey,
        baseUri: baseUri,
        realtimeBaseUri: realtimeBaseUri,
        targetEnvironment: targetEnvironment,
      }),
    [publicKey, baseUri, realtimeBaseUri, targetEnvironment],
  );

  return <DashXContext.Provider value={dashX}>{children}</DashXContext.Provider>;
}

export default DashXProvider;
export { DashXContext };
