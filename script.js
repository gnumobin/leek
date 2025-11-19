const ul = document.querySelector("ul");
const handle = document.querySelector(".handle");
const overlay = document.querySelector(".overlay");

// safe vibration wrapper (iOS Safari does NOT support vibrate)
const vibrate = (ms) => {
  if (navigator.vibrate)
    try {
      navigator.vibrate(ms);
    } catch (e) {}
  // if not supported, do nothing — iOS won't vibrate from web
};

let dragging = false,
  startX = 0,
  curX = 0,
  origX = 0,
  width = ul.offsetWidth;

// initialize closed
origX = curX = -width;
ul.style.transform = `translate3d(${curX}px,0,0)`;
overlay.style.opacity = 0;
overlay.style.pointerEvents = "none";

// helper to read touch X
const getX = (e) =>
  e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX || 0;

// apply transforms + overlay + handle parallax
const apply = () => {
  ul.style.transform = `translate3d(${curX}px,0,0)`;
  const progress = 1 + curX / width; // 0..1
  overlay.style.opacity = Math.max(0, Math.min(0.35, 0.35 * progress));
  overlay.style.pointerEvents = progress > 0 ? "auto" : "none";

  // handle always visible; small parallax
  const handleOffset = curX / 3; // negative when closed
  handle.style.transform = `translate3d(${handleOffset}px,-50%,0)`;
};

// START: only start drag when touching handle or the menu itself
// IMPORTANT: for preventing swipe-back when starting on handle, use passive:false and preventDefault()
const startOnHandle = (e) => {
  // prevent iOS back-swipe when starting on the handle
  e.preventDefault && e.preventDefault();

  dragging = true;
  startX = getX(e);
  width = ul.offsetWidth;
  ul.style.transition = "none";
  overlay.style.transition = "none";
  handle.style.transition = "none";

  // optional haptic (works only on supporting devices, not iOS Safari)
  vibrate(12);
};

// attach touchstart to handle with passive:false so we can call preventDefault()
handle.addEventListener("touchstart", startOnHandle, { passive: false });

// Also allow starting drag from inside the menu (but don't preventDefault there to avoid blocking page gestures)
ul.addEventListener(
  "touchstart",
  (e) => {
    // if touch started on a focusable element, you may want to skip, but we allow start
    dragging = true;
    startX = getX(e);
    width = ul.offsetWidth;
    ul.style.transition = "none";
    overlay.style.transition = "none";
    handle.style.transition = "none";
  },
  { passive: true }
);

// MOVE: update curX while dragging
const onMove = (e) => {
  if (!dragging) return;
  const x = getX(e);
  curX = Math.min(0, origX + (x - startX));
  apply();
};
document.addEventListener("touchmove", onMove, { passive: true });

// END: snap open/close
const onEnd = () => {
  if (!dragging) return;
  dragging = false;

  ul.style.transition = "transform .33s cubic-bezier(.25,1,.5,1)";
  overlay.style.transition = "opacity .33s ease";
  handle.style.transition = "transform .33s cubic-bezier(.25,1,.5,1)";

  // smaller threshold (you asked earlier)
  const openThreshold = -width / 5; // changeable; here 1/5 width
  const shouldOpen = curX > openThreshold;
  curX = shouldOpen ? 0 : -width;

  ul.style.transform = `translate3d(${curX}px,0,0)`;
  overlay.style.opacity = curX === 0 ? 0.35 : 0;
  overlay.style.pointerEvents = curX === 0 ? "auto" : "none";
  handle.style.transform = `translate3d(${curX === 0 ? 0 : 0}px,-50%,0)`; // keep visible

  // optional final haptic (works on Android)
  vibrate(40);

  origX = curX;
};
document.addEventListener("touchend", onEnd);

// Overlay click/tap closes menu (use both click and touchstart to be robust)
const closeMenu = () => {
  curX = -width;
  origX = curX;
  ul.style.transition = "transform .33s cubic-bezier(.25,1,.5,1)";
  overlay.style.transition = "opacity .33s ease";
  ul.style.transform = `translate3d(${curX}px,0,0)`;
  overlay.style.opacity = 0;
  overlay.style.pointerEvents = "none";
  handle.style.transform = "translate3d(0,-50%,0)";
  // final haptic
  vibrate(40);
};
overlay.addEventListener("click", closeMenu);
overlay.addEventListener(
  "touchstart",
  (e) => {
    // prevent accidental drag start from overlay
    e.preventDefault && e.preventDefault();
    closeMenu();
  },
  { passive: false }
);
