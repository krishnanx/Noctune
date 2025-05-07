import React from 'react'
import Svg,{Path} from "react-native-svg"
const ChevronForward = ({height=24,width=24,fill="#e3e3e3"}) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
        <Path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></Svg>
  )
}

export default ChevronForward