import { filterDOMProps } from '@react-aria/utils';
import { forwardRef, useRef, type ReactNode, useEffect } from 'react';
import { useContextProps, TextFieldContext } from 'react-aria-components';
import { useTextField } from 'react-aria';
import type { TextFieldProps, ValidationResult } from 'react-aria-components';

import { cn } from '../utils/cn.js';
import { fieldError } from '../variants/field-error.js';
import { Flex, Text } from './index.js';
import { removeDataAttributes } from '../utils/helpers.js';
import { textArea, type TextAreaVariantProps } from '../variants/text-area.js';

const MAX_HEIGHT = 180;

interface TextAreaProps extends TextFieldProps, TextAreaVariantProps {
  placeholder?: string;
  label?: string;
  description?: string | ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
  autogrow?: boolean;
}

function _TextArea(
  {
    label,
    description,
    errorMessage,
    size = 'medium',
    roundness = 'medium',
    elevation = 'medium',
    autogrow = false,
    ...props
  }: TextAreaProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TextFieldContext);
  let inputRef = useRef<HTMLTextAreaElement>(null);

  let { labelProps, inputProps, descriptionProps, errorMessageProps, ...validation } =
    useTextField<any>(
      {
        ...removeDataAttributes(props),
        inputElementType: 'text-area',
        label,
      },
      inputRef,
    );

  useEffect(() => {
    if (autogrow && inputRef.current) {
      inputRef.current.style.height = "0px";
      const scrollHeight = inputRef.current.scrollHeight;

      inputRef.current.style.height = Math.min(scrollHeight, MAX_HEIGHT) + "px";
    }
  }, [autogrow, inputRef, inputProps.value]);

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
      <Flex role="group" className="relative" data-radius={roundness} data-shadow={elevation}>
        <textarea
          {...inputProps}
          ref={inputRef}
          className={cn('dx', 'w-full resize-none', textArea({ size, roundness, elevation }))}
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
      </Flex>
      {description && (
        <Text size={1} variant="tertiary" {...descriptionProps}>
          {description}
        </Text>
      )}
    </Flex>
  );
}

const TextArea = forwardRef(_TextArea);

export { TextArea };
