import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
};

export function Button({ title, isLoading = false, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isLoading}
      className="w-full h-14 bg-purple-500 items-center justify-center rounded-2xl"
    >
      {isLoading ? (
        <ActivityIndicator className="text-white" />
      ) : (
        <Text className="text-white font-nunitoBold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
