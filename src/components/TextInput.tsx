import { TextInput, TextInputProps, useTheme } from 'react-native-paper';

export default function CustomTextInput(props: TextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      style={{ paddingLeft: 8, backgroundColor: theme.colors.surface }}
      {...props}
      mode="outlined"
      outlineColor="rgba(38, 50, 56, 0.1)"
      activeOutlineColor={theme.colors.primary}
    />
  );
}
