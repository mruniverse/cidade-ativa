import type {
  FontAwesome6BrandIconName,
  FontAwesome6RegularIconName,
  FontAwesome6SolidIconName,
} from '@react-native-vector-icons/fontawesome6';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

// Union type for all icon names
export type IconName =
  | FontAwesome6RegularIconName
  | FontAwesome6SolidIconName
  | FontAwesome6BrandIconName;

interface BaseIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

interface SolidIconProps extends BaseIconProps {
  variant?: 'solid';
}

interface RegularIconProps extends BaseIconProps {
  variant: 'regular';
}

interface BrandIconProps extends BaseIconProps {
  variant: 'brand';
}

type IconProps = SolidIconProps | RegularIconProps | BrandIconProps;

export default function Icon({
  name,
  size = 24,
  color,
  style,
  variant = 'solid',
}: Readonly<IconProps>) {
  const theme = useTheme();
  const iconColor = color || theme.colors.onSurface;

  if (variant === 'brand') {
    return (
      <FontAwesome6
        name={name as FontAwesome6BrandIconName}
        size={size}
        color={iconColor}
        style={style}
        iconStyle="brand"
      />
    );
  }

  if (variant === 'regular') {
    return (
      <FontAwesome6
        name={name as FontAwesome6RegularIconName}
        size={size}
        color={iconColor}
        style={style}
        iconStyle="regular"
      />
    );
  }

  return (
    <FontAwesome6
      name={name as FontAwesome6SolidIconName}
      size={size}
      color={iconColor}
      style={style}
      iconStyle="solid"
    />
  );
}

// Pre-configured icon variants for common use cases
export function IconOutline(props: Readonly<Omit<BaseIconProps, 'variant'>>) {
  return <Icon {...props} variant="regular" />;
}

export function IconSolid(props: Readonly<Omit<BaseIconProps, 'variant'>>) {
  return <Icon {...props} variant="solid" />;
}

export function IconBrand(props: Readonly<Omit<BaseIconProps, 'variant'>>) {
  return <Icon {...props} variant="brand" />;
}
