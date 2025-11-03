import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps, useTheme } from 'react-native-paper';

export default function CustomTextInput(props: TextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      style={{ ...styles.container, backgroundColor: theme.colors.surface }}
      {...props}
      mode="outlined"
      textColor="rgba(0, 0, 0, 0.87)"
      outlineColor="rgba(38, 50, 56, 0.1)"
      activeOutlineColor={theme.colors.primary}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
});
