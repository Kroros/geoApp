import {
  TouchableOpacity,
  ViewStyle
} from "react-native";
import { ReactNode } from "react";

interface Props {
    onSelect: () => void,
    children: ReactNode
    style: ViewStyle
}

export default function SearchDropDownOption({ onSelect, children, style }: Props) {
  return (
    <TouchableOpacity onPress={onSelect} style={style}>
      {children}
    </TouchableOpacity>
  );
}