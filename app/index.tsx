import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ThemedText>Edit app/index.tsx to edit this screen.</ThemedText>
        </View>
    );
}
