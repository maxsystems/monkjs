import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, useWindowDimensions, View, Text } from 'react-native';

import useOrientation from '../../hooks/useOrientation';
import PortraitLayout from './PortraitLayout';

const SIDE = 116;
export const SIDE_WIDTH = SIDE;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  portrait: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  section: {
    alignItems: 'center',
  },
  sectionPortrait: {
    transform: [{ rotate: '90deg' }],
  },
  hidden: {
    ...Platform.select({
      native: { opacity: 0 },
      default: { visibility: 'hidden', opacity: 0 },
    }),
  },
  side: {
    display: 'flex',
    zIndex: 10,
    width: SIDE,
    overflow: 'hidden',
  },
  leftPortrait: {
    transform: [{ matrix: [0, 1, -1, 0, -120, 85] }],
  },
  rightPortrait: {
    transform: [{ matrix: [0, 1, -1, 0, -120, -84] }],
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  rotate: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateContent: {
    transform: [{ rotate: '90deg' }],
  },
  title: {
    color: 'rgba(250, 250, 250, 0.87)',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 30,
    letterSpacing: 0.15,
    fontSize: 20,
    marginVertical: 2,
  },
  p: {
    color: 'rgba(250, 250, 250, 0.87)',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.15,
    fontSize: 14,
    marginVertical: 2,
  },
});

function Layout({ backgroundColor, children, left, right, isPortrait, selectedMode }) {
  useOrientation('landscape');
  const { height, width } = useWindowDimensions();
  const { t } = useTranslation();

  const size = StyleSheet.create({
    height: isPortrait ? width : height,
    width: isPortrait ? height : width,
  });

  const containerStyle = StyleSheet.compose(
    styles.container,
    isPortrait && styles.portrait,
  );

  const sectionStyle = StyleSheet.compose(
    styles.section,
    isPortrait && styles.sectionPortrait,
  );

  const sideStyle = StyleSheet.compose(
    styles.side,
    isPortrait && styles.sidePortrait,
  );

  const leftStyle = StyleSheet.compose(
    [size, sectionStyle, sideStyle, { height: isPortrait ? width : height, width: SIDE }],
    isPortrait && styles.leftPortrait,
  );

  const rightStyle = StyleSheet.compose(
    [size, sectionStyle, sideStyle, { height: isPortrait ? width : height, width: SIDE }, { position: 'static' }],
    isPortrait && styles.rightPortrait,
  );

  /** following block code shows view when user opens camera in
     portrait mode in case of VIN detection mode */
  if (isPortrait && selectedMode === 'vinNumber') {
    return (
      <PortraitLayout
        backgroundColor={backgroundColor}
        left={left}
        right={right}
      >
        {children}
      </PortraitLayout>
    );
  }

  /** following block code shows view when user opens camera
    in portrait mode in case  other thatn VIN detection  mode */
  if (isPortrait) {
    return (
      <View style={[styles.rotate, styles.containerStyle, { backgroundColor, height, width }]}>
        <View style={styles.rotateContent}>
          <Text style={styles.title}>
            {t('layout.rotateDevice')}
          </Text>
          <Text style={styles.p}>
            {t('layout.unlockPortraitMode')}
          </Text>
        </View>
      </View>
    );
  }

  /** following block code shows default view  */
  return (
    <View
      accessibilityLabel="Layout"
      style={[
        { height, width },
        containerStyle,
        { backgroundColor },
      ]}
    >
      <View accessibilityLabel="Side left" style={leftStyle}>{left}</View>
      <View
        accessibilityLabel="Center"
        style={[size, sectionStyle, styles.center, {
          maxWidth: (isPortrait ? height : width) - (2 * SIDE),
        }]}
      >
        {children}
      </View>
      <View accessibilityLabel="Side right" style={rightStyle}>{right}</View>
    </View>
  );
}

Layout.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  isPortrait: PropTypes.bool,
  left: PropTypes.element,
  right: PropTypes.element,
  selectedMode: PropTypes.string,
};

Layout.defaultProps = {
  left: null,
  right: null,
  isPortrait: false,
  selectedMode: '',
};

export default Layout;
