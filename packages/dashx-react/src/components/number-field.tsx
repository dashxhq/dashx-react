import { useRect } from '@radix-ui/react-use-rect';
import { NumberFieldContext, useContextProps } from 'react-aria-components';
import { useNumberFieldState } from 'react-stately';
import { cn } from '../utils/cn.js';
import { fieldError } from '../variants/field-error.js';
import { textField } from '../variants/index.js';
import { Button, Flex, Text } from './index.js';
import { filterDOMProps } from '@react-aria/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { forwardRef, useRef, useState, type ReactNode } from 'react';
import { useLocale, useNumberField } from 'react-aria';
import { removeDataAttributes } from '../utils/helpers.js';
import type {
  NumberFieldProps as BaseNumberFieldProps,
  ValidationResult,
} from 'react-aria-components';
import type { TextFieldVariantProps } from '../variants/index.js';

interface NumberFieldProps extends BaseNumberFieldProps, TextFieldVariantProps {
  placeholder?: string;
  label?: string;
  description?: string | ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

function _NumberField(
  {
    label,
    description,
    errorMessage,
    size = 'medium',
    roundness = 'medium',
    elevation = 'medium',
    ...props
  }: NumberFieldProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [appendEl, setAppendEl] = useState<HTMLDivElement | null>(null);
  const appendRect = useRect(appendEl);
  [props, ref] = useContextProps(props, ref, NumberFieldContext);

  let { locale } = useLocale();
  let state = useNumberFieldState({
    ...props,
    locale,
  });

  let inputRef = useRef<HTMLInputElement>(null);

  let {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useNumberField(
    {
      ...removeDataAttributes(props),
      label,
    },
    state,
    inputRef,
  );

  return (
    <>
      <Flex
        gap={2}
        direction="column"
        {...filterDOMProps(props)}
        ref={ref}
        slot={props.slot || undefined}
        data-disabled={props.isDisabled || undefined}
        data-invalid={validation.isInvalid || undefined}
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
        <div {...groupProps} className="relative" data-radius={roundness} data-shadow={elevation}>
          <input
            {...inputProps}
            ref={inputRef}
            style={{
              // @ts-ignore
              '--append-padding-right': appendRect ? `${appendRect.width}px` : 0,
            }}
            className={cn('dx', 'w-full', textField({ size, roundness, elevation }))}
            data-disabled={props.isDisabled || undefined}
            data-invalid={validation.isInvalid || undefined}
            data-readonly={props.isReadOnly || undefined}
            data-required={props.isRequired || undefined}
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
              {...incrementButtonProps}
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
              {...decrementButtonProps}
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
      {props.name && (
        <input
          type="hidden"
          name={props.name}
          value={isNaN(state.numberValue) ? '' : state.numberValue}
        />
      )}
    </>
  );
}

const NumberField = forwardRef(_NumberField);

export { NumberField };
