import ExampleRoute from "@/components/BottomNavigation/Routes/exampleRoute";
import BottomNavigationComponent, { BottomNavigationProps } from "@/components/BottomNavigation/bottomNavigationComponent";
import { useState } from "react";
import { Text } from "react-native-paper";

export default function Index(){
  const [routes] = useState<BottomNavigationProps['routes']>([
    {
      key: 'music',
      title: 'Favorites',
      focusedIcon: 'cart-shopping',
    },
    { key: 'albums', title: 'Albums', focusedIcon: 'images' },
    { key: 'recents', title: 'Recents', focusedIcon: 'clock-rotate-left' },
    {
      key: 'notifications',
      title: 'Notifications',
      focusedIcon: 'bell',
    },
  ]);
  
  const components: BottomNavigationProps['components'] = {
    music: ExampleRoute,
    albums: ExampleRoute,
    recents: ExampleRoute,
    notifications: () => <Text>Notificationsss</Text>,
  }
  
  return (<BottomNavigationComponent routes={routes} components={components} />);
}