import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  CommonActions,
  NavigationRoute,
  ParamListBase,
} from '@react-navigation/native';
import { Platform, StyleSheet } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';

export default function BottomNavigationBar({
  navigation,
  state,
  descriptors,
  insets,
}: Readonly<BottomTabBarProps>) {
  function getVisibleRoutes() {
    const visibleRoutes = state.routes.filter(r => {
      const filter = ['_', '(', '+'];
      const name = String(r.name).toLowerCase();

      return !filter.some(f => name.startsWith(f));
    });

    const activeRouteKey = state.routes[state.index]?.key;
    const filteredIndex = Math.max(
      0,
      visibleRoutes.findIndex(r => r.key === activeRouteKey)
    );

    return { visibleRoutes, filteredIndex };
  }

  function getLabelText({
    route,
  }: {
    route: NavigationRoute<ParamListBase, string>;
  }) {
    const { options } = descriptors[route.key];
    if (typeof options.tabBarLabel === 'string') return options.tabBarLabel;
    if (typeof options.title === 'string') return options.title;

    return route.name;
  }

  return (
    <BottomNavigation.Bar
      shifting={true}
      navigationState={{
        index: getVisibleRoutes().filteredIndex,
        routes: getVisibleRoutes().visibleRoutes,
      }}
      style={{
        ...styles.defaultMargin,
        ...styles.defaultBorderRadius,
        ...styles.barStyle,
      }}
      activeIndicatorStyle={{
        ...styles.defaultBorderRadius,
        ...styles.activeIndicatorStyle,
      }}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      renderIcon={({ route, focused, color }) =>
        descriptors[route.key].options.tabBarIcon?.({
          focused,
          color,
          size: 24,
        }) || null
      }
      renderLabel={({ route, focused, color }) =>
        focused && (
          <Text
            style={{
              ...styles.labelStyle,
            }}
          >
            {getLabelText({ route })}
          </Text>
        )
      }
      safeAreaInsets={insets}
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
  barStyle: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 50,
    height: 64,
    backgroundColor: 'rgba(40, 40, 40, 0.6)',
  },
  activeIndicatorStyle: {
    height: 56,
    marginTop: 8,
    paddingHorizontal: '190%',
    backgroundColor: 'rgba(30, 30, 30, 1)',
  },
  labelStyle: {
    flex: 1,
    textAlign: 'center',
    marginTop: -6,
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
  },
});
