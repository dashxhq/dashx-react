import { Slot } from '@radix-ui/react-slot';
import { filterDOMProps } from '@react-aria/utils';
import { useFocusableRef } from '@react-spectrum/utils';
import React, { forwardRef, isValidElement } from 'react';
import { mergeProps, useButton, useFocusRing, useHover } from 'react-aria';
import { cva } from 'class-variance-authority';

import { cn } from '../utils/cn.js';

import type { VariantProps } from 'class-variance-authority';
import type { ElementType } from 'react';
import type { AriaButtonProps, HoverEvents } from 'react-aria';
import type { FocusableRef } from '@react-types/shared';

const button = cva(
  'inline-flex items-center justify-center outline-none transition-[box-shadow,background-color,color] duration-300 ease-[cubic-bezier(0.25, select-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-30',
  {
    variants: {
      size: {
        small: 'min-w-18 h-8 rounded-md px-2 md:h-6 md:min-w-14 md:rounded-sm',
        medium: 'h-10 min-w-24 rounded-lg px-3 md:h-8 md:min-w-16 md:rounded-md',
        large: 'h-12 min-w-28 rounded-xl px-4 md:h-10 md:min-w-24 md:rounded-lg',
        extralarge: 'h-14 min-w-32 rounded-2xl px-5 md:h-14 md:min-w-28 md:rounded-xl',
      },
      variant: {
        fill: 'text-gray-50',
        outline: 'border-2',
        simple: 'border-1 hover:ring-1 hover:ring-inset',
        ghost: '',
      },
      mode: {
        distinct: 'data-[focus-visible]:outline-accent-300',
        subtle: 'data-[focus-visible]:outline-accent-300',
        negative: 'data-[focus-visible]:outline-negative-300',
      },
      roundness: {
        none: '',
        small: '',
        medium: '',
        large: '',
        full: '',
      },
      // TODO: shadow
    },
    defaultVariants: {
      size: 'medium',
      mode: 'distinct',
      variant: 'fill',
    },
    compoundVariants: [
      {
        mode: 'distinct',
        variant: 'fill',
        className: 'bg-accent-600 hover:bg-accent-700 active:bg-accent-800',
      },
      {
        mode: 'distinct',
        variant: 'outline',
        className: 'text-accent-600 hover:text-accent-700 active:text-accent-800',
      },
      {
        mode: 'distinct',
        variant: 'simple',
        className:
          'text-accent-600 hover:text-accent-700 active:text-accent-800 hover:ring-accent-700 active:ring-accent-800',
      },
      {
        mode: 'distinct',
        variant: 'ghost',
        className:
          'text-accent-600 hover:text-accent-700 active:text-accent-800 hover:bg-accent-100 active:bg-accent-200',
      },
      {
        mode: 'subtle',
        variant: 'fill',
        className: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800',
      },
      {
        mode: 'subtle',
        variant: 'outline',
        className: 'text-gray-600 hover:text-gray-700 active:text-gray-800',
      },
      {
        mode: 'subtle',
        variant: 'simple',
        className:
          'text-gray-600 hover:text-gray-700 hover:ring-gray-700 active:text-gray-800 active:ring-gray-800',
      },
      {
        mode: 'subtle',
        variant: 'ghost',
        className:
          'text-gray-600 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 active:text-gray-800',
      },
      {
        mode: 'negative',
        variant: 'fill',
        className: 'bg-negative-600 hover:bg-negative-700 active:bg-negative-800',
      },
      {
        mode: 'negative',
        variant: 'outline',
        className: 'text-negative-600 hover:text-negative-700 active:text-negative-800',
      },
      {
        mode: 'negative',
        variant: 'simple',
        className:
          'text-negative-600 hover:text-negative-700 hover:ring-negative-700 active:text-negative-800 active:ring-negative-800',
      },
      {
        mode: 'negative',
        variant: 'ghost',
        className:
          'text-negative-600 hover:bg-negative-100 hover:text-negative-700 active:bg-negative-200 active:text-negative-800',
      },
    ],
  },
);

type ButtonStyleProps = VariantProps<typeof button>;

export interface ButtonProps
  extends Omit<AriaButtonProps, 'elementType' | 'href' | 'target' | 'rel'>,
    HoverEvents,
    ButtonStyleProps {
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
