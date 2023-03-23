/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Svg, { Path, G, } from "react-native-svg";
import CAR_PARTS from './hooks/carParts';

const SELECTED_FILL_COLOR = '#ADE0FFB3';
const UNSELECTED_FILL_COLOR = 'none';

const jsxSpecialAttributes = {
  class: 'className',
};

export default function SVGComponentMapper({ element, togglePart, isPartSelected, groupName }) {
  function getAttribute(element, name) {
    for (let i = 0; i < element.attributes.length; i++) {
      if (element.attributes[i].name === name) {
        return element.attributes[i].nodeValue;
      }
    }
    return undefined;
  }

  let names = [];
  for (let i = 0; i < element.attributes.length; i++) {
    names.push(element.attributes[i].name);
  }

  const attributes = useMemo(() => names.reduce((prev, attr) => ({
      ...prev,
      [jsxSpecialAttributes[attr] ?? attr]: getAttribute(element, attr),
    }), {}), [element]);

  const elementClass = getAttribute(element, 'class');
  const elementId = getAttribute(element, 'id');

  let partKey = null;
  if (groupName && CAR_PARTS.includes(groupName)) {
    partKey = groupName;
  }
  if (elementClass && elementClass.includes('selectable') && CAR_PARTS.includes(elementId)) {
    partKey = elementId;
  }

  const color = isPartSelected(partKey) ? SELECTED_FILL_COLOR : UNSELECTED_FILL_COLOR;
  const onPress = () => {
    togglePart(partKey);
  };

  let elementChildren;
  elementChildren =  [];
  if (element.childNodes) {
    for (let i = 0; i < element.childNodes.length; i++) {
        elementChildren.push(element.childNodes[i]);
    }
  }
  const children = useMemo(() => [...elementChildren], [element]);
  const passThroughGroupName = useMemo(
    () => {
      if (element.tagName === 'g') {
        return elementId;
      } else {
        return null;
      }
    },
    [element],
  );
  
  if (element.tagName === 'svg') {
    return (
      <Svg {...attributes}>
        {children.map((child, id) => (
          <SVGComponentMapper
            key={id.toString()}
            element={child}
            togglePart={togglePart}
            isPartSelected={isPartSelected}
            groupName={passThroughGroupName}
          />
        ))}
         <Path style={{ fill: '#ffffff' }} />
      </Svg>
    );
  } else if (element.tagName === 'path') {
      return (
        <Path {...attributes} onPress={partKey ? onPress : null} fill={color}>
          {children.map((child, id) => (
            <SVGComponentMapper
              key={id.toString()}
              element={child}
              togglePart={togglePart}
              isPartSelected={isPartSelected}
              groupName={passThroughGroupName}
            />
          ))}
           <Path style={{ fill: '#ffffff' }} />
        </Path>
      );
  } else if (element.tagName === 'g') {
      return (
        <G {...attributes} onPress={partKey ? onPress : null} fill={color}>
          {children.map((child, id) => (
            <SVGComponentMapper
              key={id.toString()}
              element={child}
              togglePart={togglePart}
              isPartSelected={isPartSelected}
              groupName={passThroughGroupName}
            />
          ))}
           <Path style={{ fill: '#ffffff' }} />
        </G>
      );
  } else {
    return null;
  }
}

SVGComponentMapper.propTypes = {
  element: PropTypes.any.isRequired,
  groupName: PropTypes.string,
  isPartSelected: PropTypes.func.isRequired,
  togglePart: PropTypes.func.isRequired,
};

SVGComponentMapper.defaultProps = {
  groupName: undefined,
};
