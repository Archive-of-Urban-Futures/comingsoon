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
    fullPage.style.backgroundImage = 'url(' + img.src + ')';
    const data = img.alt.split("|");
    titleText.innerHTML = data[0];
    locationText.innerHTML = data[1];
    dateText.innerHTML = data[2];
    captionText.innerHTML = data[3];
    tagText.innerHTML = data[4].split(",")[0];
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
