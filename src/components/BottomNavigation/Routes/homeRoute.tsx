import { Link } from 'expo-router';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function HomeRoute() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Card.Content>
          <Text variant="headlineSmall">Welcome to Cidade Ativa App</Text>
          <Text variant="bodyMedium" style={{ marginTop: 8 }}>
            Your app is now configured with React Native Paper!
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => console.log('Button pressed!')}
          >
            Get Started
          </Button>
          <Link href="/" asChild>
            <Button mode="outlined">View Examples</Button>
          </Link>
        </Card.Actions>
      </Card>

      <Text variant="bodyMedium" style={{ marginTop: 20 }}>
        Edit app/index.tsx to customize this screen.
      </Text>
    </View>
  );
}
