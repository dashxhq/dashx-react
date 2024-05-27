import { Flex } from '../../../packages/dashx-react/dist/cjs';
import type { AppProps } from 'next/app';

import '../global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Flex direction="column" gap={6}>
      <Flex justify="center" gap={6}>
        <a href="./simple">Simple</a>
        <a href="./elegant">Elegant</a>
        <a href="./playful">Playful</a>
        <a href="./material">Material</a>
        <a href="./custom">Custom</a>
      </Flex>
      <Component {...pageProps} />
    </Flex>
  );
}
