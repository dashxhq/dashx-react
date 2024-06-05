import { Button, Flex, Header, Text } from '@dashx/react';
import Link from 'next/link';
import React, { useState } from 'react';

import '@dashx/react/styles.css';

const onPress = () => console.log('pressed');

const COLOR_SCALE = [50, 100, 200, 300, 400, 500, 600, 800, 900, 950];
function Index() {
  const [baseColor, setBaseColor] = useState('#9661E2');
  return (
    <div className="dr">
      <Flex
        direction="column"
        gap={4}
        data-chroma-boosted="true"
        style={{
          '--accent-base': baseColor,
        }}
      >
        <Flex justify="center">
          <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} />
        </Flex>
        <Flex>
          {COLOR_SCALE.map((color) => (
            <div
              key={color}
              style={{
                display: 'inline-block',
                height: 50,
                width: 50,
                backgroundColor: `var(--color-accent-${color})`,
              }}
            ></div>
          ))}
        </Flex>
        <Header>Button</Header>
        <Flex gap={4}>
          <Button onPress={onPress}>Button</Button>
        </Flex>
        <Header>Link</Header>
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
        <Header>Span</Header>
        <Flex gap={4}>
          <Button onPress={onPress} asChild>
            <span onClick={() => console.log('span clicked')}>Span</span>
          </Button>
          <Button onPress={onPress} asChild>
            <div onClick={() => console.log('div clicked')}>Div</div>
          </Button>
        </Flex>
        <Header>Sizes</Header>
        <Flex gap={4}>
          <Button size="small" onPress={onPress}>
            Small
          </Button>
          <Button size="medium" onPress={onPress}>
            Medium
          </Button>
          <Button size="large" onPress={onPress}>
            Large
          </Button>
          <Button size="extralarge" onPress={onPress}>
            Extra Large
          </Button>
        </Flex>
        <Header>Variants</Header>
        <Text>Distinct</Text>
        <Flex gap={4}>
          <Button mode="distinct" variant="fill">
            fill
          </Button>
          <Button mode="distinct" variant="outline">
            outline
          </Button>
          <Button mode="distinct" variant="simple">
            simple
          </Button>
          <Button mode="distinct" variant="ghost">
            ghost
          </Button>
        </Flex>
        <Text>Subtle</Text>
        <Flex gap={4}>
          <Button mode="subtle" variant="fill">
            fill
          </Button>
          <Button mode="subtle" variant="outline">
            outline
          </Button>
          <Button mode="subtle" variant="simple">
            simple
          </Button>
          <Button mode="subtle" variant="ghost">
            ghost
          </Button>
        </Flex>
        <Text>Negative</Text>
        <Flex gap={4}>
          <Button mode="negative" variant="fill">
            fill
          </Button>
          <Button mode="negative" variant="outline">
            outline
          </Button>
          <Button mode="negative" variant="simple">
            simple
          </Button>
          <Button mode="negative" variant="ghost">
            ghost
          </Button>
        </Flex>
        <Header>Disabled</Header>
        <Text>Distinct</Text>
        <Flex gap={4}>
          <Button isDisabled mode="distinct" variant="fill">
            fill
          </Button>
          <Button isDisabled mode="distinct" variant="outline">
            outline
          </Button>
          <Button isDisabled mode="distinct" variant="simple">
            simple
          </Button>
          <Button isDisabled mode="distinct" variant="ghost">
            ghost
          </Button>
        </Flex>
        <Text>Subtle</Text>
        <Flex gap={4}>
          <Button isDisabled mode="subtle" variant="fill">
            fill
          </Button>
          <Button isDisabled mode="subtle" variant="outline">
            outline
          </Button>
          <Button isDisabled mode="subtle" variant="simple">
            simple
          </Button>
          <Button isDisabled mode="subtle" variant="ghost">
            ghost
          </Button>
        </Flex>
        <Text>Negative</Text>
        <Flex gap={4}>
          <Button mode="negative" variant="fill">
            fill
          </Button>
          <Button mode="negative" variant="outline">
            outline
          </Button>
          <Button mode="negative" variant="simple">
            simple
          </Button>
          <Button mode="negative" variant="ghost">
            ghost
          </Button>
        </Flex>
        <Header>Roundness</Header>
        <Flex gap={4}>
          <Button size="small" roundness="none">
            Button
          </Button>
          <Button size="small" roundness="small">
            Button
          </Button>
          <Button size="small" roundness="medium">
            Button
          </Button>
          <Button size="small" roundness="large">
            Button
          </Button>
          <Button size="small" roundness="full">
            Button
          </Button>
        </Flex>
        <Flex gap={4}>
          <Button size="medium" roundness="none">
            Button
          </Button>
          <Button size="medium" roundness="small">
            Button
          </Button>
          <Button size="medium" roundness="medium">
            Button
          </Button>
          <Button size="medium" roundness="large">
            Button
          </Button>
          <Button size="medium" roundness="full">
            Button
          </Button>
        </Flex>
        <Flex gap={4}>
          <Button size="large" roundness="none">
            Button
          </Button>
          <Button size="large" roundness="small">
            Button
          </Button>
          <Button size="large" roundness="medium">
            Button
          </Button>
          <Button size="large" roundness="large">
            Button
          </Button>
          <Button size="large" roundness="full">
            Button
          </Button>
        </Flex>
        <Flex gap={4}>
          <Button size="extralarge" roundness="none">
            Button
          </Button>
          <Button size="extralarge" roundness="small">
            Button
          </Button>
          <Button size="extralarge" roundness="medium">
            Button
          </Button>
          <Button size="extralarge" roundness="large">
            Button
          </Button>
          <Button size="extralarge" roundness="full">
            Button
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}

export default Index;
