import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../utils/cn.js';
import { avatar } from '../variants/avatar.js';

import type { AvatarVariantProps } from '../variants/avatar.js';

function _Avatar(
  props: AvatarPrimitive.AvatarImageProps &
    AvatarPrimitive.AvatarFallbackProps &
    AvatarVariantProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { size, roundness, src, alt, delayMs, children } = props;
  return (
    <AvatarPrimitive.Root ref={ref}>
      <AvatarPrimitive.Image
        className={cn('dx', avatar({ size, roundness }))}
        src={src}
        alt={alt}
        data-radius={roundness}
      />
      <AvatarPrimitive.Fallback delayMs={delayMs}>{children}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

const Avatar = React.forwardRef(_Avatar);

export { Avatar };
