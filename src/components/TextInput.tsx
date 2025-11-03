import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

export default function CustomTextInput(props: TextInputProps) {
  return (
    <TextInput {...props} mode="outlined" style={[styles.input, props.style]} />
  );
}

const styles = StyleSheet.create({
  input: {},
});
