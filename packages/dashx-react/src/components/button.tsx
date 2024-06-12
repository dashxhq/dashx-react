import { Slot } from '@radix-ui/react-slot';
import { filterDOMProps, mergeRefs } from '@react-aria/utils';
import React, { forwardRef, isValidElement, useRef } from 'react';
import { mergeProps, useButton, useFocusRing, useHover } from 'react-aria';

import { cn } from '../utils/cn.js';
import { button } from '../variants/button.js';

import type { ElementType } from 'react';
import type { AriaButtonProps, HoverEvents } from 'react-aria';
import type { ButtonVariantProps } from '../variants/button.js';

export interface ButtonProps
  extends Omit<AriaButtonProps, 'elementType' | 'href' | 'target' | 'rel'>,
    HoverEvents,
    ButtonVariantProps {
  asChild?: boolean;
}

function _Button(props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) {
  const { asChild, children, size, mode, variant, roundness, shape } = props;
  let elementType = asChild
    ? (isValidElement(children) && (children?.type as ElementType)) || 'button'
    : 'button';
  const innerRef = useRef<HTMLButtonElement>(null);
  let { buttonProps, isPressed } = useButton({ ...props, elementType }, innerRef);
  let { focusProps, isFocused, isFocusVisible } = useFocusRing(props);
  let { hoverProps, isHovered } = useHover(props);

  let Comp = asChild ? Slot : 'button';
  console.log(buttonProps);
  return (
    <Comp
      {...filterDOMProps(props)}
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      ref={mergeRefs(ref, innerRef)}
      data-disabled={props.isDisabled || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      className={cn('dr', button({ size, mode, variant, roundness, shape }), {
        'rounded-full': roundness === 'full',
        'md:rounded-full': roundness === 'full',
      })}
      data-radius={roundness}
    >
      {children}
    </Comp>
  );
}

const Button = forwardRef(_Button);

export { Button };
