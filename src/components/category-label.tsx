import { Pressable, Text, PressableProps } from "react-native";
import { clsx } from 'clsx'

type CategoryProps = PressableProps & {
  title: string,
  isSelected?: boolean
}

export function CategoryLabel({ title, isSelected, ...rest }: CategoryProps) {
  return (
    <Pressable className={clsx("", isSelected && "border-b-4 border-blue")} {...rest}>
      <Text className="font-nunitoBold color-dark text-xl">{title}</Text>
    </Pressable>
  )
}