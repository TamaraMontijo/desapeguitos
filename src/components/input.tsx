import { colors } from "@/styles/colors";
import { ReactNode } from "react";

import { TextInput, View, TextInputProps } from "react-native";

function Input({children}: { children: ReactNode}) {
  return (
    <View className="w-full h-14 flex-row items-center gap-3 p-3 border border-purple-500 rounded-xl my-4">
      {children}
    </View>
  )
}

function Field({...rest} : TextInputProps) {
  return (
    <TextInput 
      className="flex-1 text-purple-500 text-base font-nunitoRegular"
      placeholderTextColor={colors.purple[500]}
      {...rest}
    />
  )
}

Input.Field = Field

export { Input }