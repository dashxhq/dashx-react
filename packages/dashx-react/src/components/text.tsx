import React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { text } from '../variants/text.js';

import type { TextVariantProps } from '../variants/text.js';

interface TextOwnProps extends TextVariantProps {
  asChild?: boolean;
}

type TextSpanProps = { as?: 'span' } & React.HTMLAttributes<HTMLSpanElement>;
type TextDivProps = { as: 'div' } & React.HTMLAttributes<HTMLDivElement>;
type TextLabelProps = { as: 'label' } & React.HTMLAttributes<HTMLLabelElement>;
type TextPProps = { as: 'p' } & React.HTMLAttributes<HTMLParagraphElement>;

type TextProps = TextOwnProps & (TextSpanProps | TextDivProps | TextLabelProps | TextPProps);

const Text = React.forwardRef<HTMLDivElement, TextProps>((props, ref) => {
  const {
    as: Tag = 'span',
    asChild,
    children,
    className,
    size,
    align,
    color,
    variant,
    weight,
    ...rest
  } = props;

  return (
    <Slot className={text({ size, align, color, variant, className, weight })} ref={ref} {...rest}>
      {asChild ? children : <Tag>{children}</Tag>}
    </Slot>
  );
});

Text.displayName = 'Text';

export { Text };
