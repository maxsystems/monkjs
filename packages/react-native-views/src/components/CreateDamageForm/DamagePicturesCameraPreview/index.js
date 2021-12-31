import React from 'react';
import { ScrollView, Image, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';

import { utils } from '@monkvision/react-native';

import { noop } from 'lodash';
import PropTypes from 'prop-types';
import { damagePicturesPropType } from '../proptypes';

const { height } = Dimensions.get('window');
const spacing = utils.styles.spacing;

const styles = StyleSheet.create({
  cameraPreviewLayout: { position: 'absolute', left: 20, top: 10, zIndex: 99, height: height - 30 },
  cameraPreviewImage: {
    width: 100, height: 100, borderRadius: 8, elevation: 20, marginVertical: spacing(1),
  },
});

export default function DamagePicturesCameraPreview({ damagePictures, onPress, ...props }) {
  if (!damagePictures?.length) { return null; }
  return (

    <ScrollView style={styles.cameraPreviewLayout}>
      <View style={{ height: damagePictures?.length * (100 + spacing(2)) || height }}>
        {damagePictures.map(
          ({ uri }, index) => (
            <TouchableOpacity
            // eslint-disable-next-line react/no-array-index-key
              key={`img-${index}`}
              onPress={() => onPress({ uri, index })}
              {...props}
            >
              <Image
                source={{ uri }}
                style={styles.cameraPreviewImage}
                width={100}
                height={100}
              />
            </TouchableOpacity>
          ),
        )}
      </View>
    </ScrollView>
  );
}
DamagePicturesCameraPreview.propTypes = {
  damagePictures: damagePicturesPropType,
  onPress: PropTypes.func,
};
DamagePicturesCameraPreview.defaultProps = {
  damagePictures: [],
  onPress: noop,
};