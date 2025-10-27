import BottomNavigationComponent, {
  BottomNavigationProps,
} from '@/src/components/BottomNavigation/bottomNavigationComponent';
import { useState } from 'react';
import { Text } from 'react-native-paper';
import MapViewComponent from '../components/BottomNavigation/Routes/MapViewComponent';

export default function Index() {
  const [index, setIndex] = useState(0);
  const [routes] = useState<BottomNavigationProps['routes']>([
    {
      key: 'map',
      title: 'Mapa',
      focusedIcon: 'map-location-dot',
    },
    {
      key: 'new',
      title: 'Novo',
      focusedIcon: 'plus',
    },
    {
      key: 'contributions',
      title: 'Contribuições',
      focusedIcon: 'handshake',
    },
  ]);

  function handleIndexChange(index: number) {
    setIndex(index);
    console.log('Index changed to:', index);
  }

  const components: BottomNavigationProps['components'] = {
    map: MapViewComponent,
    new: MapViewComponent,
    contributions: () => <Text>Contribuições</Text>,
  };

  return (
    <BottomNavigationComponent
      index={index}
      onIndexChange={handleIndexChange}
      routes={routes}
      components={components}
    />
  );
}
