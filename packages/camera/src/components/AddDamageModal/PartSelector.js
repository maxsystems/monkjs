import { CarView360 } from '@monkvision/inspection-report';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { useWireframe, useXMLParser } from './hooks';
import SVGComponentMapper from './svgComponentMapper';

const PART_SELECTOR_CONTAINER_WIDTH = 420;
const PART_SELECTOR_CONTAINER_HEIGHT_DIMENSION = [
  { screenHeightSpan: [0, 285], partSelectorHeight: 190 },
  { screenHeightSpan: [285, 310], partSelectorHeight: 190 },
  { screenHeightSpan: [310, 99999], partSelectorHeight: 235 },
];

const selectedPartAttributes = {
  style: { fill: '#ADE0FFB3' },
};

export default function PartSelector({ orientation, togglePart, isPartSelected, vehicleType }) {
  const { height } = useWindowDimensions();

  const containerHeight = useMemo(
    () => PART_SELECTOR_CONTAINER_HEIGHT_DIMENSION
      .find(({ screenHeightSpan }) => screenHeightSpan[0] <= height
        && height < screenHeightSpan[1])?.partSelectorHeight ?? 235,
    [height],
  );

  const getPartAttributes = useCallback(
    (part) => (isPartSelected(part) ? selectedPartAttributes : {}),
    [isPartSelected],
  );

  return (
    <CarView360
      vehicleType={vehicleType}
      orientation={orientation}
      onPressPart={togglePart}
      getPartAttributes={getPartAttributes}
      width={PART_SELECTOR_CONTAINER_WIDTH}
      height={containerHeight}
    />
  );
}

PartSelector.propTypes = {
  isPartSelected: PropTypes.func.isRequired,
  orientation: PropTypes.number.isRequired,
  togglePart: PropTypes.func.isRequired,
  vehicleType: PropTypes.string.isRequired,
};

PartSelector.defaultProps = {};
