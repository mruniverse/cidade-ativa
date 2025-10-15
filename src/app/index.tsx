import ExampleRoute from '@/src/components/BottomNavigation/Routes/exampleRoute';
import BottomNavigationComponent, {
  BottomNavigationProps,
} from '@/src/components/BottomNavigation/bottomNavigationComponent';
import { useState } from 'react';
import { Text } from 'react-native-paper';
import MapViewComponent from '../components/MapViewComponent';

export default function Index() {
  const [routes] = useState<BottomNavigationProps['routes']>([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'map',
    },
    { key: 'albums', title: 'Albums', focusedIcon: 'images' },
    {
      key: 'notifications',
      title: 'Notifications',
      focusedIcon: 'bell',
    },
  ]);

  const components: BottomNavigationProps['components'] = {
    home: MapViewComponent,
    albums: ExampleRoute,
    notifications: () => <Text>Notificationsss</Text>,
  };

  return <BottomNavigationComponent routes={routes} components={components} />;
}
