import { useEffect, useState } from 'react';
import { WebsocketMessage } from '@dashx/browser';
import type { ProductVariantReleaseRule, WebsocketMessageType } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';
import { useWebSocket } from '../providers/DashXProvider.js';

type UseProductReleaseHookResponse = {
  productVariantReleaseRule: ProductVariantReleaseRule | null;
};

const useProductRelease = (): UseProductReleaseHookResponse => {
  let dashX = useDashXProvider();
  const { subscribe } = useWebSocket();
  const [productVariantReleaseRule, setProductVariantReleaseRule] = useState<ProductVariantReleaseRule | null>(null);

  useEffect(() => {
    // Set up product variant release rule watcher (automatically refetch on WebSocket reconnection)
    dashX.watchFetchProductVariantReleaseRule(setProductVariantReleaseRule);
  }, [dashX]);

  useEffect(() => {
    // Subscribe to WebSocket messages for product variant release updates
    const unsubscribe = subscribe((message: WebsocketMessageType) => {
      if (message?.type === WebsocketMessage.PRODUCT_VARIANT_RELEASE_RULE_UPDATED) {
        setProductVariantReleaseRule(message.data);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  return {
    productVariantReleaseRule,
  };
};

export default useProductRelease;
