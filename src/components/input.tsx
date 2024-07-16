import { colors } from "@/styles/colors";
import { ReactNode } from "react";

import { TextInput, View, TextInputProps } from "react-native";

function Input({children, style}: { children: ReactNode, style?: string}) {
  return (
    <View className={`h-14 min-w-64 flex-row items-center gap-3 p-3 border border-primary-500 rounded-xl my-4 ${style}`}>
      {children}
    </View>
  )
}

function Field({...rest} : TextInputProps) {
  return (
    <TextInput 
      className="flex-1 text-primary-500 text-base font-nunitoRegular"
      placeholderTextColor={colors.primary[500]}
      {...rest}
    />
  )
}

Input.Field = Field

export { Input }