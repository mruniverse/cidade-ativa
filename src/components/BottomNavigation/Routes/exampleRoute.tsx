import { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  FAB,
  Snackbar,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';

export default function ExampleRoute() {
  const [switchValue, setSwitchValue] = useState(false);
  const [text, setText] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  return (
    <>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
          React Native Paper Examples
        </Text>

        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text variant="titleMedium">Buttons</Text>
            <Button
              mode="contained"
              style={{ marginTop: 8, marginBottom: 8 }}
              onPress={() => setSnackbarVisible(true)}
            >
              Contained Button
            </Button>
            <Button mode="outlined" style={{ marginBottom: 8 }}>
              Outlined Button
            </Button>
            <Button mode="text">Text Button</Button>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text variant="titleMedium">Input Controls</Text>
            <TextInput
              label="Enter some text"
              value={text}
              onChangeText={setText}
              style={{ marginTop: 8, marginBottom: 16 }}
            />

            <Text variant="bodyMedium">Switch Example:</Text>
            <Switch
              value={switchValue}
              onValueChange={setSwitchValue}
              style={{ alignSelf: 'flex-start', marginTop: 8 }}
            />
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text variant="titleMedium">Chips</Text>
            <Chip style={{ marginTop: 8, marginRight: 8, marginBottom: 8 }}>
              Example Chip
            </Chip>
            <Chip mode="outlined" style={{ marginRight: 8, marginBottom: 8 }}>
              Outlined Chip
            </Chip>
          </Card.Content>
        </Card>

        <Divider style={{ marginVertical: 16 }} />

        <Text
          variant="bodyMedium"
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          This demonstrates various React Native Paper components working
          together.
        </Text>
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => setSnackbarVisible(true)}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}
      >
        Action performed!
      </Snackbar>
    </>
  );
}
