const ul = document.querySelector("ul");

let isDragging = false;
let startX = 0;
let currentX = 0;
let origX = 0;

const leftLimit = -150; // حد slide-out
const rightLimit = 0;

// گرفتن clientX از موس یا تاچ
function getClientX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX;
}

// شروع درگ
function startDrag(clientX) {
  isDragging = true;
  startX = clientX;
  ul.style.transition = "none"; // هنگام درگ بدون transition
}

// درگ لحظه‌ای
function doDrag(clientX) {
  if (!isDragging) return;

  const dx = clientX - startX;
  currentX = origX + dx;

  // محدودیت راست
  if (currentX > rightLimit) currentX = rightLimit;

  // yoga-effect فقط سمت چپ
  const skew = currentX < 0 ? Math.max(-25, Math.min(25, dx / 15)) : 0;

  ul.style.transform = `translateX(${currentX}px) skewX(${skew}deg)`;
}

// پایان درگ
function endDrag() {
  if (!isDragging) return;
  isDragging = false;

  ul.style.transition = "transform 0.3s ease"; // slide-out / بازگشت

  currentX = currentX <= leftLimit ? -window.innerWidth : 0;
  ul.style.transform = `translateX(${currentX}px) skewX(0deg)`;
  origX = currentX;
}

// event listeners
["mousedown", "touchstart"].forEach((evt) =>
  ul.addEventListener(evt, (e) => startDrag(getClientX(e)))
);
["mousemove", "touchmove"].forEach((evt) =>
  document.addEventListener(evt, (e) => doDrag(getClientX(e)))
);
["mouseup", "touchend"].forEach((evt) =>
  document.addEventListener(evt, endDrag)
);
