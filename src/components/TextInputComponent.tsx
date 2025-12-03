import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TextInput, TextInputProps, useTheme } from 'react-native-paper';

export default function CustomTextInput(props: TextInputProps) {
  const theme = useTheme();

  const placeholder = props.placeholder || props.label?.toString() || '';

  return (
    <TextInput
      {...props}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface },
        props.style as StyleProp<ViewStyle>,
      ]}
      mode="outlined"
      outlineColor="rgba(38, 50, 56, 0.2)"
      activeOutlineColor={theme.colors.primary}
      label=""
      placeholder={placeholder}
      placeholderTextColor="rgba(0, 0, 0, 0.36)"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
  },
});
