import {
  FieldError,
  Text as BaseText,
  NumberField as BaseNumberField,
  Label,
  Input,
  Group,
} from 'react-aria-components';

import { useRect } from '@radix-ui/react-use-rect';

import { cn } from '../utils/cn.js';
import { textField } from '../variants/index.js';
import { Button, Flex, Text } from './index.js';
import { fieldError } from '../variants/field-error.js';

import type { TextFieldVariantProps } from '../variants/index.js';
import type {
  NumberFieldProps as BaseNumberFieldProps,
  ValidationResult,
} from 'react-aria-components';
import { ArrowDown, ArrowDown01, ChevronDown, ChevronUp } from 'lucide-react';
import { useRef, useState } from 'react';

interface NumberFieldProps extends BaseNumberFieldProps, TextFieldVariantProps {
  placeholder?: string;
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

function NumberField({
  label,
  description,
  errorMessage,
  size = 'medium',
  roundness = 'medium',
  elevation = 'medium',
  ...props
}: NumberFieldProps) {
  const [appendEl, setAppendEl] = useState<HTMLDivElement | null>(null);
  const appendRect = useRect(appendEl);

  return (
    <Flex gap={2} direction="column" asChild>
      <BaseNumberField {...props}>
        {label && (
          <Text asChild size={1} transform="uppercase" weight="semibold" variant="tertiary">
            <Label>{label}</Label>
          </Text>
        )}
        <Group className="relative" data-radius={roundness} data-shadow={elevation}>
          <Input
            style={{
              // @ts-ignore
              '--append-padding-right': appendRect ? `${appendRect.width}px` : 0,
            }}
            className={cn('dx', 'w-full', textField({ size, roundness, elevation }))}
          />
          <Flex
            ref={setAppendEl}
            direction={['large', 'extralarge'].includes(size) ? 'column' : 'row-reverse'}
            align={['large', 'extralarge'].includes(size) ? 'start' : 'center'}
            justify={['large', 'extralarge'].includes(size) ? 'center' : 'start'}
            className={cn('absolute top-[0] bottom-[0] transform', {
              'right-3': ['extrasmall', 'small'].includes(size),
              'right-4': ['medium', 'large'].includes(size),
              'right-6': size === 'extralarge',
            })}
          >
            <Button
              size="extrasmall"
              shape="square"
              variant="ghost"
              mode="subtle"
              inset="right"
              slot="increment"
            >
              <ChevronUp />
            </Button>
            <Button
              size="extrasmall"
              shape="square"
              variant="ghost"
              mode="subtle"
              inset="right"
              slot="decrement"
            >
              <ChevronDown />
            </Button>
          </Flex>
          <Text asChild size={1} className={cn('dx', fieldError({ size, roundness, elevation }))}>
            <FieldError data-radius={roundness} data-shadow={elevation}>
              {errorMessage}
            </FieldError>
          </Text>
        </Group>
        {description && (
          <Text asChild size={1} variant="tertiary">
            <BaseText slot="description">{description}</BaseText>
          </Text>
        )}
      </BaseNumberField>
    </Flex>
  );
}

export { NumberField };
