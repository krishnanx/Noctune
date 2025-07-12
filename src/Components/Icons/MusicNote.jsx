import React from 'react'
import Svg,{Path} from "react-native-svg"
const MusicNote = ({width=24,height=24,fill="#e3e3e3"}) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
        <Path d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z"/>
    </Svg>
  )
}

export default MusicNote