import {
  CheckboxContext,
  CheckboxGroupContext,
  CheckboxGroupStateContext,
  FormContext,
  useContextProps,
  useSlottedContext,
  type SlotProps,
  type ValidationResult,
} from 'react-aria-components';
import {
  type AriaCheckboxGroupProps,
  type AriaCheckboxProps,
  type HoverEvents,
  mergeProps,
  useCheckbox,
  useCheckboxGroup,
  useCheckboxGroupItem,
  useFocusRing,
  useHover,
  VisuallyHidden,
} from 'react-aria';
import { useCheckboxGroupState, useToggleState } from 'react-stately';
import { filterDOMProps, mergeRefs, useObjectRef } from '@react-aria/utils';
import {
  forwardRef,
  useContext,
  type ForwardedRef,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { Text } from './text';
import { Flex } from './flex';
import { fieldError } from '../variants/field-error';
import { cn } from '../utils/cn';
import { checkbox, type CheckboxVariantProps } from '../variants';

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, 'validationState'>,
    CheckboxVariantProps,
    SlotProps {
  placeholder?: string;
  label?: string;
  description?: string | ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children?: ReactNode;
}
export interface CheckboxProps
  extends Omit<AriaCheckboxProps, 'validationState'>,
    HoverEvents,
    SlotProps,
    CheckboxVariantProps {
  inputRef?: MutableRefObject<HTMLInputElement>;
  children?: ReactNode;
}

function _CheckboxGroup(props: CheckboxGroupProps, ref: ForwardedRef<HTMLDivElement>) {
  [props, ref] = useContextProps(props, ref, CheckboxGroupContext);
  let { validationBehavior: formValidationBehavior } = useSlottedContext(FormContext) || {};
  let validationBehavior = props.validationBehavior ?? formValidationBehavior ?? 'native';
  let state = useCheckboxGroupState({
    ...props,
    validationBehavior,
  });

  let { groupProps, labelProps, descriptionProps, errorMessageProps, ...validation } =
    useCheckboxGroup(
      {
        ...props,
        validationBehavior,
      },
      state,
    );

  return (
    <Flex
      {...groupProps}
      direction="column"
      gap={2}
      ref={ref}
      slot={props.slot || undefined}
      data-readonly={state.isReadOnly || undefined}
      data-required={props.isRequired || undefined}
      data-invalid={state.isInvalid || undefined}
      data-disabled={props.isDisabled || undefined}
    >
      {props.label && (
        <Text
          {...labelProps}
          size={1}
          transform="uppercase"
          weight="semibold"
          variant="tertiary"
          color="gray"
        >
          {props.label}
        </Text>
      )}
      <CheckboxGroupStateContext.Provider value={state}>
        {props.children}
      </CheckboxGroupStateContext.Provider>
      {validation.isInvalid && (
        <Text {...errorMessageProps} size={1} className={cn('dx', fieldError({}))}>
          {props.errorMessage
            ? typeof props.errorMessage === 'string'
              ? props.errorMessage
              : props.errorMessage(validation)
            : validation.validationErrors.length === 0
              ? undefined
              : validation.validationErrors.join(' ')}
        </Text>
      )}

      {props.description && (
        <Text size={1} variant="tertiary" {...descriptionProps}>
          {props.description}
        </Text>
      )}
    </Flex>
  );
}

function _Checkbox(
  { size = 'medium', roundness = 'medium', elevation = 'medium', ...props }: CheckboxProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  let { inputRef: userProvidedInputRef = null, ...otherProps } = props;
  [props, ref] = useContextProps(otherProps, ref, CheckboxContext);
  let { validationBehavior: formValidationBehavior } = useSlottedContext(FormContext) || {};
  let validationBehavior = props.validationBehavior ?? formValidationBehavior ?? 'native';
  let groupState = useContext(CheckboxGroupStateContext);
  let inputRef = useObjectRef(
    mergeRefs(userProvidedInputRef, props.inputRef !== undefined ? props.inputRef : null),
  );
  let { labelProps, inputProps, isSelected, isDisabled, isReadOnly, isPressed, isInvalid } =
    groupState
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useCheckboxGroupItem(
          {
            ...props,
            // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
            // it's passed explicitly here to avoid typescript error (requires ignore).
            // @ts-ignore
            value: props.value,
            // ReactNode type doesn't allow function children.
            children: typeof props.children === 'function' ? true : props.children,
          },
          groupState,
          inputRef,
        )
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useCheckbox(
          {
            ...props,
            children: typeof props.children === 'function' ? true : props.children,
            validationBehavior,
            // eslint-disable-next-line react-hooks/rules-of-hooks
          },
          useToggleState(props),
          inputRef,
        );
  let { isFocused, isFocusVisible, focusProps } = useFocusRing();
  let isInteractionDisabled = isDisabled || isReadOnly;

  let { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isInteractionDisabled,
  });

  return (
    <Flex asChild gap={2}>
      <Text
        as="label"
        {...mergeProps(filterDOMProps(props), labelProps, hoverProps)}
        color="gray"
        variant={isSelected ? 'primary' : 'secondary'}
        ref={ref}
        slot={props.slot || undefined}
        data-selected={isSelected || undefined}
        data-indeterminate={props.isIndeterminate || undefined}
        data-pressed={isPressed || undefined}
        data-hovered={isHovered || undefined}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-disabled={isDisabled || undefined}
        data-readonly={isReadOnly || undefined}
        data-invalid={isInvalid || undefined}
        data-required={props.isRequired || undefined}
        size={
          (
            {
              small: 1,
              medium: 2,
              large: 3,
            } as const
          )[size]
        }
      >
        <VisuallyHidden elementType="span">
          <input {...mergeProps(inputProps, focusProps)} ref={inputRef} />
        </VisuallyHidden>
        <Flex
          data-radius={roundness}
          data-elevation={elevation}
          data-selected={isSelected || undefined}
          data-indeterminate={props.isIndeterminate || undefined}
          data-pressed={isPressed || undefined}
          data-hovered={isHovered || undefined}
          data-focused={isFocused || undefined}
          data-focus-visible={isFocusVisible || undefined}
          data-disabled={isDisabled || undefined}
          data-readonly={isReadOnly || undefined}
          data-invalid={isInvalid || undefined}
          data-required={props.isRequired || undefined}
          justify="center"
          align="center"
          className={cn('dx', checkbox({ size, roundness }))}
        >
          {isSelected ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 11 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.43968 6.18236L2.31836 4.06104"
                stroke="currentColor"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="square"
              />
              <path
                d="M5.85419 4.76739L8.68262 1.93896"
                stroke="currentColor"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="square"
              />
            </svg>
          ) : null}
        </Flex>
        {props.children}
      </Text>
    </Flex>
  );
}

const Checkbox = forwardRef(_Checkbox);

const CheckboxGroup = forwardRef(_CheckboxGroup);

export { Checkbox, CheckboxGroup };
