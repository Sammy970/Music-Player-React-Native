import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useContext } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import Screen from "../components/Screen";
import color from "../misc/color";
import PlayerButton from "../components/PlayerButton";

import { AudioContext } from "../context/AudioProvider";

const { width } = Dimensions.get("window");

const Player = () => {
    const context = useContext(AudioContext);

    const { playbackPosition, playbackDuration } = context;

    const calculateSeekbar = () => {
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }
        return 0;
    }
    return (
        <Screen>
            <View style={styles.container}>
                <Text style={styles.audioCount}>
                    {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
                </Text>
                <View style={styles.midBannerContainer}>
                    <MaterialCommunityIcons
                        name="music-circle"
                        size={300}
                        color={context.isPlaying ? color.ACTIVE_BG : '#223232'}
                    />
                </View>

                <View style={styles.audioPlayerContainer}>
                    <Text numberOfLines={1} style={styles.audioTitle}>
                        {context.currentAudio.filename}
                    </Text>
                </View>

                <Slider
                    style={{ width: width - 20, height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={calculateSeekbar()}
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}
                />

                <View style={styles.audioControllers}>
                    <PlayerButton iconType="PREV" />
                    <PlayerButton
                        onPress={() => console.log("Playing")}
                        style={{ marginHorizontal: 50 }}
                        iconType={context.isPlaying ? 'PLAY' : 'PAUSE'}
                    />
                    <PlayerButton iconType="NEXT" />
                </View>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    audioControllers: {
        width,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
    },
    audioCount: {
        textAlign: "right",
        padding: 15,
        color: color.ACTIVE_BG,
        fontSize: 14,
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    audioTitle: {
        fontSize: 16,
        color: color.FONT,
        padding: 15,
    },
});

export default Player;
