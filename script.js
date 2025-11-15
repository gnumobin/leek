const ul = document.querySelector("ul");
const handle = document.querySelector(".handle");

let isDragging = false;
let startX = 0;
let currentX = 0;
let origX = -ul.offsetWidth; // منو کاملاً بسته
const rightLimit = 0;
const openThreshold = -ul.offsetWidth / 3;

// مقدار اولیه
ul.style.transform = `translateX(${origX}px)`;

// گرفتن clientX از موس یا تاچ
function getClientX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX;
}

// درخواست animation frame برای drag ultra-smooth
let raf = null;
function updateDrag() {
  const skew =
    currentX < 0 ? Math.max(-6, Math.min(6, (currentX - origX) / 20)) : 0;
  const scaleY =
    currentX < 0
      ? Math.max(0.97, Math.min(1.03, 1 - (currentX - origX) / 900))
      : 1;
  ul.style.transform = `translateX(${currentX}px) skewX(${skew}deg) scaleY(${scaleY})`;
  raf = null;
}

// شروع drag
function startDrag(clientX) {
  isDragging = true;
  startX = clientX;
  ul.style.transition = "none";
}

// درگ
function doDrag(clientX) {
  if (!isDragging) return;
  const dx = clientX - startX;
  currentX = origX + dx;

  if (currentX > rightLimit) currentX = rightLimit;

  if (!raf) raf = requestAnimationFrame(updateDrag);
}

// پایان drag
function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  cancelAnimationFrame(raf);
  raf = null;

  ul.style.transition = "transform 0.35s cubic-bezier(0.25,1,0.5,1)";

  // تصمیم‌گیری باز یا بسته شدن
  if (currentX > openThreshold) {
    currentX = 0; // باز
  } else {
    currentX = -ul.offsetWidth; // بسته
  }

  ul.style.transform = `translateX(${currentX}px) skewX(0deg) scaleY(1)`;
  origX = currentX;
}

// event listeners برای drag روی handle و خود منو
["mousedown", "touchstart"].forEach((evt) => {
  handle.addEventListener(evt, (e) => startDrag(getClientX(e)));
  ul.addEventListener(evt, (e) => startDrag(getClientX(e)));
});
["mousemove", "touchmove"].forEach((evt) => {
  document.addEventListener(evt, (e) => doDrag(getClientX(e)));
});
["mouseup", "touchend"].forEach((evt) => {
  document.addEventListener(evt, endDrag);
});
