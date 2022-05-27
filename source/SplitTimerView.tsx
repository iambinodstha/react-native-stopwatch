import React from 'react';
import { StyleSheet, Text, Image } from 'react-native';
import Animated, { SlideInUp, Layout } from 'react-native-reanimated';

import { timeString } from './helper'
const SplitIcon = require('./assets/send.png');

const SplitTimerView = React.memo(({ splittedTimer }: { splittedTimer: number[] }) => {
    return (
        <>
            {splittedTimer.map((lap, index) => (
                <Animated.View
                    key={lap}
                    style={styles.splittedTimerContainer}
                    entering={SlideInUp}
                    layout={Layout.springify()}
                >
                    <Text style={styles.splitText}>
                        <Image style={styles.splitIcon} source={SplitIcon} />{" "}
                        {String(splittedTimer.length - index).padStart(2, '0')}
                    </Text>
                    <Text style={styles.splitText}>+ {timeString(lap - (splittedTimer?.[index + 1] ?? 0))}</Text>
                    <Text style={[styles.splitText, { color: "black" }]} > {timeString(lap)}</Text>
                </Animated.View >
            ))}
        </>
    )
});

export default SplitTimerView;

const styles = StyleSheet.create({
    splittedTimerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 25,
        backgroundColor: "white"
    },
    splitIcon: {
        width: 14,
        height: 14,
        tintColor: "rgba(0,0,0,0.2)",
    },
    splitText: {
        fontSize: 16,
        marginVertical: 17
    }
})