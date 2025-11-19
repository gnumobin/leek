const ul = document.querySelector("ul");
const handle = document.querySelector(".handle");

let dragging = false,
  startX = 0,
  curX = 0,
  origX = 0,
  width = ul.offsetWidth,
  raf = null;

origX = curX = -width;
ul.style.transform = `translateX(${origX}px)`;

const pos = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

const apply = () => {
  ul.style.transform = `translateX(${curX}px)`;
  raf = null;
};

const start = (x) => {
  dragging = true;
  startX = x;
  width = ul.offsetWidth;
  ul.style.transition = "none";
};

const move = (x) => {
  if (!dragging) return;
  curX = Math.min(0, origX + (x - startX));
  if (!raf) raf = requestAnimationFrame(apply);
};

const end = () => {
  if (!dragging) return;
  dragging = false;

  ul.style.transition = "transform .33s cubic-bezier(.25,1,.5,1)";
  curX = curX > -width / 3 ? 0 : -width;
  ul.style.transform = `translateX(${curX}px)`;
  origX = curX;
};

["mousedown", "touchstart"].forEach((ev) => {
  handle.addEventListener(ev, (e) => start(pos(e)));
  ul.addEventListener(ev, (e) => start(pos(e)));
});

["mousemove", "touchmove"].forEach((ev) => {
  document.addEventListener(ev, (e) => move(pos(e)));
});

["mouseup", "touchend"].forEach((ev) => {
  document.addEventListener(ev, end);
});
