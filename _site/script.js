function getPics() {
  const imgs = document.querySelectorAll('.myImg');
  const fullPage = document.querySelector('#fullpage');
  const titleText = document.getElementById("title_text");
  const locationText = document.getElementById("location_tag");
  const dateText = document.getElementById("date_tag");
  const captionText = document.getElementById("caption");
  const tagText = document.getElementById("tag");
  const frontArrow = document.getElementById("frontArrow");
  const backArrow = document.getElementById("backArrow");
  const featureImg = document.getElementById("img01");
  const modaleElements = document.getElementById("modal-elements");

  let index = 0; // Initialize index variable outside the loop

  // Event listener for back arrow
  backArrow.addEventListener('click', function() {
    index = (index <= 0) ? imgs.length - 1 : index - 1;
    updateModalContent(index);
  });

  // Event listener for front arrow
  frontArrow.addEventListener('click', function() {
    index = (index + 1) % imgs.length;
    updateModalContent(index);
  });

  // Function to update modal content
  function updateModalContent(index) {
    const img = imgs[index];
    featureImg.src = img.src;
    const data = img.alt.split("|");
    titleText.innerHTML = data[0];
    locationText.innerHTML = data[1];
    dateText.innerHTML = data[2];
    captionText.innerHTML = data[3];
    tagText.innerHTML = data[4].split(",")[0];
    // featureImg.onload = function() {
    //   magnify(featureImg, 3.5);
    // };
  }

  // Event listeners for each image
  imgs.forEach((img, i) => {
    img.addEventListener('click', function() {
      index = i; // Update index when an image is clicked
      updateModalContent(index);
      fullPage.style.display = 'block';
    });
  });
}

function closeView() {
  const fullPage = document.querySelector('#fullpage');
  fullPage.style.display = 'none';
}
function magnify(element, zoom) {
  let img = element;
  let glass = document.createElement("DIV");
  glass.setAttribute("class", "img-magnifier-glass");

  // Insert magnifier glass into the DOM
  img.parentElement.insertBefore(glass, img);

  // Set background properties for the magnifier glass
  glass.style.backgroundImage = `url(${img.src})`;
  glass.style.backgroundRepeat = "no-repeat";
  glass.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;

  const bw = 3;
  const w = 200; // Default size for the magnifier
  const h = 200;

  glass.style.width = `${w}px`;
  glass.style.height = `${h}px`;
  glass.style.borderWidth = `${bw}px`;
  glass.style.position = 'absolute';
  glass.style.zIndex = '1000'; // Bring to the front

  // Function to move the magnifier
  function moveMagnifier(e) {
    const pos = getCursorPos(e);
    let x = pos.x - w/4;
    let y = pos.y - h/2;

    glass.style.left = `${x + (w / 4)}px`;
    glass.style.top = `${y + (h)}px`;
    glass.style.backgroundPosition = `-${x * zoom}px -${y * zoom}px`;
  }

  // Show and hide functions
  function showMagnifier() {
    glass.style.display = 'block'; // Show the magnifying glass
  }

  function hideMagnifier() {
    glass.style.display = 'none'; // Hide the magnifying glass
  }

  // Add event listeners for moving and hovering
  img.addEventListener("mousemove", moveMagnifier); // Move magnifier with cursor

  img.addEventListener("mouseover", showMagnifier); // Show when hovering
  img.addEventListener("mouseout", function(e) {
    // Hide when leaving the image or magnifying glass
    if (e.relatedTarget && (e.relatedTarget !== glass)) {
      hideMagnifier();
    }
  });

  glass.addEventListener("mousemove", moveMagnifier); // Keep magnifier active when hovering over it

  glass.addEventListener("mouseout", function(e) {
    // Hide when leaving the glass
    if (e.relatedTarget && (e.relatedTarget !== img)) {
      hideMagnifier();
    }
  });

  function getCursorPos(e) {
    const a = img.getBoundingClientRect();
    let x = e.pageX - a.left - window.pageXOffset;
    let y = e.pageY - a.top - window.pageYOffset;
    return {x, y};
  }
  glass.style.display = 'none';
}