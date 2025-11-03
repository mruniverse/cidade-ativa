import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps, useTheme } from 'react-native-paper';

export default function CustomTextInput(props: TextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      {...props}
      style={{ ...styles.container, backgroundColor: theme.colors.surface }}
      mode="outlined"
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
