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
        console.log('Error Inside Resume helper Method');
    }
}

// select another audio