function checkForVisibility() {
  var textSections = document.querySelectorAll(".text-section");
  textSections.forEach(function(textSection) {
    if (isElementInViewport(textSection)) {
      textSection.classList.add("text-section-visible");
    } else {
      textSection.classList.remove("text-section-visible");
    }
  });
}

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

if (window.addEventListener) {
  addEventListener("DOMContentLoaded", checkForVisibility, false);
  addEventListener("load", checkForVisibility, false);
  addEventListener("scroll", checkForVisibility, false);
}
