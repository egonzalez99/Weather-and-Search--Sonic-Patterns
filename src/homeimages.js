/* this will allow the user to scroll through the images that act as a reference
link to the tri-states in a fun display */
const track = document.getElementById("image-container");

window.onmousedown = e => {
    if(track.dataset.mouseDownAt === "0") return;

    e.clientX; //whereever the user clicks on the screen that will be the starter point
    track.dataset.mouseDownAt = e.clientX;
    const mouseTracker = parseFloat(track.dataset.mouseDownAt) - e.clientX;//track how far mouse moved from starting point
    maxScroll = window.innerWidth / 2;

    const percentageScroll = (mouseTracker / maxScroll) * -100; // conversion of data to percentage 0-100
    track.style.transform = `translate(${percentageScroll}%, -50%)`;

}