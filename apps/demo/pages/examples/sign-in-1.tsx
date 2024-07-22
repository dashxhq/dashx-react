import React from 'react'

import { Button, Card, Flex, Theme } from '@dashx/react'

import Logo from '../../components/logo';

import '@dashx/react/styles.css';

export default function SignIn1() {
    return (
        <Theme>
            <Flex justify="center" className="py-2">
                <Logo />
            </Flex>
            <Card>
                <Button size="large">
                    Example
                </Button>
            </Card>
        </Theme>
    )
}
