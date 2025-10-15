import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';
import { Settings } from 'react-native-paper/lib/typescript/core/settings';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // primary: '#6200EA',
    // secondary: '#03DAC6',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // primary: '#BB86FC',
    // secondary: '#03DAC6',
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
