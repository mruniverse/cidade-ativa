import { useState } from 'react';
import { BottomNavigation, BottomNavigationRoute } from 'react-native-paper';

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
        margin: 16,
        borderRadius: 16,
      }}
      activeIndicatorStyle={{
        borderRadius: 16,
        marginTop: 24,
        padding: '100%',
        paddingHorizontal: '150%',
      }}
      shifting={true}
    />
  );
}
