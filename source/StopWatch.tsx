import React, { useMemo, useRef, useState } from 'react';
import {
    StyleSheet, Text, useColorScheme, View, SafeAreaView,
    TouchableOpacity, ScrollView, Image, Dimensions
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn } from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { calculateTimerPosition, timeString } from './helper';
import SplitTimerView from './SplitTimerView';

const PlayIcon = require('./assets/play.png');
const PauseIcon = require('./assets/pause.png');
const StopIcon = require('./assets/stop.png');
const SplitIcon = require('./assets/send.png');

type Props = {}


const StopWatch = (props: Props) => {
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [splittedTimer, setSplittedTimer] = useState<number[]>([]);
    const [timerWidth, setTimerWidth] = useState(0);

    const windowWidth = Dimensions.get('window').width;
    const isDarkMode = useColorScheme() === 'dark';
    const stopWatch: { current: NodeJS.Timer | null } = useRef(null);

    const timerPositionX = useMemo(() => calculateTimerPosition(windowWidth, timerWidth), [windowWidth, timerWidth]);
    const timerTranslateY = useSharedValue(200);
    const timerTranslateX = useSharedValue(timerPositionX);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    function startTimer() {
        setIsRunning(true);
        stopWatch.current = setInterval(() => {
            setTimer(prevState => prevState + 10);
        }, 10);
    }

    function pauseWatch() {
        setIsRunning(false);
        clearInterval(stopWatch.current as NodeJS.Timer);
    }

    function splitTimer() {
        setSplittedTimer([timer, ...splittedTimer]);
        if (splittedTimer.length === 0) {
            animateTimerView(); // animate timer
        }
    }

    function resetTimer() {
        setTimer(0);
        setSplittedTimer([]);
        animateTimerView(); // animate timer
    }

    function animateTimerView() {
        timerTranslateX.value = withTiming(timerTranslateX.value === 25 ? (timerPositionX) : 25);
        timerTranslateY.value = withTiming(timerTranslateY.value === 200 ? 50 : 200);
    }

    const reanimatedStyle = useAnimatedStyle(() => {
        return {
            marginTop: timerTranslateY.value,
            marginLeft: timerTranslateX.value
        }
    }, []);

    return (
        <SafeAreaView style={[backgroundStyle, styles.container]}>

            {/* timer clock view */}
            <Animated.View
                onLayout={e => {
                    if (!timerWidth) {
                        const width = e.nativeEvent.layout.width;
                        timerTranslateX.value = withTiming(calculateTimerPosition(windowWidth, width));
                        setTimerWidth(width);
                    }
                }}
                style={[reanimatedStyle, { marginBottom: 20 }]}
            >
                <Text style={[styles.timerText, { fontSize: splittedTimer.length ? 45 : 65 }]}>{timeString(timer)}</Text>
                {splittedTimer.length !== 0 && (
                    <Animated.Text entering={FadeIn.delay(100)}>Current timing</Animated.Text>
                )}
            </Animated.View>

            <ScrollView style={{ flex: 1 }}>
                <SplitTimerView splittedTimer={splittedTimer} />
            </ScrollView>

            {/* action buttons */}
            <View style={styles.bottomContainer}>
                {(isRunning || Boolean(timer)) && (
                    <TouchableOpacity style={styles.actionButton} onPress={isRunning ? splitTimer : resetTimer}>
                        <Image style={styles.actionIcon} source={isRunning ? SplitIcon : StopIcon} />
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.actionButton} onPress={isRunning ? pauseWatch : startTimer}>
                    <Image style={styles.actionIcon} source={isRunning ? PauseIcon : PlayIcon} />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default StopWatch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    timerText: {
        color: "black",
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 20,
        paddingBottom: 45
    },
    actionButton: {
        borderRadius: 100,
        padding: 20,
        marginHorizontal: 22,
        backgroundColor: "white",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    actionIcon: {
        width: 20,
        height: 20,
        tintColor: "#2283f6"
    }
});