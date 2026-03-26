import { StyleSheet } from "react-native";

import AlarmField from "@/components/alarm-field";
import ScrollView from "@/components/scroll-view";
export default function HomeScreen() {
    return (
        <ScrollView>
            <AlarmField
                label="1. Stunde"
                time="8:00 AM"
                onToggle={(val) => console.log("Toggled:", val)}
            />
            <AlarmField
                label="2. Stunde"
                time="8:00 AM"
                onToggle={(val) => console.log("Toggled:", val)}
            />
            <AlarmField
                label="3. Stunde"
                time="8:00 AM"
                onToggle={(val) => console.log("Toggled:", val)}
            />
            <AlarmField
                label="4. Stunde"
                time="8:00 AM"
                onToggle={(val) => console.log("Toggled:", val)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
