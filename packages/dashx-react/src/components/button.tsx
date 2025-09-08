import React, { forwardRef, isValidElement, useRef } from 'react';
import { ButtonContext, useContextProps, type SlotProps } from 'react-aria-components';
import { filterDOMProps, mergeRefs } from '@react-aria/utils';
import { mergeProps, useButton, useFocusRing, useHover } from 'react-aria';
import { Slot } from '@radix-ui/react-slot';
import type { ElementType } from 'react';
import type { AriaButtonProps, HoverEvents } from 'react-aria';

import { button } from '../variants/button.js';
import { cn } from '../utils/cn.js';
import { fallbackEventTo } from '../utils/helpers.js';
import type { ButtonVariantProps } from '../variants/button.js';

export interface ButtonProps
  extends Omit<AriaButtonProps, 'elementType' | 'href' | 'target' | 'rel'>,
    SlotProps,
    HoverEvents,
    ButtonVariantProps {
  className?: string;
  asChild?: boolean;
}

function _Button(props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) {
  [props, ref] = useContextProps(props, ref, ButtonContext);
  const { asChild, children, size, mode, variant, roundness, elevation, shape, inset, className } = props;
  let elementType = asChild
    ? (isValidElement(children) && (children?.type as ElementType)) || 'button'
    : 'button';

  const [onPress, onClick] = fallbackEventTo(props, 'onPress', 'onClick');
  const [onPressStart, onPointerDown] = fallbackEventTo(props, 'onPressStart', 'onPointerDown');
  const [onHoverStart, onPointerMove] = fallbackEventTo(props, 'onHoverStart', 'onPointerMove');
  const [onHoverEnd, onPointerLeave] = fallbackEventTo(props, 'onHoverEnd', 'onPointerLeave');
  const innerRef = useRef<HTMLButtonElement>(null);
  let { buttonProps, isPressed } = useButton(
    {
      ...props,
      elementType,
      onPress,
      onPressStart,
      // @ts-ignore
      onClick,
      // @ts-ignore
      onPointerDown,
      // @ts-ignore
      onPointerMove,
      // @ts-ignore
      onPointerLeave,
    },
    innerRef,
  );
  let { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

  let { hoverProps, isHovered } = useHover({
    ...props,
    onHoverStart,
    onHoverEnd,
  });

  let Comp = asChild ? Slot : 'button';

  return (
    <Comp
      {...filterDOMProps(props)}
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      slot={props.slot || undefined}
      ref={mergeRefs(ref, innerRef)}
      data-disabled={props.isDisabled || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      className={cn('dx', button({ size, mode, variant, roundness, elevation, shape }), className)}
      data-radius={roundness}
      data-shadow={elevation}
      data-inset={inset}
    >
      {children}
    </Comp>
  );
}

const Button = forwardRef(_Button);

export { Button };
