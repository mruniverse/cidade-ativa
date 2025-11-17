import { MapMarkerProps, Marker } from 'react-native-maps';

export interface MarkerComponentProps extends MapMarkerProps {}

export default function MarkerComponent(props: Readonly<MarkerComponentProps>) {
  return <Marker draggable {...props} />;
}
