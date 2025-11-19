const ul = document.querySelector("ul");
const handle = document.querySelector(".handle");
const overlay = document.querySelector(".overlay");

let dragging = false,
  startX = 0,
  curX = 0,
  origX = 0,
  width = ul.offsetWidth;

// منو ابتدا بسته باشد
origX = curX = -width;
ul.style.transform = `translateX(${curX}px)`;

// HELPER
const getX = (e) => e.touches[0].clientX;
const apply = () => {
  ul.style.transform = `translateX(${curX}px)`;
  overlay.style.opacity = Math.min(0.35, 0.35 * (1 + curX / width));

  // handle همیشه visible: فقط کمی جلو عقب میره، نه کامل با منو
  const handleOffset = curX / 3; // کمتر از منو
  handle.style.transform = `translate(${handleOffset}px, -50%)`;
};

// START
const onStart = (e) => {
  const t = e.target;
  if (t !== handle && t !== ul && t !== overlay) return;
  dragging = true;
  startX = getX(e);
  width = ul.offsetWidth;
  ul.style.transition = "none";
  overlay.style.transition = "none";
  handle.style.transition = "none";
};

// MOVE
const onMove = (e) => {
  if (!dragging) return;
  const x = getX(e);
  curX = Math.min(0, origX + (x - startX));
  apply();
};

// END
const onEnd = () => {
  if (!dragging) return;
  dragging = false;

  ul.style.transition = "transform 0.33s cubic-bezier(.25,1,.5,1)";
  overlay.style.transition = "opacity 0.33s ease";
  overlay.style.pointerEvents = "auto";
  handle.style.transition = "transform 0.33s cubic-bezier(.25,1,.5,1)";

  curX = curX > -width / 2 ? 0 : -width;
  ul.style.transform = `translateX(${curX}px)`;
  overlay.style.opacity = curX === 0 ? 0.35 : 0;

  // handle همیشه visible
  handle.style.transform =
    curX === 0 ? "translate(0,-50%)" : "translate(0,-50%)";

  origX = curX;
};

// فقط touch events (mobile)
document.addEventListener("touchstart", onStart, { passive: true });
document.addEventListener("touchmove", onMove, { passive: true });
document.addEventListener("touchend", onEnd);
