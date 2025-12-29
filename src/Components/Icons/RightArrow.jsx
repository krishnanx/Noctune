import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RightArrow = ({ width = 24, height = 24, fill = "#fff" }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
    >
      <Path d="M12 4l8 8-8 8-1.41-1.41L17.17 12H4v-2h13.17l-6.58-6.59L12 4z" />
    </Svg>
  );
};

export default RightArrow;
