import React from 'react';

import { cn } from '../utils/cn.js';

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => {
    const { className } = props;

    return <h1 className={cn('text-2xl', className)} ref={ref} {...props} />;
  },
);

Header.displayName = 'Header';

export { Header };
