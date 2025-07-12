import React from "react";
import Svg, { Path } from "react-native-svg";

const Info = ({ width = 24, height = 24, fill = "#e3e3e3" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
    >
      <Path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
               10-4.48 10-10S17.52 2 12 2zm0 17
               c-.55 0-1-.45-1-1v-6c0-.55.45-1
               1-1s1 .45 1 1v6c0 .55-.45 1-1 1zm0-10
               c-.55 0-1-.45-1-1s.45-1 1-1
               1 .45 1 1-.45 1-1 1z"
      />
    </Svg>
  );
};

export default Info;
