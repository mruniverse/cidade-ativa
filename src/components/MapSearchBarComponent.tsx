import React from 'react';
import { Platform, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

export interface MapSearchBarProps {
  value: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  topOffset?: number;
}

export default function MapSearchBar(props: Readonly<MapSearchBarProps>) {
  const { value, onChangeText, onSubmitEditing, topOffset } = props;
  const placeholder = props.placeholder ?? 'Search for a location';
  const top = topOffset ?? (Platform.OS === 'ios' ? 50 : 48);

  return (
    <View style={[{ top }]}>
      <Searchbar
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}
