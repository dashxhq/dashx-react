import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Slot } from '@radix-ui/react-slot';

import { Text } from './text.js';
import { cn } from '../utils/cn.js';
import { tooltip } from '../variants/tooltip.js';
import { Theme } from './theme.js';

type TooltipElement = React.ElementRef<typeof TooltipPrimitive.Content>;

interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {}
const Tooltip = React.forwardRef<TooltipElement, TooltipProps>((props, forwardedRef) => {
  const {
    children,
    className,
    open,
    defaultOpen,
    onOpenChange,
    delayDuration,
    disableHoverableContent,
    content,
    container,
    forceMount,
    ...rest
  } = props;
  const rootProps = { open, defaultOpen, onOpenChange, delayDuration, disableHoverableContent };
  return (
    <TooltipPrimitive.Root {...rootProps}>
      <TooltipPrimitive.Trigger asChild>
        <Slot>{children}</Slot>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal container={container} forceMount={forceMount}>
        <Theme asChild>
          <TooltipPrimitive.Content
            sideOffset={4}
            collisionPadding={10}
            {...rest}
            asChild={false}
            ref={forwardedRef}
            className={'rounded-sm bg-gray-600 py-2 px-4 shadow-md shadow-gray-400/30'}
          >
            <Text className="text-white" as="p" size={2}>
              {content}
            </Text>
            <TooltipPrimitive.Arrow className="fill-gray-600" />
          </TooltipPrimitive.Content>
        </Theme>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
});
Tooltip.displayName = 'Tooltip';

export { Tooltip };
export type { TooltipProps };
