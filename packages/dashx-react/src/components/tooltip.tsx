import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Slot } from '@radix-ui/react-slot';

import { Text } from './text.js';
import { Theme } from './theme.js';

type TooltipElement = React.ElementRef<typeof TooltipPrimitive.Content>;

interface TooltipRootProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {}
const TooltipRoot: React.FC<TooltipRootProps> = (props: TooltipRootProps) => (
  <TooltipPrimitive.Root {...props} />
);
TooltipRoot.displayName = 'Tooltip.Root';

type TooltipTriggerElement = React.ElementRef<typeof TooltipPrimitive.Trigger>;
interface TooltipTriggerProps extends React.PropsWithChildren<{}> {}
const TooltipTrigger = React.forwardRef<TooltipTriggerElement, TooltipTriggerProps>(
  ({ children, ...rest }, ref) => (
    <TooltipPrimitive.Trigger {...rest} ref={ref} asChild>
      <Slot>{children}</Slot>
    </TooltipPrimitive.Trigger>
  ),
);
TooltipTrigger.displayName = 'Tooltip.Trigger';

interface TooltipProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>,
      'children' | 'className'
    >,
    Omit<
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
      'children' | 'className'
    > {}
const TooltipContent = React.forwardRef<TooltipElement, TooltipProps>((props, forwardedRef) => {
  const { content, container, forceMount, ...rest } = props;

  return (
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
  );
});
TooltipContent.displayName = 'Tooltip.Content';

export { TooltipContent as Content, TooltipRoot as Root, TooltipTrigger as Trigger };
export type { TooltipProps };
