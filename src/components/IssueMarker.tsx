import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Marker} from 'react-native-maps';

export enum IssueType {
  Buraco = 'buraco',
  FioQuebrado = 'fio_quebrado',
  MaSinalizacao = 'ma_sinalizacao',
  Outro = 'outro',
}

export interface IssueMarkerProps {
  coordinate: { latitude: number; longitude: number };
  type: IssueType;
  title?: string;
  description?: string;
  /** optional image icon (local require or { uri }) - if omitted, emoji is used */
  icon?: ImageSourcePropType;
  onPress?: () => void;
}

const emojiMap: { [k in IssueType]: string } = {
  [IssueType.Buraco]: '🕳️',
  [IssueType.FioQuebrado]: '🔌',
  [IssueType.MaSinalizacao]: '🚧',
  [IssueType.Outro]: '📍',
};

const colorMap: { [k in IssueType]: string } = {
  [IssueType.Buraco]: '#8B0000',
  [IssueType.FioQuebrado]: '#FF8C00',
  [IssueType.MaSinalizacao]: '#1E90FF',
  [IssueType.Outro]: '#4B0082',
};

export default function IssueMarker({
  coordinate,
  type,
  title,
  description,
  icon,
  onPress,
}: IssueMarkerProps) {
  return (
    <Marker
      draggable
      coordinate={coordinate}
      title={title}
      description={description}
      onPress={onPress}
    >
      <View style={[styles.bubble, { backgroundColor: colorMap[type] }]}>
        {icon ? (
          <Image source={icon} style={styles.icon} />
        ) : (
          <Text style={styles.emoji}>{emojiMap[type]}</Text>
        )}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 6,
    borderRadius: 18,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  emoji: {
    fontSize: 18,
    color: 'white',
    lineHeight: 20,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
});
