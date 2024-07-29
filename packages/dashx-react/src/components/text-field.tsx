import { useContextProps, TextFieldContext } from 'react-aria-components';
import { cn } from '../utils/cn.js';
import { textField } from '../variants/index.js';
import { Flex, Text } from './index.js';
import { fieldError } from '../variants/field-error.js';
import { filterDOMProps } from '@react-aria/utils';
import { useTextField } from 'react-aria';
import { forwardRef, useRef, type ReactNode } from 'react';

import type { TextFieldVariantProps } from '../variants/index.js';
import type { TextFieldProps as BaseTextFieldProps, ValidationResult } from 'react-aria-components';

interface TextFieldProps extends BaseTextFieldProps, TextFieldVariantProps {
  placeholder?: string;
  label?: string;
  description?: string | ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function removeDataAttributes<T>(props: T): T {
  const prefix = /^(data-.*)$/;
  let filteredProps = {} as T;

  for (const prop in props) {
    if (!prefix.test(prop)) {
      filteredProps[prop] = props[prop];
    }
  }

  return filteredProps;
}

function _TextField(
  {
    label,
    description,
    errorMessage,
    size = 'medium',
    roundness = 'medium',
    elevation = 'medium',
    ...props
  }: TextFieldProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TextFieldContext);
  let inputRef = useRef(null);

  let { labelProps, inputProps, descriptionProps, errorMessageProps, ...validation } =
    useTextField<any>(
      {
        ...removeDataAttributes(props),
        inputElementType: 'input',
        label,
      },
      inputRef,
    );

  return (
    <Flex
      {...filterDOMProps(props)}
      gap={2}
      direction="column"
      ref={ref}
      slot={props.slot || undefined}
      data-disabled={props.isDisabled || undefined}
      data-invalid={validation.isInvalid || undefined}
      data-readonly={props.isReadOnly || undefined}
      data-required={props.isRequired || undefined}
    >
      {label && (
        <Text
          {...labelProps}
          size={1}
          transform="uppercase"
          weight="semibold"
          variant="tertiary"
          color="gray"
        >
          {label}
        </Text>
      )}
      <div role="group" className="relative" data-radius={roundness} data-shadow={elevation}>
        <input
          {...inputProps}
          ref={inputRef}
          className={cn('dx', 'w-full', textField({ size, roundness, elevation }))}
          data-disabled={props.isDisabled || undefined}
          data-invalid={validation.isInvalid || undefined}
          data-readonly={props.isReadOnly || undefined}
          data-required={props.isRequired || undefined}
        />
        {validation.isInvalid && (
          <Text
            {...errorMessageProps}
            size={1}
            className={cn('dx', fieldError({ size, roundness, elevation }))}
          >
            {errorMessage
              ? typeof errorMessage === 'string'
                ? errorMessage
                : errorMessage(validation)
              : validation.validationErrors.length === 0
                ? undefined
                : validation.validationErrors.join(' ')}
          </Text>
        )}
      </div>
      {description && (
        <Text size={1} variant="tertiary" {...descriptionProps}>
          {description}
        </Text>
      )}
    </Flex>
  );
}

const TextField = forwardRef(_TextField);

export { TextField };
