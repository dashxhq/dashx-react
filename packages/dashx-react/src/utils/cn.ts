import classnames from 'classnames';
import { twMerge } from 'tailwind-merge';

import type { ArgumentArray } from 'classnames';

const cn = (...params: ArgumentArray) => twMerge(classnames(...params));

export { cn };
