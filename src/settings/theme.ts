import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';
import { Settings } from 'react-native-paper/lib/typescript/core/settings';
import { MD3Theme } from 'react-native-paper/lib/typescript/types';

const defaulValues: Partial<MD3Theme> = {
  roundness: 16,
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  ...defaulValues,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FCBD00',
    primaryContainer: '#FFE07C',
    secondary: '#FFF2B4',
    secondaryContainer: ' #FFFADE',
    onBackground: '#000000',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  ...defaulValues,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FCBD00',
    primaryContainer: '#FFE07C',
    secondary: '#FFF2B4',
    secondaryContainer: ' #FFFADE',
    onBackground: '#FFFFFF',
  },
};

function getCustomIconElement(props: IconProps) {
  const currentStyles = ['regular', 'solid', 'brand'];

  const extractedType = props.name.split('-').pop() ?? '';
  const iconStyle = currentStyles.includes(extractedType)
    ? extractedType
    : 'solid';

  return React.createElement(FontAwesome6, {
    ...props,
    iconStyle: iconStyle as any,
  });
}

export const settings: Settings = {
  icon: props => getCustomIconElement(props),
};
