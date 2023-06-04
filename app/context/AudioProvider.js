import { Alert, Text, View, StyleSheet, Linking, Button } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library';

// Context
export const AudioContext = createContext();

export class AudioProvider extends Component {

    constructor(props) {
        super(props)
        this.state = {
            audioFiles: [],
            permissionError: false,
            showPermissionButton: false
        }
    }

    permissionAlert = () => {
        Alert.alert("Permission Required", "This app needs to read audio files!", [{
            text: 'I am ready',
            onPress: () => this.getPermission()
        }, {
            text: 'Cancel',
            onPress: () => this.permissionAlert()
        }])
    }

    getAudioFiles = async () => {
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio'
        })
        media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: media.totalCount,
        })

        this.setState({ ...this.state, audioFiles: media.assets })
        console.log(media.assets.length);
    }

    getPermission = async () => {
        // { "canAskAgain": true, "expires": "never", "granted": false, "status": "undetermined" }

        const permission = await MediaLibrary.getPermissionsAsync()

        if (permission.granted) {
            // we want to get all the audio files
            this.getAudioFiles();
        }

        if (!permission.canAskAgain && !permission.granted) {
            this.setState({ ...this.state, permissionError: true, showPermissionButton: true })
        }

        if (!permission.granted && permission.canAskAgain) {

            const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

            // if (status === 'denied' && !canAskAgain) {
            //     // we are going to display and alert that user must allow this permission to work this app.
            //     this.permissionAlert()
            // }

            if (status === 'granted') {
                // we want to get all the audio files
                this.getAudioFiles();
            }

            if (status === 'denied' && !canAskAgain) {
                // we want to display some error to the user
                this.setState({ ...this.state, permissionError: true, showPermissionButton: true })
            }
        }

    }

    componentDidMount() {
        this.getPermission();
    }

    render() {
        if (this.state.permissionError) {
            return (
                <View style={styles.container}>
                    <Text style={{ fontSize: 25, textAlign: 'center', color: 'red' }}>
                        It looks like you haven't given the permission to access your media Files
                    </Text>

                    {this.state.showPermissionButton && (
                        <Button title="Open Settings" onPress={Linking.openSettings} />
                    )}
                </View>
            )
        }
        return (
            <AudioContext.Provider value={{ audioFiles: this.state.audioFiles }}>
                {this.props.children}
            </AudioContext.Provider>
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

export default AudioProvider