import { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { BottomNavigation, BottomNavigationRoute } from 'react-native-paper';

export interface BottomNavigationProps {
  routes: BottomNavigationRoute[];
  components: {
    [key: string]: React.ComponentType<any>;
  };
}

const styles = StyleSheet.create({
  floatingNav: {
    position: 'absolute',
    margin: Platform.OS === 'ios' ? 24 : 16,
    zIndex: 50,
    width: '92%',
    borderRadius: 24,
    overflow: 'hidden',
  },
});

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
        ...styles.floatingNav,
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
