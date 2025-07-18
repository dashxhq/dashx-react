import { useContextProps, LinkContext, TextContext } from 'react-aria-components';
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

const Text = React.forwardRef<HTMLElement, TextProps>((props, ref) => {
  [props, ref] = useContextProps(props, ref, TextContext);
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
    transform,
    ...rest
  } = props;

  return (
    <TextContext.Provider value={props}>
      <Slot
        className={text({ className, size, align, color, variant, weight, transform })}
        ref={ref}
        {...rest}
      >
        {asChild ? children : <Tag>{children}</Tag>}
      </Slot>
    </TextContext.Provider>
  );
});

Text.displayName = 'Text';

export { Text };
