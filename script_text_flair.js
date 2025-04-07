function checkForVisibility() {
  var textSections = document.querySelectorAll(".text-section");
  textSections.forEach(function (textSection) {
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
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
let fadeInterval = null;
let isPaused = false;
let fadeIndex = 0;

function startMapFade(container) {
  const images = container.querySelectorAll(".map-image");
  if (images.length === 0 || fadeInterval) return;

  images[fadeIndex].classList.add("active");

  fadeInterval = setInterval(() => {
    const current = images[fadeIndex];
    fadeIndex = (fadeIndex + 1) % images.length;
    const next = images[fadeIndex];

    next.classList.add("active");
    setTimeout(() => {
      current.classList.remove("active");
    }, 300);
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  const mapFader = document.querySelector(".map-fader");
  if (mapFader && !mapFader.classList.contains("fader-started")) {
    mapFader.classList.add("fader-started");
    startMapFade(mapFader);
  }

  const toggleBtn = document.getElementById("toggle-fade");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      isPaused = !isPaused;
      toggleBtn.textContent = isPaused ? "▶" : "⏸";

      if (isPaused) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      } else {
        startMapFade(document.querySelector(".map-fader"));
      }
    });
  }
});


if (window.addEventListener) {
  addEventListener("DOMContentLoaded", () => {
    checkForVisibility(); // text fade-in logic
    const mapFader = document.querySelector(".map-fader");
    if (mapFader && !mapFader.classList.contains("fader-started")) {
      mapFader.classList.add("fader-started");
      startMapFade(mapFader);
    }
  });

  addEventListener("load", checkForVisibility, false);
  addEventListener("scroll", checkForVisibility, false);
}
