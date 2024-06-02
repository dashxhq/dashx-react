import { Button, Header } from '@dashx/react';
import Link from 'next/link';
import React from 'react';

function Index() {
  const onPress = () => console.log('pressed');
  return (
    <div className="dr">
      <Header>Button</Header>
      <Button onPress={onPress}>Button</Button>
      <Header>Link</Header>
      <Button onPress={onPress} asChild>
        <a onClick={() => console.log('link clicked')} href="#">
          Click me
        </a>
      </Button>
      <Button onPress={onPress} asChild>
        <Link onClick={() => console.log('link clicked')} href="#">
          Click me
        </Link>
      </Button>
      <Header>Span</Header>
      <Button onPress={onPress} asChild>
        <span onClick={() => console.log('span clicked')}>Click me</span>
      </Button>
    </div>
  );
}

export default Index;
