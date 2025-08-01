import * as React from "react";
import Svg, { Path } from "react-native-svg";

const LockIcon = ({ 
  size = 32, 
  color = "#ddd", 
  strokeWidth = 2,
  ...props 
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M8 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2m-8 0V7a4 4 0 0 1 4-4v0a4 4 0 0 1 4 4v3m-8 0h8m-4 4v3"
    />
  </Svg>
);

export default LockIcon;