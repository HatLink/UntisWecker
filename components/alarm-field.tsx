import React, { useRef, useState } from "react";
import {
    Animated,
    Platform,
    Pressable,
    StyleSheet,
    Switch,
    View,
} from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ToggleRowProps {
    label: string;
    time: string;
    initialValue?: boolean;
    onToggle?: (value: boolean) => void;
    accentColor?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AlarmField({
    label,
    time,
    initialValue = false,
    onToggle,
    accentColor = "#6C63FF",
}: ToggleRowProps) {
    const [enabled, setEnabled] = useState(initialValue);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(initialValue ? 1 : 0)).current;

    const handleToggle = (value: boolean) => {
        setEnabled(value);
        onToggle?.(value);

        // Pulse animation on toggle
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.97,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();

        // Glow fade in/out
        Animated.timing(glowAnim, {
            toValue: value ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const borderColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#444", accentColor],
    });

    const bgColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#00000000", "#222"],
    });

    const labelColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#cccccc", "#ffffff"],
    });

    const alarmColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#666", "#8888ff"],
    });

    return (
        <Pressable
            onPress={() => handleToggle(!enabled)}
            accessibilityRole="switch"
        >
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{ scale: scaleAnim }],
                        borderColor,
                        backgroundColor: bgColor,
                    },
                ]}
            >
                {/* Left: Label + Time */}
                <View style={styles.textGroup}>
                    <Animated.Text
                        style={[styles.label, { color: labelColor }]}
                    >
                        {label}
                    </Animated.Text>
                    <Animated.Text style={[styles.time, { color: alarmColor }]}>
                        {time}
                    </Animated.Text>
                </View>

                {/* Right: Toggle Switch */}
                <Switch
                    value={enabled}
                    onValueChange={handleToggle}
                    trackColor={{ false: "#555", true: accentColor }}
                    thumbColor={
                        Platform.OS === "android" ? "#FFFFFF" : undefined
                    }
                    ios_backgroundColor="#DCDCE8"
                    accessibilityLabel={`${label} toggle`}
                />
            </Animated.View>
        </Pressable>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        marginHorizontal: 0,
        marginVertical: 0,
    },
    textGroup: {
        flex: 1,
        marginRight: 16,
    },
    label: {
        fontSize: 12,
        letterSpacing: 0.2,
        marginBottom: 3,
    },
    time: {
        fontSize: 24,
        fontWeight: "600",
        fontVariant: ["tabular-nums"],
        letterSpacing: 0.5,
    },
});

// ─── Usage Example ────────────────────────────────────────────────────────────
//
// import ToggleRow from './ToggleRow';
//
// <ToggleRow
//   label="Morning Reminder"
//   time="7:00 AM"
//   initialValue={true}
//   onToggle={(val) => console.log('Toggled:', val)}
//   accentColor="#6C63FF"
// />
