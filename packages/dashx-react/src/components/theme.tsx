import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { DirectionProvider } from '@radix-ui/react-direction';

interface ThemeContext {
  accentBaseColor?: string;
  negativeBaseColor?: string;
  grayBaseColor?: string;
  roundness?: 'none' | 'small' | 'medium' | 'large' | 'full';
  density?: number;
  contrast?: number;
  mode?: 'light' | 'dark';
}

interface ThemeProps extends ThemeContext, React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ThemeContext = React.createContext<ThemeContext>({
  accentBaseColor: undefined,
  negativeBaseColor: undefined,
  grayBaseColor: undefined,
  roundness: 'medium',
  density: 1,
  contrast: undefined,
  mode: undefined,
});

const Theme = React.forwardRef<React.ElementRef<'div'>, ThemeProps>((props, ref) => {
  const parentTheme = React.useContext(ThemeContext);
  const {
    asChild,
    accentBaseColor = parentTheme.accentBaseColor,
    negativeBaseColor = parentTheme.negativeBaseColor,
    grayBaseColor = parentTheme.grayBaseColor,
    roundness = parentTheme.roundness,
    density = parentTheme.density,
    contrast = parentTheme.contrast,
    mode = parentTheme.mode,
    ...rest
  } = props;
  const Comp = asChild ? Slot : 'div';
  return (
    <TooltipProvider delayDuration={200}>
      <DirectionProvider dir="ltr">
        <ThemeContext.Provider
          value={{
            accentBaseColor,
            negativeBaseColor,
            grayBaseColor,
            roundness,
            density,
            contrast,
            mode,
          }}
        >
          <Comp
            {...rest}
            className="dr"
            ref={ref}
            style={
              {
                '--accent-base': accentBaseColor,
                '--negative-base': negativeBaseColor,
                '--gray-base': grayBaseColor,
                '--base-density': density,
              } as any
            }
            data-radius={roundness}
          />
        </ThemeContext.Provider>
      </DirectionProvider>
    </TooltipProvider>
  );
});

Theme.displayName = 'Theme';

export { Theme };
export type { ThemeProps };
