import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {
  MapPressEvent,
  MapViewProps,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { useTheme } from 'react-native-paper';
import { PERMISSIONS, request } from 'react-native-permissions';
import { PostService } from '../api/post.service';
import defaultPositions from '../settings/positions';
import MarkerComponent, { MarkerComponentProps } from './MarkerComponent';

interface CustomMapViewProps extends MapViewProps {
  onNewMarker?: any;
}

export default function MapViewComponent(props: Readonly<CustomMapViewProps>) {
  const theme = useTheme();
  const postService = new PostService();
  const mapScale = 4;
  const mapRef = useRef<MapView | null>(null);
  const [markers, setMarkers] = useState<MarkerComponentProps[]>([]);
  const initialRegion = {
    latitude: -24.0438,
    longitude: -52.3811,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      setUserCurrentLocationOnMap();
      loadPostsFromAPI();
    });
  }, []);

  async function loadPostsFromAPI() {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const data = await postService.getPosts(
        1,
        location.coords.latitude,
        location.coords.longitude
      );

      if (data && data.length > 0) {
        const postMarkers: MarkerComponentProps[] = data.map(post => {
          const marker = {
            id: `post_${post.id}`,
            coordinate: {
              latitude: -Math.abs(post.latitude / 10000),
              longitude: -Math.abs(post.longitude / 10000),
            },
            title: post.nome,
            description: post.conteudo,
            pinColor: theme.colors.secondary,
          };
          console.log('Created marker:', marker);
          return marker;
        });

        setMarkers(postMarkers);
      } else {
        console.log('No posts received or empty array');
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  useEffect(() => {
    if (props.onNewMarker && props.onNewMarker !== null) {
      addMarkerAtUserLocation(props.onNewMarker);
    }
  }, [props.onNewMarker]);

  function setUserCurrentLocationOnMap() {
    Location.getCurrentPositionAsync({}).then(location => {
      if (location) {
        mapRef.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922 / mapScale,
          longitudeDelta: 0.0421 / mapScale,
        });
      }
    });
  }

  async function addMarkerAtUserLocation(postData: any) {
    const location = await Location.getCurrentPositionAsync({});
    if (location) {
      const newMarker: MarkerComponentProps = {
        id: `post_${Date.now()}`,
        coordinate: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        title: postData.category?.title || 'Nova Ocorrência',
        description: postData.description,
        pinColor: theme.colors.primary,
      };

      setMarkers(prev => [...prev, newMarker]);
    }
  }

  function handleMapPress(event: MapPressEvent) {
    const coordinate = event.nativeEvent.coordinate;
    const newMarker: MarkerComponentProps = {
      id: `map_${Date.now()}_${coordinate.latitude}_${coordinate.longitude}`,
      coordinate: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      title: 'New Marker',
      description: 'Description of the new marker',
      pinColor: theme.colors.primary,
    };

    setMarkers(prev => [...prev, newMarker]);
  }

  return (
    <MapView
      {...props}
      ref={mapRef}
      mapPadding={{
        right: 0,
        left: defaultPositions.left,
        top: defaultPositions.top,
        bottom: defaultPositions.bottom,
      }}
      onPress={handleMapPress}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      region={initialRegion}
      showsCompass={false}
      showsUserLocation={true}
    >
      {markers.map(marker => (
        <MarkerComponent key={marker.id} {...marker} />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
