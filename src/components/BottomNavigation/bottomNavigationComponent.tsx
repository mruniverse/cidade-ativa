import { ColorValue, Platform, StyleSheet, View } from 'react-native';
import {
  BottomNavigation,
  BottomNavigationRoute,
  IconButton,
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
    if (props.key === 'new') {
      return (
        <View key={props.key} style={{ justifyContent: 'center' }}>
          <IconButton
            key={props.key}
            mode="contained-tonal"
            size={32}
            style={{ ...styles.middleButton, ...styles.defaultBorderRadius }}
            icon={props.route.focusedIcon || ''}
            onPress={onPress}
          />
        </View>
      );
    } else {
      return <TouchableRipple {...props} key={props.key} />;
    }
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
    borderRadius: 16,
  },
  defaultMargin: {
    margin: Platform.OS === 'ios' ? 24 : 16,
  },
  floatingNav: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 50,
    marginHorizontal: 34,
  },
  activeIndicator: {
    marginTop: 24,
    padding: '100%',
    paddingHorizontal: '170%',
  },
  middleButton: {
    height: 64,
    width: 64,
  },
});
