import React from 'react'
import Svg, { Path } from "react-native-svg";
const RightArrow = ({ width = 24, height = 24, fill =   "#fff" }) =>{
    return(
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
        <Path d="M560 720L504 662L646 520H160v-80h486L504 298l56-58 240 240-240 240Z" />            
        </Svg>
    )
}
export default RightArrow