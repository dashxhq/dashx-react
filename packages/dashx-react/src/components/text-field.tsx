import {
  FieldError,
  Text as BaseText,
  TextField as BaseTextField,
  Label,
  Input,
} from 'react-aria-components';

import { cn } from '../utils/cn.js';
import { textField } from '../variants/index.js';
import { Flex, Text } from './index.js';
import { fieldError } from '../variants/field-error.js';

import type { TextFieldVariantProps } from '../variants/index.js';
import type { TextFieldProps as BaseTextFieldProps, ValidationResult } from 'react-aria-components';

interface TextFieldProps extends BaseTextFieldProps, TextFieldVariantProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

function TextField({
  label,
  description,
  errorMessage,
  size = 'medium',
  roundness = 'medium',
  elevation = 'medium',
  ...props
}: TextFieldProps) {
  return (
    <Flex gap={2} direction="column" asChild>
      <BaseTextField {...props}>
        {label && (
          <Text asChild size={1} transform="uppercase" weight="semibold" variant="tertiary">
            <Label>{label}</Label>
          </Text>
        )}
        <div className="relative" data-radius={roundness} data-shadow={elevation}>
          <Input className={cn('dx', 'w-full', textField({ size, roundness, elevation }))} />
          <Text asChild size={1} className={cn('dx', fieldError({ size, roundness, elevation }))}>
            <FieldError data-radius={roundness} data-shadow={elevation}>
              {errorMessage}
            </FieldError>
          </Text>
        </div>
        {description && (
          <Text asChild size={1} variant="tertiary">
            <BaseText slot="description">{description}</BaseText>
          </Text>
        )}
      </BaseTextField>
    </Flex>
  );
}

export { TextField };
