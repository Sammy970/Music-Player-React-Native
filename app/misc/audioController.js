// play audio
export const play = async (playbackObj, uri) => {
    try {
        return await playbackObj.loadAsync({ uri }, { shouldPlay: true });
    } catch (error) {
        console.log('Error Inside Play Method', error.message);
    }
}

// pause audio
export const pause = async (playbackObj) => {
    try {
        return await playbackObj.setStatusAsync({ shouldPlay: false });
    } catch (error) {
        console.log('Error Inside Pause helper Method');
    }
}


// resume audio
export const resume = async (playbackObj) => {
    try {
        return await playbackObj.playAsync();
    } catch (error) {
        console.log('Error Inside Resume helper Method', error.message);
    }
}

// select another audio
export const playNext = async (playbackObj, uri) => {
    try {
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();
        return await play(playbackObj, uri);
    } catch (error) {
        console.log('Error Inside Play Next helper Method', error.message);
    }
}