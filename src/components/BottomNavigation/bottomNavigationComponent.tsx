import { ColorValue, Platform, StyleSheet } from 'react-native';
import {
  BottomNavigation,
  BottomNavigationRoute,
  TouchableRipple,
  TouchableRippleProps,
} from 'react-native-paper';
import { BaseRoute } from 'react-native-paper/lib/typescript/components/BottomNavigation/BottomNavigation';

type TouchableProps<Route extends BaseRoute> = TouchableRippleProps & {
  key: string;
  route: Route;
  children: React.ReactNode;
  borderless?: boolean;
  centered?: boolean;
  rippleColor?: ColorValue;
};

export interface BottomNavigationProps {
  routes: BottomNavigationRoute[];
  index: number;
  onIndexChange: (index: number) => void;
  components: {
    [key: string]: React.ComponentType<any>;
  };
}

export default function BottomNavigationComponent(
  props: Readonly<BottomNavigationProps>
) {
  const { routes, components } = props;
  const renderScene = BottomNavigation.SceneMap(components);

  function onPress() {
    console.log('New item action triggered');
  }
  const customTouchableRipple = (
    props: TouchableProps<BottomNavigationRoute>
  ) => {
    return <TouchableRipple {...props} key={props.key} />;
  };

  return (
    <BottomNavigation
      navigationState={{ index: props.index, routes }}
      onIndexChange={props.onIndexChange}
      renderScene={renderScene}
      renderTouchable={customTouchableRipple}
      sceneAnimationEnabled={true}
      barStyle={{
        ...styles.floatingNav,
        ...styles.defaultBorderRadius,
        ...styles.defaultMargin,
      }}
      activeIndicatorStyle={{
        ...styles.activeIndicator,
        ...styles.defaultBorderRadius,
      }}
      shifting={true}
    />
  );
}

const styles = StyleSheet.create({
  defaultBorderRadius: {
    borderRadius: 24,
  },
  defaultMargin: {
    margin: Platform.OS === 'ios' ? 24 : 16,
  },
  floatingNav: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 50,
  },
  activeIndicator: {
    marginTop: 24,
    padding: '100%',
    paddingHorizontal: '270%',
    backgroundColor: 'rgba(0, 0, 120, 0.06)',
  },
  middleButton: {
    height: 64,
    width: 64,
  },
});
