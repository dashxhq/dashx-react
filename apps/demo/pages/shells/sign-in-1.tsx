import { Button, Flex, Form, Heading, Text, TextField, Theme } from '@dashx/react';

import '@dashx/react/styles.css';

function SignIn1() {
  return (
    <Theme chroma={0} contrast={2} elevation="small" asChild>
      <Flex className="h-full">
        <Flex className="flex-1" justify="center" align="center" direction="column" gap={6}>
          <Flex justify="center" align="center" direction="column" gap={2}>
            <Heading size={7}>Login</Heading>
            <Text variant="secondary">Login with your email</Text>
          </Flex>
          <Flex direction="column" className="w-[350px]" gap={4} asChild>
            <Form>
              <TextField name="email" type="email" label="Email" />
              <TextField name="password" type="password" label="Password" />
              <Button>Login</Button>
              <Button variant="simple">Login with Google</Button>
            </Form>
          </Flex>
          <Text size={1} variant="tertiary">
            Don&apos;t have an account? Sign up
          </Text>
        </Flex>
        <Flex className="hidden flex-1 bg-gray-100 lg:flex"></Flex>
      </Flex>
    </Theme>
  );
}

export default SignIn1;
