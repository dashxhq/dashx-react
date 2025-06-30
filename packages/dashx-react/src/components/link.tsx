import { LinkContext, TextContext, useContextProps, type SlotProps } from 'react-aria-components';
import { filterDOMProps, mergeRefs } from '@react-aria/utils';
import {
  forwardRef,
  isValidElement,
  type ElementType,
  type ForwardedRef,
  type ReactNode,
} from 'react';
import { mergeProps, useFocusRing, useHover, useLink } from 'react-aria';
import { Slot } from '@radix-ui/react-slot';
import { useRef } from 'react';
import type { AriaLinkOptions, HoverEvents } from 'react-aria';

import { link, type LinkVariantProps } from '../variants/index.js';
import { fallbackEventTo } from '../utils/helpers.js';

export interface LinkProps
  extends Omit<AriaLinkOptions, 'elementType'>,
    SlotProps,
    HoverEvents,
    LinkVariantProps {
  asChild?: boolean;
  children?: ReactNode;
}

function _Link(props: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) {
  // @ts-ignore
  [props, ref] = useContextProps(props, ref, TextContext);
  [props, ref] = useContextProps(props, ref, LinkContext);
  const { asChild, children, size, align, color, variant, weight, transform, underline } = props;
  let elementType = asChild
    ? (isValidElement(children) && (children?.type as ElementType)) || 'a'
    : 'a';

  const [onPress, onClick] = fallbackEventTo(props, 'onPress', 'onClick');
  const [onPressStart, onPointerDown] = fallbackEventTo(props, 'onPressStart', 'onPointerDown');
  const [onHoverStart, onPointerMove] = fallbackEventTo(props, 'onHoverStart', 'onPointerMove');
  const [onHoverEnd, onPointerLeave] = fallbackEventTo(props, 'onHoverEnd', 'onPointerLeave');
  const innerRef = useRef<HTMLAnchorElement>(null);
  let { linkProps, isPressed } = useLink(
    {
      ...props,
      // @ts-ignore
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

  let Comp = asChild ? Slot : 'a';

  return (
    <Comp
      {...filterDOMProps(props)}
      {...mergeProps(linkProps, focusProps, hoverProps)}
      slot={props.slot || undefined}
      ref={mergeRefs(ref, innerRef)}
      data-disabled={props.isDisabled || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      // @ts-ignore
      data-current={!!props['aria-current'] || undefined}
      className={link({ size, align, color, variant, weight, transform, underline })}
    >
      {children}
    </Comp>
  );
}

const Link = /*#__PURE__*/ forwardRef(_Link);
export { Link };
