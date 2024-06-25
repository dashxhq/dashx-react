import { Button, Card, Flex, Heading, Popover, Text, Theme, Tooltip } from '@dashx/react';
import { button, heading, text } from '@dashx/react/variants';
import { Bell, Inbox, Mail, MailOpen, X } from '@dashx/react/icons';
import Link from 'next/link';
import React, { useState } from 'react';

import '@dashx/react/styles.css';

const onPress = () => console.log('pressed');

const QUICK_BROWN_FOX = 'The quick brown fox jumps over the lazy dog.';

const COLOR_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
function Index() {
  const [baseColor, setBaseColor] = useState('#9661E2');
  const [baseDensity, setBaseDensity] = useState(1);
  return (
    <Theme accentBaseColor={baseColor} density={baseDensity} className="dr">
      <Flex direction="column" gap={4}>
        <Flex gap={4} align="center" justify="end">
          <Popover.Root open>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Popover.Trigger>
                  <Button shape="square" roundness="full" variant="ghost">
                    <Inbox />
                  </Button>
                </Popover.Trigger>
              </Tooltip.Trigger>
              <Tooltip.Content content="Notification" />
            </Tooltip.Root>
            <Popover.Content spacing="large" width="350px">
              <Popover.Header asChild>
                <Flex justify="between" align="center">
                  <Heading size={3}>Notifications</Heading>
                  <Popover.Close>
                    <Button
                      shape="square"
                      roundness="full"
                      variant="ghost"
                      mode="subtle"
                      inset="right"
                    >
                      <X />
                    </Button>
                  </Popover.Close>
                </Flex>
              </Popover.Header>
              <Popover.Body>
                <Flex direction="column" gap={1}>
                  <Card>
                    <Flex align="center" justify="between" gap={4}>
                      <Flex direction="column" gap={1}>
                        <Text as="p" variant="secondary" weight="semibold" size={2}>
                          {QUICK_BROWN_FOX}
                        </Text>
                        <Text size={1} variant="tertiary">
                          Today
                        </Text>
                      </Flex>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <Button shape="square" variant="ghost">
                            <MailOpen />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content content="Mark as read" />
                      </Tooltip.Root>
                    </Flex>
                  </Card>
                  <Card>
                    <Flex align="center" justify="between" gap={4}>
                      <Flex direction="column" gap={1}>
                        <Text as="p" variant="secondary" weight="semibold" size={2}>
                          {QUICK_BROWN_FOX}
                        </Text>
                        <Text size={1} variant="tertiary">
                          Yesterday
                        </Text>
                      </Flex>
                      <Button shape="square" variant="ghost">
                        <Mail />
                      </Button>
                    </Flex>
                  </Card>
                  <Card>
                    <Flex align="center" justify="between" gap={4}>
                      <Flex direction="column" gap={1}>
                        <Text as="p" variant="secondary" weight="semibold" size={2}>
                          {QUICK_BROWN_FOX}
                        </Text>
                        <Text size={1} variant="tertiary">
                          2 days ago
                        </Text>
                      </Flex>
                      <Button shape="square" variant="ghost">
                        <MailOpen />
                      </Button>
                    </Flex>
                  </Card>
                </Flex>
              </Popover.Body>
              <Popover.Footer asChild>
                <Text as="p" align="center" color="accent" variant="tertiary" size={1}>
                  Powered by DashX
                </Text>
              </Popover.Footer>
            </Popover.Content>
          </Popover.Root>
        </Flex>
        <Flex justify="center">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => {
              setBaseColor(e.target.value);
            }}
          />
          <input
            type="range"
            min={0.75}
            max={1.5}
            onChange={(e) => {
              setBaseDensity(Number(e.target.value));
            }}
            value={baseDensity}
            step={0.05}
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
