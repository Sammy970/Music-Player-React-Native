import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import AudioListItem from '../components/AudioListItem'
import Screen from '../components/Screen'
import OptionModal from '../components/OptionModal'
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../misc/audioController'

export class AudioList extends Component {

    static contextType = AudioContext;

    constructor(props) {
        super(props);
        this.state = {
            optionModalVisible: false,
        }

        this.currentItem = {}
    }

    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        switch (type) {
            case 'audio':
                dim.width = Dimensions.get('window').width;
                dim.height = 70;
                break;
            default:
                dim.width = 0;
                dim.height = 0;
                break;
        }

    });

    OnPlaybackStatusUpdate = async (playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.context.updateState(this.context, {
                playbackPosition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            })
        }

        if (playbackStatus.didJustFinish) {

            const nextAudioIndex = this.context.currentAudioIndex + 1
            // console.log(nextAudioIndex);

            // there is no next audio to play
            if (nextAudioIndex >= this.context.totalAudioCount) {
                this.context.playbackObj.unloadAsync();
                return this.context.updateState(this.context, {
                    soundObj: null,
                    currentAudio: this.context.audioFiles[0],
                    isPlaying: false,
                    currentAudioIndex: 0,
                    playbackPosition: null,
                    playbackDuration: null,
                });
            }

            // otherwise, continue playing the next audio
            const audio = this.context.audioFiles[nextAudioIndex];

            const status = await playNext(this.context.playbackObj, audio.uri)

            return this.context.updateState(this.context, {
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: nextAudioIndex,
            });
        }
    }

    handleAudioPress = async (audio) => {

        const { playbackObj, soundObj, currentAudio, updateState, audioFiles, currentAudioIndex } = this.context;

        // Playing Audio for first time
        if (soundObj === null) {
            const playbackObj = new Audio.Sound();
            const status = await play(playbackObj, audio.uri);
            const index = audioFiles.indexOf(audio);
            updateState(this.context, {
                playbackObj: playbackObj,
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: index,
            });
            return playbackObj.setOnPlaybackStatusUpdate(this.OnPlaybackStatusUpdate);
        }

        // Pause audio
        if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
            const status = await pause(playbackObj);
            return updateState(this.context, { soundObj: status, isPlaying: false, });
        }

        // Resume Audio
        if (
            soundObj.isLoaded &&
            !soundObj.isPlaying &&
            currentAudio.id === audio.id
        ) {
            const status = await resume(playbackObj);
            return updateState(this.context, { soundObj: status, isPlaying: true, });
        }

        // Select another audio
        if (soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await playNext(playbackObj, audio.uri);
            const index = audioFiles.indexOf(audio);
            return updateState(this.context, {
                currentAudio: audio,
                soundObj: status,
                isPlaying: true,
                currentAudioIndex: index,
            });
        }
    }

    rowRenderer = (type, item, index, extendedState) => {
        return (
            <AudioListItem
                title={item.filename}
                duration={item.duration}
                onAudioPress={() => this.handleAudioPress(item)}
                onOptionPress={() => {
                    this.currentItem = item;
                    this.setState({ ...this.state, optionModalVisible: true });
                }}
                isPlaying={extendedState.isPlaying}
                activeListItem={this.context.currentAudioIndex === index}
            />
        )
    }

    render() {
        return (
            <AudioContext.Consumer>
                {({ dataProvider, isPlaying }) => {
                    return (
                        <Screen style={{ flex: 1 }}>
                            <RecyclerListView
                                dataProvider={dataProvider}
                                layoutProvider={this.layoutProvider}
                                rowRenderer={this.rowRenderer}
                                extendedState={{ isPlaying }}
                            />
                            <OptionModal
                                currentItem={this.currentItem}
                                onClose={() => this.setState({ ...this.state, optionModalVisible: false })}
                                visible={this.state.optionModalVisible}
                                onPlayPress={() => console.log("Playing Song")}
                                onPlayListPress={() => console.log("Added to Playlist")}
                            />
                        </Screen>
                    )
                }}
            </AudioContext.Consumer>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AudioList
