import { Button, Card, Flex, Form, Heading, Text, TextField, Theme } from '@dashx/react';
import { Moon, Sun } from '@dashx/react/icons';

import '@dashx/react/styles.css';
import { useState } from 'react';

function SignIn1() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  return (
    <Theme chroma={0} contrast={2} mode={mode} elevation="small" asChild>
      <Flex className="bg-bg h-full" justify="center" align="center">
        <div className="absolute top-4 right-4">
          <Button
            elevation="none"
            shape="square"
            variant={mode === 'dark' ? 'ghost' : 'fill'}
            mode={mode === 'dark' ? 'subtle' : 'distinct'}
            onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
          >
            {mode === 'light' ? <Moon /> : <Sun />}
          </Button>
        </div>
        <Card spacing="extralarge">
          <Flex direction="column" gap={6}>
            <Flex direction="column" gap={2}>
              <Heading size={6}>Login</Heading>
              <Text variant="secondary">Login with your email</Text>
            </Flex>
            <Flex direction="column" className="w-[350px]" gap={4} asChild>
              <Form>
                <TextField name="email" type="email" label="Email" placeholder="user@dashx.com" />
                <TextField name="password" type="password" label="Password" />
                <Button>Login</Button>
                <Button variant="simple">Login with Google</Button>
              </Form>
            </Flex>
            <Text align="center" size={2} variant="tertiary">
              Don&apos;t have an account? Sign up
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Theme>
  );
}

export default SignIn1;
