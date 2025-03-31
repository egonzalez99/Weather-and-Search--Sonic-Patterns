/* this will allow the user to scroll through the images that act as a reference
link to the tri-states in a fun display */
const track = document.getElementById("image-container");


const handleOnDown = e => track.dataset.mouseIsDown = e.clientX; //whereever the user clicks on the screen that will be the starter point

//needed to initalize what value the mouse should intially start at 
track.dataset.mouseIsDown = "0";
track.dataset.prevPercentage = "0";
track.dataset.currentPercentage = "0";

const handleOnUp = () => {
  track.dataset.mouseIsDown = "0";  
  track.dataset.prevPercentage = track.dataset.currentPercentage;
}

const handleOnMove = e => {
    console.log("Mouse down at", e.clientX); //show x position

    if(track.dataset.mouseIsDown === "0") return;

    const mouseTracker  = parseFloat(track.dataset.mouseIsDown) - e.clientX, ///track how far mouse moved from starting point
    maxScroll = window.innerWidth / 2;

    const currentPercentage = (mouseTracker  / maxScroll ) * -100, // conversion of data to percentage 0-100
    nextPercentageFree = parseFloat(track.dataset.prevPercentage) + currentPercentage,
    nextPercentage = Math.max(Math.min(nextPercentageFree, 0), -100); //contain the range in a certain amount so scroll is not infinite

    track.dataset.currentPercentage = nextPercentage; //keep track of previous position to be store so it does not reset to zero

    track.style.translate = "transform 1s ease";
  
  // smoother animation while scrolling the images
  track.animate({
    transform: `translate(${nextPercentage}%, -50%)`
  }, { duration: 1, fill: "forwards" });
  
  for(const image of track.getElementsByClassName("image")) {
    image.animate({
      objectPosition: `${100 + nextPercentage}% center`
    }, { duration: 1, fill: "forwards" });
  }
}

// event listeners for mouse being pressed down, up, and movement
window.onmousedown = e => handleOnDown(e);
window.onmouseup = e => handleOnUp();
window.onmousemove = e => handleOnMove(e);
