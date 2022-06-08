import { Platform } from 'react-native';
import * as styles from './styles';

const RATIO_FACTOR = 240;
const makeRatio = (width, height) => `${width / RATIO_FACTOR}:${height / RATIO_FACTOR}`;

function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

const useNativeDriver = Platform.OS !== 'web';

/**
 * @param params {[*]}
 * @param severity {'log'|'warn'|'error'}
 */
function log(params = [], severity = 'log') {
  // eslint-disable-next-line no-console
  console[severity](...params);
}

function supportsWebP() {
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  // very old browser like IE 8, canvas not supported
  return false;
}

/**
 * Inaccurately checking if the device supports taking QHD images on the web
 * @param {func} takePicture
 * @returns {bool}
 */
function inaccuratelyCheckQHDSupport(takePicture) {
  const MARK_START = 'mark_start';
  const MARK_END = 'mark_end';
  const MAX_DURATION_FOR_FHD_PICTURE = 250; // in ms

  performance.mark(MARK_START);
  const picture = takePicture(); URL.revokeObjectURL(picture.uri);
  performance.mark(MARK_END);

  const { duration } = performance.measure('Measuring `takePicture()` execution time', MARK_START, MARK_END);

  return duration < MAX_DURATION_FOR_FHD_PICTURE;
}

export default {
  styles,
  log,
  makeRatio,
  getOS,
  useNativeDriver,
  supportsWebP,
  inaccuratelyCheckQHDSupport,
};
