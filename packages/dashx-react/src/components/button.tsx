import { Slot } from '@radix-ui/react-slot';
import { filterDOMProps } from '@react-aria/utils';
import { useFocusableRef } from '@react-spectrum/utils';
import React, { forwardRef, isValidElement } from 'react';
import { mergeProps, useButton, useFocusRing, useHover } from 'react-aria';

import type { ElementType } from 'react';
import type { AriaButtonProps, HoverEvents } from 'react-aria';
import type { FocusableRef } from '@react-types/shared';

import { cn } from '../utils/cn.js';
import { button, type ButtonVariantProps } from '../variants/button.js';

export interface ButtonProps
  extends Omit<AriaButtonProps, 'elementType' | 'href' | 'target' | 'rel'>,
    HoverEvents,
    ButtonVariantProps {
  asChild?: boolean;
}

function _Button(props: ButtonProps, ref: FocusableRef<HTMLButtonElement>) {
  const { asChild, children, size, mode, variant, roundness } = props;
  let elementType = asChild
    ? (isValidElement(children) && (children?.type as ElementType)) || 'button'
    : 'button';
  let domRef = useFocusableRef(ref);
  let { buttonProps, isPressed } = useButton({ ...props, elementType }, domRef);
  let { focusProps, isFocused, isFocusVisible } = useFocusRing(props);
  let { hoverProps, isHovered } = useHover(props);

  let Comp = asChild ? Slot : 'button';

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
      className={cn(button({ size, mode, variant, roundness }), {
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
