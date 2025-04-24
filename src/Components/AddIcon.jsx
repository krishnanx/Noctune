import React from 'react'
import Svg,{Path} from "react-native-svg"
const AddIcon = ({height=24,width=24,fill="#e3e3e3"}) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
        <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
    </Svg>
  )
}

export default AddIcon