import { Fonts } from "@/constants/theme";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_TRACK_WIDTH = 280;
const SLIDE_THUMB_SIZE = 52;
const SLIDE_MAX = SLIDE_TRACK_WIDTH - SLIDE_THUMB_SIZE - 8;

interface LessonScreenProps {
    date?: string;
    time?: string;
    firstLesson?: string;
    startTime?: string;
    endTime?: string;
    lessonText?: string;
    className?: string;
    teacherName?: string;
    weatherSummary?: string;
    onSnooze?: () => void;
    onSlideToStop?: () => void;
}

export default function LessonScreen({
    date = "Montag, 24. März",
    time = "06:45",
    firstLesson = "Erste Stunde",
    startTime = "08:00",
    endTime = "08:45",
    lessonText = "RST",
    className = "IAF32",
    teacherName = "BS",
    weatherSummary = "☁️ 12°C · Leicht bewölkt, kein Regen",
    onSnooze,
    onSlideToStop,
}: LessonScreenProps) {
    const slideX = useRef(new Animated.Value(0)).current;
    const [slid, setSlid] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !slid,
            onMoveShouldSetPanResponder: () => !slid,
            onPanResponderMove: (_, gestureState) => {
                const clamped = Math.max(
                    0,
                    Math.min(gestureState.dx, SLIDE_MAX),
                );
                slideX.setValue(clamped);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx >= SLIDE_MAX * 0.85) {
                    Animated.spring(slideX, {
                        toValue: SLIDE_MAX,
                        useNativeDriver: false,
                    }).start(() => {
                        setSlid(true);
                        onSlideToStop?.();
                    });
                } else {
                    Animated.spring(slideX, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                }
            },
        }),
    ).current;

    const labelOpacity = slideX.interpolate({
        inputRange: [0, SLIDE_MAX * 0.6],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    return (
        <View style={styles.safe}>
            {/* Date & Time */}
            <View style={styles.header}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.time}>{time}</Text>
            </View>

            {/* First Lesson Label */}
            <Text style={styles.firstLessonLabel}>{firstLesson}</Text>

            {/* Lesson Card */}
            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <View style={styles.timeCol}>
                        <Text style={styles.timeLabel}>{startTime}</Text>
                        <Text style={styles.timeLabel}>{endTime}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.lessonCol}>
                        <Text style={styles.lessonText}>{lessonText}</Text>
                        <Text style={styles.classText}>{className}</Text>
                        <Text style={styles.nameText}>{teacherName}</Text>
                    </View>
                </View>
            </View>

            {/* Weather */}
            <Text style={styles.weather}>{weatherSummary}</Text>

            <View style={styles.buttons}>
                {/* Snooze Button */}
                <TouchableOpacity
                    style={styles.snoozeButton}
                    onPress={onSnooze}
                    activeOpacity={0.75}
                >
                    <Text style={styles.snoozeText}>Schummern</Text>
                </TouchableOpacity>

                {/* Slide to Stop */}
                <View style={styles.slideTrack}>
                    <Animated.View
                        style={styles.slideThumb}
                        {...panResponder.panHandlers}
                    >
                        <Animated.View
                            style={[
                                styles.slideThumbInner,
                                {
                                    transform: [{ translateX: slideX }],
                                    backgroundColor: slid
                                        ? "#4ade80"
                                        : "#ffffff",
                                },
                            ]}
                        >
                            <Text style={styles.thumbIcon}>
                                {slid ? "" : ""}
                            </Text>
                        </Animated.View>
                    </Animated.View>

                    <Animated.Text
                        style={[styles.slideLabel, { opacity: labelOpacity }]}
                    >
                        Slide to Stop ›››
                    </Animated.Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#111111",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 64,
        display: "flex",
        justifyContent: "space-around",
    },
    header: {
        alignItems: "center",
        marginBottom: 8,
    },
    date: {
        fontFamily: Fonts.inter.regular,
        fontSize: 20,
        color: "#aaa",
        letterSpacing: 1,
        marginBottom: 2,
    },
    time: {
        fontFamily: Fonts.inter.bold,
        fontSize: 96,
        color: "#f0f0f0",
        letterSpacing: -2,
    },

    firstLessonLabel: {
        fontFamily: Fonts.inter.semiBold,
        fontSize: 14,
        color: "#bbb",
        letterSpacing: 1.5,
        marginBottom: 12,
        textTransform: "uppercase",
    },

    card: {
        width: "100%",
        borderWidth: 1.5,
        borderColor: "#444",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 20,
        backgroundColor: "#1a1a1a",
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 64,
    },
    cardRowBottom: {
        marginTop: 0,
        paddingTop: 0,
    },
    timeCol: {
        width: 46,
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingRight: 8,
    },
    lessonCol: {
        flex: 1,
    },
    timeLabel: {
        fontFamily: Fonts.inter.semiBold,
        fontSize: 12,
        color: "#888",
    },
    divider: {
        width: 1,
        height: "100%",
        minHeight: 20,
        backgroundColor: "#444",
        marginRight: 12,
    },
    lessonText: {
        flex: 1,
        fontFamily: Fonts.inter.regular,
        fontSize: 15,
        color: "#e8e8e8",
    },
    classText: {
        fontFamily: Fonts.inter.regular,
        fontSize: 15,
        color: "#e8e8e8",
        flex: 1,
    },
    nameText: {
        fontFamily: Fonts.inter.regular,
        fontSize: 13,
        color: "#999",
        textAlign: "right",
    },

    weather: {
        fontFamily: Fonts.inter.semiBold,
        fontSize: 13,
        color: "#aaa",
        textAlign: "center",
        marginBottom: 32,
        letterSpacing: 0.4,
    },

    snoozeButton: {
        width: "100%",
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#555",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor: "#1c1c1c",
    },
    snoozeText: {
        fontFamily: Fonts.inter.bold,
        fontSize: 17,
        color: "#e0e0e0",
        letterSpacing: 0.5,
    },

    slideTrack: {
        width: SLIDE_TRACK_WIDTH,
        height: SLIDE_THUMB_SIZE + 8,
        borderRadius: (SLIDE_THUMB_SIZE + 8) / 2,
        borderWidth: 1.5,
        borderColor: "#555",
        backgroundColor: "#1c1c1c",
        justifyContent: "center",
        overflow: "hidden",
    },
    slideThumb: {
        position: "absolute",
        left: 4,
        top: 4,
        width: SLIDE_TRACK_WIDTH - 8,
        height: SLIDE_THUMB_SIZE,
    },
    slideThumbInner: {
        position: "absolute",
        left: 0,
        width: SLIDE_THUMB_SIZE,
        height: SLIDE_THUMB_SIZE,
        borderRadius: SLIDE_THUMB_SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    thumbIcon: {
        fontSize: 18,
        color: "#111",
        fontWeight: "bold",
    },
    slideLabel: {
        textAlign: "center",
        fontFamily: Fonts.inter.bold,
        fontSize: 14,
        color: "#888",
        letterSpacing: 1,
        pointerEvents: "none",
    } as any,
    buttons: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
});
