import * as React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";

const UserIcon = ({ size = 32, color = "#ddd", ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <G
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <Circle cx={12} cy={6} r={4} />
      <Path d="M21 22a1 1 0 0 0-18 0Z" />
    </G>
  </Svg>
);

export default UserIcon;