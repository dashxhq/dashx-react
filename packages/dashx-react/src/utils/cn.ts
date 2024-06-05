import { twMerge } from 'tailwind-merge';
import { cx } from 'class-variance-authority';
import type { ClassValue } from 'class-variance-authority/types';

const cn = (...params: ClassValue[]) => twMerge(cx(...params));

export { cn };
