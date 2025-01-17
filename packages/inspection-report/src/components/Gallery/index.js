import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import Thumbnail from './Thumbnail';
import { useDesktopMode, useDamageVisibility } from '../../hooks';

const styles = StyleSheet.create({
  container: {
    alignContent: 'flex-start',
    ...Platform.select({
      web: {
        flexDirection: 'row',
        flex: 1,
      },
    }),
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 15,
    overflowY: 'auto',
  },
  messageContainer: {
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  thumbnailWrapper: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  damageIconWrapper: {
    position: 'absolute',
    right: 20,
    textAlign: 'center',
    top: 20,
    zIndex: 99,
  },
  damageLabel: {
    color: '#fff',
    fontSize: 14,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    backgroundColor: '#00000080',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    ...Platform.select({
      native: { paddingTop: 50 },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
    ...Platform.select({
      native: { paddingTop: 50 },
    }),
  },
  partsImageWrapper: {
    borderColor: '#a29e9e',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    margin: 5,
    paddingTop: 10,
  },
});

function Gallery({ pictures }) {
  const { i18n, t } = useTranslation();
  const isDesktopMode = useDesktopMode();
  const [focusedPhoto, setFocusedPhoto] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const { width, height } = useWindowDimensions();
  const [gestureState, setGestureState] = useState({});
  const scale = useRef(new Animated.Value(1)).current;
  const transform = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const { visibleDamages, updateVisibility } = useDamageVisibility();

  const handleVisibilityOfDamages = useCallback(() => updateVisibility(!visibleDamages), [visibleDamages]);
  const handleOnImageClick = useCallback((focusedImage) => {
    if (focusedImage.url) {
      setFocusedPhoto(focusedImage);
    }
  }, [focusedPhoto]);

  const handleUnfocusPhoto = useCallback(() => {
    scale.setValue(1);
    setFocusedPhoto(null);
  }, [scale]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: () => true,
      onPanResponderRelease:
        (event, gestureStat) => setGestureState({ dx: gestureStat.x0, dy: gestureStat.y0 }),
    }),
  ).current;

  useEffect(() => {
    if (isDesktopMode && gestureState.dx && gestureState.dy) {
      setIsZoomed(!isZoomed);

      Animated.timing(scale, {
        duration: 200,
        easing: Easing.ease,
        toValue: isZoomed ? 1 : 2,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      let x = 0;
      let y = 0;
      const { dx, dy } = gestureState;

      if (isZoomed) {
        x = 0;
        y = 0;
      } else {
        x = (width / 2) - dx;
        y = (height / 2) - dy;

        // x > 0 will check whether we clicked on left side of image or not
        if ((dx < x && x > 0) || (dx > x && x < 0)) {
          x /= 2;
        }
        // y > 0 will check whether we clicked on top side of image or not
        if ((dy < y && y > 0) || (dy > y && y < 0)) {
          y /= 2;
        }
      }

      Animated.timing(transform, {
        toValue: { x, y },
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [gestureState]);

  useEffect(() => {
    if (focusedPhoto && Platform.OS === 'web') {
      const handleKeyboardChange = (event) => {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        const currentPictureIndex = pictures.findIndex((pic) => pic.id === focusedPhoto.id);
        switch (event.key) {
          case 'ArrowLeft':
            if (currentPictureIndex - 1 >= 0) {
              setFocusedPhoto(pictures[currentPictureIndex - 1]);
            }
            break;
          case 'ArrowRight':
            if (currentPictureIndex + 1 < pictures.length) {
              setFocusedPhoto(pictures[currentPictureIndex + 1]);
            }
            break;
          default:
            return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
      };

      window.addEventListener('keydown', handleKeyboardChange);
      return () => {
        window.removeEventListener('keydown', handleKeyboardChange);
      };
    }
    return () => { };
  }, [pictures, focusedPhoto]);

  const renderList = useCallback(() => {
    if (Platform.OS === 'web') {
      return (
        pictures.map((image, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <View key={`${image.url}-${index}`} style={isDesktopMode && styles.partsImageWrapper}>
            <View style={styles.thumbnailWrapper}>
              <Thumbnail image={image} click={handleOnImageClick} />
            </View>
            {
              isDesktopMode && image?.rendered_outputs && image?.rendered_outputs?.url > 0
              && (
                <View style={styles.thumbnailWrapper} key={`${image.url}-${index}`}>
                  <Thumbnail image={image} click={handleOnImageClick} />
                </View>
              )
            }
          </View>
        ))
      );
    }
    return (
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {
          pictures.map((image, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <View key={`${image.url}-${index}`} style={isDesktopMode && styles.partsImageWrapper}>
              <View style={[styles.thumbnailWrapper, { width: image.width, flexDirection: 'row' }]}>
                <Thumbnail image={image} click={handleOnImageClick} />
              </View>
            </View>
          ))
        }
      </ScrollView>
    );
  }, [pictures]);

  return (
    <View style={[
      styles.container,
      isDesktopMode ? { justifyContent: 'flex-start' } : { justifyContent: 'center' },
      pictures.length === 0 ? styles.messageContainer : {},
    ]}
    >
      {pictures.length > 0 ? renderList() : (<Text style={[styles.message]}>{t('gallery.empty')}</Text>)}
      <Modal
        animationType="slide"
        transparent
        visible={!!focusedPhoto}
        onRequestClose={handleUnfocusPhoto}
      >
        <View style={{ flex: 1, backgroundColor: '#000000', position: 'relative' }}>
          <Pressable
            onPress={handleUnfocusPhoto}
            style={styles.closeBtn}
          >
            <MaterialIcons
              name="close"
              size={32}
              color="#FFFFFF"
              style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
            />
          </Pressable>
          <View style={[styles.header]}>
            <Text style={[styles.title]}>
              {(focusedPhoto?.label) ? focusedPhoto.label[i18n.language] : ''}
              {' '}
              {focusedPhoto?.isRendered && t('gallery.withDamages')}
            </Text>
          </View>
          {
            !isDesktopMode && (
              <Pressable style={styles.damageIconWrapper} onPress={handleVisibilityOfDamages}>
                <MaterialIcons name={visibleDamages ? 'visibility-off' : 'visibility'} size={20} color="#fff" />
                <Text style={styles.damageLabel}>{visibleDamages ? t(`damageReport.hideDamages`) : t(`damageReport.showDamages`)}</Text>
              </Pressable>
            )
          }

          <Animated.Image
            source={{ uri: visibleDamages ? focusedPhoto?.rendered_outputs?.url : focusedPhoto?.url }}
            style={{
              flex: 1,
              cursor: !isDesktopMode ? 'auto' : isZoomed ? 'zoom-out' : 'zoom-in',
              transform: [{ scale }, { translateX: transform.x }, { translateY: transform.y }],
            }}
            resizeMode={isDesktopMode ? 'cover' : 'contain'}
            {...panResponder.panHandlers}
          />
        </View>
      </Modal>
    </View>
  );
}

Gallery.propTypes = {
  pictures: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.shape({
        en: PropTypes.string,
        fr: PropTypes.string,
      }),
      url: PropTypes.string,
    }),
  ),
};

Gallery.defaultProps = {
  pictures: [],
};

export default Gallery;
