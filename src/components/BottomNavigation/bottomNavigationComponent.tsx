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
        <IconButton
          mode="contained"
          size={48}
          style={styles.middleButton}
          icon={props.route.focusedIcon || ''}
          onPress={onPress}
        />
      );
    } else {
      return (
        <TouchableRipple
          {...props}
          key={props.key}
          style={{
            width: '42%',
            alignSelf: 'center',
          }}
        />
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  defaultBorderRadius: {
    borderRadius: 32,
  },
  defaultMargin: {
    margin: Platform.OS === 'ios' ? 24 : 16,
  },
  floatingNav: {
    position: 'absolute',
    zIndex: 50,
    overflow: 'hidden',
  },
  activeIndicator: {
    marginTop: 24,
    padding: '100%',
    paddingHorizontal: '180%',
  },
  middleButton: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
