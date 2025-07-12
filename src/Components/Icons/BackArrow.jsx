import React from 'react'
import Svg, { Path } from 'react-native-svg';
const BackArrow = ({ width = 24, height = 24, fill = '#e3e3e3' }) => {
  return (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 -960 960 960"
    fill={fill}
  >
    <Path d="M313-440l224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
  </Svg>
  )
}

export default BackArrow