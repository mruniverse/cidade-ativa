import { useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationRoute,
  Text,
} from 'react-native-paper';

export interface BottomNavigationProps {
  routes: BottomNavigationRoute[];
  components: {
    [key: string]: React.ComponentType<any>;
  };
}

export default function BottomNavigationComponent(
  props: Readonly<BottomNavigationProps>
) {
  const [index, setIndex] = useState(0);
  const { routes, components } = props;
  const renderScene = BottomNavigation.SceneMap(components);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationEnabled={true}
      barStyle={{
        boxShadow: '0px 2px 4px 2px rgba(59, 125, 182, 0.068)',
      }}
      activeIndicatorStyle={{
        borderRadius: 8,
        marginTop: 24,
        width: '260%',
        height: '220%',
      }}
      renderLabel={({ route, focused, color }) =>
        focused && (
          <Text
            style={{
              color,
              fontSize: 12,
              alignSelf: 'center',
            }}
          >
            {route.title}
          </Text>
        )
      }
    />
  );
}
