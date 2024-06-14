import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../utils/cn.js';
import { popover, popoverBody, popoverFooter, popoverHeader } from '../variants/popover.js';
import { SPACING } from '../variants/card.js';
import { Theme } from './theme.js';

import type { PopoverVariantProps } from '../variants/popover.js';

interface PopoverRootProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {}
const PopoverRoot: React.FC<PopoverRootProps> = (props: PopoverRootProps) => (
  <PopoverPrimitive.Root {...props} />
);
PopoverRoot.displayName = 'Popover.Root';

type PopoverTriggerElement = React.ElementRef<typeof PopoverPrimitive.Trigger>;
interface PopoverTriggerProps extends React.PropsWithChildren<{}> {}
const PopoverTrigger = React.forwardRef<PopoverTriggerElement, PopoverTriggerProps>(
  ({ children, ...rest }, ref) => (
    <PopoverPrimitive.Trigger {...rest} ref={ref} asChild>
      <Slot>{children}</Slot>
    </PopoverPrimitive.Trigger>
  ),
);
PopoverTrigger.displayName = 'Popover.Trigger';

type PopoverContentElement = React.ElementRef<typeof PopoverPrimitive.Content>;
interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>,
    PopoverVariantProps {
  maxWidth?: number | string;
  minWidth?: number | string;
  width?: number | string;
  maxHeight?: number | string;
  minHeight?: number | string;
  height?: number | string;
}
const PopoverContent = React.forwardRef<PopoverContentElement, PopoverContentProps>(
  (props, ref) => {
    const {
      forceMount,
      container,
      roundness,
      spacing = 'medium',
      maxWidth,
      minWidth,
      width,
      maxHeight,
      minHeight,
      height,
      ...rest
    } = props;
    return (
      <PopoverPrimitive.Portal container={container} forceMount={forceMount}>
        <Theme roundness={roundness} asChild>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            collisionPadding={10}
            {...rest}
            ref={ref}
            className={cn(popover({ roundness }))}
            style={{
              // @ts-ignore
              '--padding': SPACING[spacing],
              '--max-width': maxWidth,
              '--min-width': minWidth,
              '--width': width,
              '--max-height': maxHeight,
              '--min-height': minHeight,
              '--height': height,
            }}
          />
        </Theme>
      </PopoverPrimitive.Portal>
    );
  },
);
PopoverContent.displayName = 'Popover.Content';

type PopoverBodyProps = React.PropsWithChildren<{
  asChild?: boolean;
}>;
const PopoverBody = React.forwardRef<HTMLDivElement, PopoverBodyProps>((props, ref) => {
  let { asChild, ...rest } = props;
  let Comp = asChild ? Slot : 'div';

  return <Comp ref={ref} {...rest} className={cn(popoverBody())} />;
});
PopoverBody.displayName = 'Popover.Body';

type PopoverHeaderProps = React.PropsWithChildren<{
  asChild?: boolean;
}>;
const PopoverHeader = React.forwardRef<HTMLDivElement, PopoverHeaderProps>((props, ref) => {
  let { asChild, ...rest } = props;
  let Comp = asChild ? Slot : 'div';

  return <Comp ref={ref} {...rest} className={cn(popoverHeader())} />;
});
PopoverHeader.displayName = 'Popover.Header';

type PopoverFooterProps = React.PropsWithChildren<{
  asChild?: boolean;
}>;
const PopoverFooter = React.forwardRef<HTMLDivElement, PopoverFooterProps>((props, ref) => {
  let { asChild, ...rest } = props;
  let Comp = asChild ? Slot : 'div';

  return <Comp ref={ref} {...rest} className={cn(popoverFooter())} />;
});
PopoverFooter.displayName = 'Popover.Footer';

type PopoverCloseElement = React.ElementRef<typeof PopoverPrimitive.Close>;
interface PopoverCloseProps extends React.PropsWithChildren<{}> {}
const PopoverClose = React.forwardRef<PopoverCloseElement, PopoverCloseProps>(
  ({ children }, ref) => (
    <PopoverPrimitive.Close ref={ref} asChild>
      <Slot>{children}</Slot>
    </PopoverPrimitive.Close>
  ),
);
PopoverClose.displayName = 'Popover.Close';

export {
  PopoverRoot as Root,
  PopoverContent as Content,
  PopoverBody as Body,
  PopoverHeader as Header,
  PopoverFooter as Footer,
  PopoverTrigger as Trigger,
  PopoverClose as Close,
};
export type {
  PopoverRootProps as RootProps,
  PopoverContentProps as ContentProps,
  PopoverBodyProps as BodyProps,
  PopoverHeaderProps as HeaderProps,
  PopoverFooterProps as FooterProps,
  PopoverTriggerProps as TriggerProps,
  PopoverCloseProps as CloseProps,
};
