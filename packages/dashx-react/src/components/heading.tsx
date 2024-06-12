import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { heading, type HeadingVariantProps } from '../variants/heading.js';

interface HeadingOwnProps extends HeadingVariantProps {
  asChild?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

type HeadingProps = HeadingOwnProps & React.HTMLAttributes<HTMLHeadingElement>;

const Heading = React.forwardRef<HTMLDivElement, HeadingProps>((props, ref) => {
  const {
    as: Tag = 'h1',
    asChild,
    children,
    className,
    size,
    align,
    color,
    variant,
    ...rest
  } = props;

  return (
    <Slot className={heading({ size, align, color, variant, className })} ref={ref} {...rest}>
      {asChild ? children : <Tag>{children}</Tag>}
    </Slot>
  );
});

Heading.displayName = 'Heading';

export { Heading };
