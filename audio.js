// creating audio from the web audio api

// Ensure script runs only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Select elements
    const audioElement = document.querySelector("#audioElement");
    const playButton = document.querySelector("#playButton");

    // Create a MediaElementAudioSourceNode
    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(audioContext.destination);

    playButton.addEventListener("click", () => {
        // Check if the AudioContext is in a suspended state (autoplay policy)
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        // Play or pause the audio
        if (playButton.dataset.playing === "false") {
            audioElement.play();
            playButton.dataset.playing = "true";
        } else {
            audioElement.pause();
            playButton.dataset.playing = "false";
        }
    });
});
