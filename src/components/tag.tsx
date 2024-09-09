import { View, Text } from "react-native";

// Tag Component
type TagProps = {
    text: string;
    backgroundColor: string;
};

export function Tag({ text, backgroundColor }: TagProps) {
    return (
        <View
            className="px-2 py-1 rounded-full absolute top-2 right-2"
            style={{ backgroundColor, zIndex: 1}}
        >
            <Text className="text-white font-nunitoBold">{text}</Text>
        </View>
    )
}


