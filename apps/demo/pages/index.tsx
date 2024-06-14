import {
  Button,
  Card,
  Flex,
  Heading,
  Popover,
  Text,
  Theme,
  Tooltip,
  useDashXProvider,
} from '@dashx/react';
import { button, heading, text } from '@dashx/react/variants';
import { Bell } from '@dashx/react/icons';
import Link from 'next/link';
import React, { Suspense, useState } from 'react';

import '@dashx/react/styles.css';
import { NotificationBell } from '@dashx/react/widgets';
import dynamic from 'next/dynamic';

const onPress = () => console.log('pressed');

const QUICK_BROWN_FOX = 'The quick brown fox jumps over the lazy dog.';

const DashXProvider = dynamic(() => import('@dashx/react').then((p) => p.DashXProvider), {
  ssr: false,
});

const NotificationBellWrapper = () => {
  const dashx = useDashXProvider();

  dashx.identify('1');

  return <NotificationBell />;
};

const COLOR_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
function Index() {
  const [baseColor, setBaseColor] = useState('#9661E2');
  return (
    <Theme accentBaseColor={baseColor} className="dr">
      <Flex direction="column" gap={4}>
        <Flex gap={4} align="center">
          <Suspense>
            {/* eslint-disable-next-line turbo/no-undeclared-env-vars */}
            <DashXProvider publicKey={process.env.NEXT_PUBLIC_DASHX_PUBLIC_KEY}>
              <NotificationBellWrapper />
            </DashXProvider>
          </Suspense>
        </Flex>
        <Flex justify="center">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => {
              setBaseColor(e.target.value);
            }}
          />
        </Flex>
        <Flex justify="center">
          {COLOR_SCALE.map((color) => (
            <div
              key={color}
              className="test"
              style={{
                display: 'inline-block',
                height: 80,
                width: 80,
                backgroundColor: `var(--color-accent-${color})`,
              }}
            >
              <p style={{ color: 'var(--color-white)' }}>{color}</p>
              <p style={{ color: 'var(--color-black)' }}>{color}</p>
            </div>
          ))}
        </Flex>
        <Flex justify="center">
          {COLOR_SCALE.map((color) => (
            <div
              key={color}
              className="test"
              style={{
                display: 'inline-block',
                height: 80,
                width: 80,
                backgroundColor: `var(--color-gray-${color})`,
              }}
            >
              <p style={{ color: 'var(--color-white)' }}>{color}</p>
              <p style={{ color: 'var(--color-black)' }}>{color}</p>
            </div>
          ))}
        </Flex>
        <Flex justify="center">
          {COLOR_SCALE.map((color) => (
            <div
              key={color}
              className="test"
              style={{
                display: 'inline-block',
                height: 80,
                width: 80,
                backgroundColor: `var(--color-negative-${color})`,
              }}
            >
              <p style={{ color: 'var(--color-white)' }}>{color}</p>
              <p style={{ color: 'var(--color-black)' }}>{color}</p>
            </div>
          ))}
        </Flex>
        <Heading>Typography</Heading>
        <Flex align="baseline">
          {Object.keys(heading.variants.size).map((size: any) => (
            <Heading size={size} key={size}>
              Aa
            </Heading>
          ))}
        </Flex>
        {Object.keys(text.variants.size).map((size: any) => (
          <Text size={size} key={size}>
            {QUICK_BROWN_FOX}
          </Text>
        ))}

        <Heading>Button</Heading>
        <Flex gap={4}>
          <Button onPress={onPress}>Button</Button>
        </Flex>
        <Heading>Link</Heading>
        <Flex gap={4}>
          <Button onPress={onPress} asChild>
            <a onClick={() => console.log('link clicked')} href="#">
              HTML Link
            </a>
          </Button>
          <Button onPress={onPress} asChild>
            <Link onClick={() => console.log('link clicked')} href="#">
              Next Link
            </Link>
          </Button>
        </Flex>
        <Heading>Span</Heading>
        <Flex gap={4}>
          <Button onPress={onPress} asChild>
            <span onClick={() => console.log('span clicked')}>Span</span>
          </Button>
          <Button onPress={onPress} asChild>
            <div onClick={() => console.log('div clicked')}>Div</div>
          </Button>
        </Flex>
        <Heading>Sizes</Heading>
        <Flex gap={4}>
          {Object.keys(button.variants.size).map((size: any) => (
            <Button key={size} size={size} onPress={onPress}>
              {size}
            </Button>
          ))}
        </Flex>
        <Heading>Variants</Heading>
        {Object.keys(button.variants.mode).map((mode: any) => (
          <React.Fragment key={mode}>
            <Text>{mode}</Text>
            <Flex gap={4}>
              {Object.keys(button.variants.variant).map((variant: any) => (
                <Button key={variant} mode={mode} variant={variant} onPress={onPress}>
                  {variant}
                </Button>
              ))}
            </Flex>
          </React.Fragment>
        ))}
        <Heading>Disabled</Heading>
        {Object.keys(button.variants.mode).map((mode: any) => (
          <React.Fragment key={mode}>
            <Text>{mode}</Text>
            <Flex gap={4}>
              {Object.keys(button.variants.variant).map((variant: any) => (
                <Button key={variant} mode={mode} variant={variant} isDisabled>
                  {variant}
                </Button>
              ))}
            </Flex>
          </React.Fragment>
        ))}
        <Heading>Roundness</Heading>
        {Object.keys(button.variants.size).map((size: any) => (
          <Flex key={size} gap={4}>
            {Object.keys(button.variants.roundness).map((roundness: any) => (
              <Button key={roundness} size={size} roundness={roundness}>
                {roundness}
              </Button>
            ))}
          </Flex>
        ))}

        {Object.keys(button.variants.size).map((size: any) => (
          <Flex key={size} gap={4}>
            {Object.keys(button.variants.roundness).map((roundness: any) => (
              <Button key={roundness} size={size} roundness={roundness} shape="square">
                <Bell />
              </Button>
            ))}
          </Flex>
        ))}
      </Flex>
    </Theme>
  );
}

export default Index;
