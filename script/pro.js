const produc = document.querySelector(".produc");
const carou = document.querySelector(".carou");
const firstcarssWidth = carou.querySelector(".carss").offsetWidth;
const arrowBtns = document.querySelectorAll(".produc i");
const carouChildrens = [...carou.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of carsss that can fit in the carou at once
let carssPerView = Math.round(carou.offsetWidth / firstcarssWidth);

// Insert copies of the last few carsss to beginning of carou for infinite scrolling
carouChildrens.slice(-carssPerView).reverse().forEach(carss => {
    carou.insertAdjacentHTML("afterbegin", carss.outerHTML);
});

// Insert copies of the first few carsss to end of carou for infinite scrolling
carouChildrens.slice(0, carssPerView).forEach(carss => {
    carou.insertAdjacentHTML("beforeend", carss.outerHTML);
});

// Scroll the carou at appropriate postition to hide first few duplicate carsss on Firefox
carou.classList.add("no-transition");
carou.scrollLeft = carou.offsetWidth;
carou.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carou left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carou.scrollLeft += btn.id == "left" ? -firstcarssWidth : firstcarssWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carou.classList.add("dragging");
    // Records the initial cursor and scroll position of the carou
    startX = e.pageX;
    startScrollLeft = carou.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carou based on the cursor movement
    carou.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carou.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carou is at the beginning, scroll to the end
    if(carou.scrollLeft === 0) {
        carou.classList.add("no-transition");
        carou.scrollLeft = carou.scrollWidth - (2 * carou.offsetWidth);
        carou.classList.remove("no-transition");
    }
    // If the carou is at the end, scroll to the beginning
    else if(Math.ceil(carou.scrollLeft) === carou.scrollWidth - carou.offsetWidth) {
        carou.classList.add("no-transition");
        carou.scrollLeft = carou.offsetWidth;
        carou.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carou
    clearTimeout(timeoutId);
    if(!produc.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carou after every 2500 ms
    timeoutId = setTimeout(() => carou.scrollLeft += firstcarssWidth, 800);
}
autoPlay();

carou.addEventListener("mousedown", dragStart);
carou.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carou.addEventListener("scroll", infiniteScroll);
produc.addEventListener("mouseenter", () => clearTimeout(timeoutId));
produc.addEventListener("mouseleave", autoPlay);