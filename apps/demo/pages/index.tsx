import {
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  Heading,
  Link,
  NumberField,
  Popover,
  Text,
  TextArea,
  TextField,
  Theme,
  Tooltip,
} from '@dashx/react';
import { button, checkbox, heading, link, text } from '@dashx/react/variants';
import { Bell, Inbox, Mail, MailOpen, Moon, Sun, X } from '@dashx/react/icons';
import NextLink from 'next/link';
import React, { Fragment, useState } from 'react';

import '@dashx/react/styles.css';

const onPress = () => console.log('pressed');

const QUICK_BROWN_FOX = 'The quick brown fox jumps over the lazy dog.';

const COLOR_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
function Index() {
  const [baseColor, setBaseColor] = useState('#9661E2');
  const [baseDensity, setBaseDensity] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [chroma, setChroma] = useState(1);
  const [roundness, setRoundness] = useState<'medium' | 'small' | 'none' | 'large' | 'full'>(
    'medium',
  );
  const [elevation, setElevation] = useState<'medium' | 'small' | 'none' | 'large'>('medium');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  return (
    <Theme
      accentBaseColor={baseColor}
      density={baseDensity}
      roundness={roundness}
      elevation={elevation}
      contrast={contrast}
      mode={mode}
      chroma={chroma}
    >
      <Flex direction="column" gap={4} className="bg-gray-50">
        <Flex gap={4} align="center" justify="end">
          <Popover.Root open>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Popover.Trigger>
                  <Button shape="square">
                    <Inbox />
                  </Button>
                </Popover.Trigger>
              </Tooltip.Trigger>
              <Tooltip.Content content="Notification" />
            </Tooltip.Root>
            <Popover.Content spacing="large" width={`calc(350px + 50px / ${baseDensity})`}>
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
                          <Button shape="square" variant="ghost" roundness="full">
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
                      <Button shape="square" variant="ghost" roundness="full">
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
                      <Button shape="square" variant="ghost" roundness="full">
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
        <Flex>
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
        <Flex>
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
        <Flex>
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
        <Heading>Link</Heading>
        <Link href="/shells/sign-in-1">Plain Link</Link>
        <Link asChild>
          <NextLink href="/shells/sign-in-1">Next Link</NextLink>
        </Link>

        {Object.keys(link.variants.color).map((color: any) => (
          <Flex key={color} gap={4}>
            {Object.keys(link.variants.underline).map((underline: any) => (
              <Link key={underline} href="#" color={color} underline={underline}>
                {color} {underline}
              </Link>
            ))}
          </Flex>
        ))}

        <Heading>Checkbox</Heading>

        {Object.keys(checkbox.variants.size).map((size: any) => (
          <Flex key={size} gap={4}>
            {Object.keys(checkbox.variants.roundness).map((roundness: any) => (
              <Checkbox
                name={`${roundness}-${size}`}
                key={roundness}
                size={size}
                roundness={roundness}
                // description="Description"
              >
                Check me
              </Checkbox>
            ))}
          </Flex>
        ))}

        <Heading>Text Area</Heading>

        {Object.keys(button.variants.size).map((size: any) => (
          <Flex key={size} gap={4}>
            {Object.keys(button.variants.roundness).map((roundness: any) => (
              <TextArea
                name={`${roundness}-${size}`}
                label="Text Area"
                key={roundness}
                size={size}
                roundness={roundness}
                description="Description"
              />
            ))}
          </Flex>
        ))}

        <Heading>Number Field</Heading>

        {Object.keys(button.variants.size).map((size: any) => (
          <Flex key={size} gap={4}>
            {Object.keys(button.variants.roundness).map((roundness: any) => (
              <NumberField
                name={`${roundness}-${size}`}
                label="Number"
                key={roundness}
                size={size}
                roundness={roundness}
                description="Description"
              />
            ))}
          </Flex>
        ))}

        <Heading>Text Field</Heading>

        {Object.keys(button.variants.size).map((size: any) => (
          <Flex key={size} gap={4}>
            {Object.keys(button.variants.roundness).map((roundness: any) => (
              <TextField
                isInvalid
                name={`${roundness}-${size}`}
                label="Text"
                key={roundness}
                size={size}
                roundness={roundness}
                value="Text"
                description="Description"
                errorMessage={'Cannot be blank'}
              />
            ))}
          </Flex>
        ))}

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
            <NextLink onClick={() => console.log('link clicked')} href="#">
              Next Link
            </NextLink>
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
        <Heading>As Text</Heading>
        <Flex gap={4}>
          <Button onPress={onPress} asChild>
            <Text onClick={() => console.log('span clicked')}>Span</Text>
          </Button>
          <Button onPress={onPress} asChild>
            <Text as="div" onClick={() => console.log('div clicked')}>
              Div
            </Text>
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
        <Flex gap={4}>
          {Object.keys(button.variants.size).map((size: any) => (
            <Button shape="square" key={size} size={size} onPress={onPress}>
              <Bell />
            </Button>
          ))}
        </Flex>
        <Heading>Variants</Heading>
        {Object.keys(button.variants.mode).map((mode: any) => (
          <Fragment key={mode}>
            <Text>{mode}</Text>
            <Flex gap={4}>
              {Object.keys(button.variants.variant).map((variant: any) => (
                <Button key={variant} mode={mode} variant={variant} onPress={onPress}>
                  {variant}
                </Button>
              ))}
            </Flex>
            <Flex gap={4}>
              {Object.keys(button.variants.variant).map((variant: any) => (
                <Button
                  shape="square"
                  key={variant}
                  mode={mode}
                  variant={variant}
                  onPress={onPress}
                >
                  <Bell />
                </Button>
              ))}
            </Flex>
          </Fragment>
        ))}
        <Heading>Disabled</Heading>
        {Object.keys(button.variants.mode).map((mode: any) => (
          <Fragment key={mode}>
            <Text>{mode}</Text>
            <Flex gap={4}>
              {Object.keys(button.variants.variant).map((variant: any) => (
                <Button key={variant} mode={mode} variant={variant} isDisabled>
                  {variant}
                </Button>
              ))}
            </Flex>
            <Flex gap={4}>
              {Object.keys(button.variants.variant).map((variant: any) => (
                <Fragment key={variant}>
                  <Button
                    shape="square"
                    key={variant}
                    mode={mode}
                    variant={variant}
                    onPress={onPress}
                    isDisabled
                  >
                    <Bell />
                  </Button>
                </Fragment>
              ))}
            </Flex>
          </Fragment>
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
        <Theme density={1}>
          <Card asChild>
            <div
              style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
              }}
            >
              <Flex justify="center" align="baseline" gap={4}>
                <Text>Elevation</Text>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    None
                    <input
                      type="radio"
                      onChange={(e) => {
                        setElevation('none');
                      }}
                      checked={elevation === 'none'}
                    />
                  </Text>
                </Flex>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    Small
                    <input
                      type="radio"
                      onChange={(e) => {
                        setElevation('small');
                      }}
                      checked={elevation === 'small'}
                    />
                  </Text>
                </Flex>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    Medium
                    <input
                      type="radio"
                      onChange={(e) => {
                        setElevation('medium');
                      }}
                      checked={elevation === 'medium'}
                    />
                  </Text>
                </Flex>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    Large
                    <input
                      type="radio"
                      onChange={(e) => {
                        setElevation('large');
                      }}
                      checked={elevation === 'large'}
                    />
                  </Text>
                </Flex>
              </Flex>
              <Flex justify="center" align="baseline" gap={4}>
                <Text>Roundness</Text>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    None
                    <input
                      type="radio"
                      onChange={(e) => {
                        setRoundness('none');
                      }}
                      checked={roundness === 'none'}
                    />
                  </Text>
                </Flex>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    Small
                    <input
                      type="radio"
                      onChange={(e) => {
                        setRoundness('small');
                      }}
                      checked={roundness === 'small'}
                    />
                  </Text>
                </Flex>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    Medium
                    <input
                      type="radio"
                      onChange={(e) => {
                        setRoundness('medium');
                      }}
                      checked={roundness === 'medium'}
                    />
                  </Text>
                </Flex>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    Large
                    <input
                      type="radio"
                      onChange={(e) => {
                        setRoundness('large');
                      }}
                      checked={roundness === 'large'}
                    />
                  </Text>
                </Flex>
                <Flex asChild gap={1} align="center">
                  <Text as="label">
                    Full
                    <input
                      type="radio"
                      onChange={(e) => {
                        setRoundness('full');
                      }}
                      checked={roundness === 'full'}
                    />
                  </Text>
                </Flex>
              </Flex>
              <Flex justify="center" align="center" gap={4}>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    Density
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
                  </Text>
                </Flex>
              </Flex>
              <Flex justify="center" align="center" gap={4}>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    Contrast
                    <input
                      type="range"
                      min={0.5}
                      max={2}
                      onChange={(e) => {
                        setContrast(Number(e.target.value));
                      }}
                      value={contrast}
                      step={0.1}
                    />
                  </Text>
                </Flex>
              </Flex>
              <Flex justify="center" align="center" gap={4}>
                <Flex asChild gap={2} align="center">
                  <Text as="label">
                    Chroma
                    <input
                      type="range"
                      min={0}
                      max={2}
                      onChange={(e) => {
                        setChroma(Number(e.target.value));
                      }}
                      value={chroma}
                      step={0.1}
                    />
                  </Text>
                </Flex>
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
              <Flex>
                <Flex gap={2} align="center">
                  <Text as="label">Mode</Text>
                  <Button
                    elevation="none"
                    variant={mode === 'dark' ? 'ghost' : 'fill'}
                    mode={mode === 'dark' ? 'subtle' : 'distinct'}
                    onPress={() => setMode('light')}
                  >
                    <Sun /> Light
                  </Button>
                  <Button
                    elevation="none"
                    variant={mode === 'light' ? 'ghost' : 'fill'}
                    mode={mode === 'light' ? 'subtle' : 'distinct'}
                    onPress={() => setMode('dark')}
                  >
                    <Moon /> Dark
                  </Button>
                </Flex>
              </Flex>
            </div>
          </Card>
        </Theme>
      </Flex>
    </Theme>
  );
}

export default Index;
