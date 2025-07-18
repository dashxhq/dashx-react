import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { DirectionProvider } from '@radix-ui/react-direction';

interface ThemeContext {
  accentBaseColor?: string;
  negativeBaseColor?: string;
  grayBaseColor?: string;
  roundness?: 'none' | 'small' | 'medium' | 'large' | 'full';
  elevation?: 'none' | 'small' | 'medium' | 'large';
  density?: number;
  contrast?: number;
  chroma?: number;
  mode?: 'light' | 'dark';
}

interface ThemeProps extends ThemeContext, React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ThemeContext = React.createContext<ThemeContext>({
  accentBaseColor: undefined,
  negativeBaseColor: 'oklch(0% 0 20)',
  grayBaseColor: undefined,
  roundness: 'medium',
  elevation: 'medium',
  density: 1,
  contrast: 1,
  mode: 'light',
  chroma: 1,
});

const Theme = React.forwardRef<React.ElementRef<'div'>, ThemeProps>((props, ref) => {
  const parentTheme = React.useContext(ThemeContext);
  const {
    asChild,
    accentBaseColor = parentTheme.accentBaseColor,
    negativeBaseColor = parentTheme.negativeBaseColor,
    grayBaseColor = parentTheme.grayBaseColor,
    roundness = parentTheme.roundness,
    elevation = parentTheme.elevation,
    density = parentTheme.density,
    contrast = parentTheme.contrast,
    mode = parentTheme.mode,
    chroma = parentTheme.chroma,
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
            elevation,
            density,
            contrast,
            mode,
            chroma,
          }}
        >
          <Comp
            {...rest}
            className={'dx ' + mode}
            ref={ref}
            style={
              {
                '--accent-base': accentBaseColor,
                '--negative-base': negativeBaseColor,
                '--gray-base': grayBaseColor,
                '--base-density': density,
                '--contrast-factor': contrast,
                '--chroma-factor': chroma,
              } as any
            }
            data-radius={roundness}
            data-shadow={elevation}
          />
        </ThemeContext.Provider>
      </DirectionProvider>
    </TooltipProvider>
  );
});

Theme.displayName = 'Theme';

export { Theme };
export type { ThemeProps };
