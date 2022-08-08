import {
  DEFAULT_ICON_CONFIGS,
  IconProvider as IconParkProvider,
} from '@icon-park/react';

const iconConfig: typeof DEFAULT_ICON_CONFIGS = {
  ...DEFAULT_ICON_CONFIGS,
  size: 16,
  colors: {
    ...DEFAULT_ICON_CONFIGS.colors,
    outline: { ...DEFAULT_ICON_CONFIGS.colors.outline, fill: '#F9F9F9' },
  },
};

const IconProvider = ({ children }: { children: React.ReactNode }) => {
  return <IconParkProvider value={iconConfig}>{children}</IconParkProvider>;
};

export default IconProvider;
