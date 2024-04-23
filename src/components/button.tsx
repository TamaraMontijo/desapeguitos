import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
  bgColor: string
};

export function Button({ title, isLoading = false, bgColor, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isLoading}
      className={`min-w-32 h-14 items-center justify-center rounded-2xl ${bgColor}`}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator className="text-white" />
      ) : (
        <Text className="text-white font-nunitoBold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
