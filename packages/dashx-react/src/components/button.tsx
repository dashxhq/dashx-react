import { Slot } from '@radix-ui/react-slot';
import { filterDOMProps } from '@react-aria/utils';
import { useFocusableRef } from '@react-spectrum/utils';
import type { FocusableRef } from '@react-types/shared';
import React, { forwardRef, isValidElement, type ElementType } from 'react';
import {
  mergeProps,
  useButton,
  useFocusRing,
  useHover,
  type AriaButtonProps,
  type HoverEvents,
} from 'react-aria';

export interface ButtonProps extends AriaButtonProps, HoverEvents {
  asChild?: boolean;
}

function _Button(props: ButtonProps, ref: FocusableRef<HTMLButtonElement>) {
  let elementType = props.asChild
    ? (isValidElement(props.children) && (props.children?.type as ElementType)) || 'button'
    : 'button';
  let domRef = useFocusableRef(ref);
  let { buttonProps, isPressed } = useButton({ ...props, elementType }, domRef);
  let { focusProps, isFocused, isFocusVisible } = useFocusRing(props);
  let { hoverProps, isHovered } = useHover(props);

  let Comp = props.asChild ? Slot : 'button';

  return (
    <Comp
      {...filterDOMProps(props)}
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      ref={domRef}
      data-disabled={props.isDisabled || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      className="bg-accent"
    >
      {props.children}
    </Comp>
  );
}

const Button = forwardRef(_Button);

export { Button };
