import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { TextInputProps, useTheme } from 'react-native-paper';
import defaultBorderRadius from '../settings/radius';

export interface AutoCompleteComponentProps {
  dataSet: { id: string; title: string }[];
  placeholder: string;
  textInputProps?: TextInputProps;
  handleSelectItem: (item: any) => void;
  selectedItem?: {
    id: string;
  };
}

export default function AutoCompleteComponent(
  props: Readonly<AutoCompleteComponentProps>
) {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState<{ id: string }>();
  const [outlineStyle, setOutlineColor] = useState({
    borderColor: 'rgba(38, 50, 56, 0.1)',
    borderWidth: 0.8,
  });

  function handleSelectItem(item: any) {
    setSelectedItem(item);
    props.handleSelectItem(item);
  }

  function handleFocus() {
    setOutlineColor({ borderColor: theme.colors.primary, borderWidth: 2 });
  }

  function handleBlur() {
    setOutlineColor({ borderColor: 'rgba(38, 50, 56, 0.1)', borderWidth: 0.8 });
  }

  return (
    <AutocompleteDropdown
      textInputProps={{
        ...props.textInputProps,
        placeholder: props.placeholder,
      }}
      containerStyle={{
        ...styles.autocompleteContainer,
        ...outlineStyle,
      }}
      inputContainerStyle={{
        ...styles.inputContainer,
        backgroundColor: theme.colors.surface,
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      clearOnFocus={false}
      closeOnBlur={true}
      closeOnSubmit={false}
      initialValue={selectedItem}
      onSelectItem={handleSelectItem}
      dataSet={props.dataSet}
    />
  );
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    borderWidth: 0.8,
    borderRadius: defaultBorderRadius - 2,
  },
  inputContainer: {
    height: 48,
    paddingHorizontal: 8,
    borderRadius: defaultBorderRadius - 2,
  },
});
