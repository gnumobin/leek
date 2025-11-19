const ul = document.querySelector("ul");
const handle = document.querySelector(".handle");
const overlay = document.querySelector(".overlay");

let dragging = false,
  startX = 0,
  curX = 0,
  origX = ul.offsetWidth,
  width = ul.offsetWidth;

// Inital State
ul.style.transform = `translateX(${origX}px)`;

// HELPER
const getX = (e) => e.touches[0].clientX;
const apply = () => {
  ul.style.transform = `translateX(${curX}px)`;
  overlay.style.opacity = Math.min(0.35, 0.35 * (1 - curX / width));
  handle.style.transform = `translate(${curX / 3}px,-50%)`;
};

// START
const onStart = (e) => {
  if (![handle, ul].includes(e.target)) return;
  dragging = true;
  startX = getX(e);
  width = ul.offsetWidth;
  [ul, overlay, handle].forEach((el) => (el.style.transition = "none"));
};

// MOVE
const onMove = (e) => {
  if (!dragging) return;
  curX = Math.max(0, Math.min(width, origX + (getX(e) - startX)));
  apply();
};

// END
const onEnd = () => {
  if (!dragging) return;
  dragging = false;
  [ul, overlay, handle].forEach(
    (el) =>
      (el.style.transition =
        ".33s cubic-bezier(.25,1,.5,1) transform, .33s ease opacity")
  );
  curX = curX < width / 2 ? 0 : width;
  apply();
  origX = curX;
  handle.style.transform = "translate(0,-50%)";
};

// Attach touch events
[handle, ul].forEach((el) => {
  el.addEventListener("touchstart", onStart, { passive: true });
  el.addEventListener("touchmove", onMove, { passive: true });
  el.addEventListener("touchend", onEnd);
});

// Overlay click → close
overlay.addEventListener("click", () => {
  curX = origX = width;
  apply();
});
