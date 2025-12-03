import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker, MarkerPressEvent } from 'react-native-maps';
import {
  CategoryMarkerConfig,
  getCategoryMarkerConfig,
} from '../settings/categoryMarkers';

export interface CategoryMarkerProps {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  categorySlug?: string;
  categoryConfig?: CategoryMarkerConfig;
  onPress?: (event: MarkerPressEvent) => void;
  draggable?: boolean;
}

/**
 * Custom marker component that displays category-specific icons
 * with colored circular backgrounds for better visual differentiation
 */
export default function CategoryMarker({
  id,
  coordinate,
  title,
  description,
  categorySlug,
  categoryConfig,
  onPress,
  draggable = false,
}: Readonly<CategoryMarkerProps>) {
  // Use provided config or get from category slug
  const config = categoryConfig || getCategoryMarkerConfig(categorySlug);
  const { color, backgroundColor, icon } = config;

  return (
    <Marker
      identifier={id}
      coordinate={coordinate}
      title={title}
      description={description}
      onPress={onPress}
      draggable={draggable}
      tracksViewChanges={false} // Disable to prevent blinking/performance issues
      anchor={{ x: 0.5, y: 1 }} // Anchor at bottom center of the marker
    >
      <View style={styles.markerContainer}>
        <View style={[styles.markerBubble, { backgroundColor }]}>
          <FontAwesome6 name={icon} size={18} color={color} iconStyle="solid" />
        </View>
        <View
          style={[styles.markerArrow, { borderTopColor: backgroundColor }]}
        />
      </View>
    </Marker>
  );
}

/**
 * Simple dot marker for minimal representation
 */
export function CategoryDotMarker({
  id,
  coordinate,
  title,
  description,
  categorySlug,
  categoryConfig,
  onPress,
}: Readonly<Omit<CategoryMarkerProps, 'draggable'>>) {
  const config = categoryConfig || getCategoryMarkerConfig(categorySlug);
  const { backgroundColor } = config;

  return (
    <Marker
      identifier={id}
      coordinate={coordinate}
      title={title}
      description={description}
      onPress={onPress}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.dotContainer}>
        <View style={[styles.dotOuter, { backgroundColor }]}>
          <View style={styles.dotInner} />
        </View>
      </View>
    </Marker>
  );
}

/**
 * Cluster marker for grouped posts
 */
export function ClusterMarker({
  coordinate,
  count,
  onPress,
}: Readonly<{
  coordinate: { latitude: number; longitude: number };
  count: number;
  onPress?: (event: MarkerPressEvent) => void;
}>) {
  // Determine size based on count
  const getSize = () => {
    if (count < 10) return 40;
    if (count < 50) return 50;
    return 60;
  };

  const getFontSize = () => {
    if (count < 10) return 14;
    if (count < 100) return 12;
    return 10;
  };

  const size = getSize();
  const fontSize = getFontSize();

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View
        style={[
          styles.clusterContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <View style={[styles.clusterInner, { borderRadius: (size - 8) / 2 }]}>
          <FontAwesome6
            name="layer-group"
            size={fontSize}
            color="#FFFFFF"
            iconStyle="solid"
          />
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  dotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  clusterContainer: {
    backgroundColor: 'rgba(252, 189, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterInner: {
    width: '80%',
    height: '80%',
    backgroundColor: '#FCBD00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clusterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
