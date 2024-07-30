import { FormContext } from 'react-aria-components';
import { FormValidationContext } from 'react-stately';
import { forwardRef } from 'react';

import type { FormProps as _FormProps } from '@react-types/form';
import type { CSSProperties, ForwardedRef, ReactNode } from 'react';
import type { DOMProps } from '@react-types/shared';

export interface FormProps extends _FormProps, DOMProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  noValidate?: boolean;
}

function _Form(props: FormProps, ref: ForwardedRef<HTMLFormElement>) {
  let { validationErrors, children, className, ...domProps } = props;
  return (
    <form {...domProps} ref={ref} className={className}>
      <FormContext.Provider value={{ validationBehavior: props.noValidate ? 'aria' : 'native' }}>
        <FormValidationContext.Provider value={validationErrors ?? {}}>
          {children}
        </FormValidationContext.Provider>
      </FormContext.Provider>
    </form>
  );
}

const Form = forwardRef(_Form);
export { Form };
