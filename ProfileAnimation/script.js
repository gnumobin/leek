const blob = document.getElementById("blob-path");

const shape1 =
  "M100,20 C150,20 180,60 180,100 C180,150 150,180 100,180 C50,180 20,150 20,100 C20,60 50,20 100,20 Z";
const shape2 =
  "M100,30 C170,40 190,120 140,160 C100,200 40,190 30,120 C20,60 50,20 100,30 Z";

function animate(toShape) {
  const interpolator = flubber.interpolate(blob.getAttribute("d"), toShape, {
    maxSegmentLength: 2,
  });

  let t = 0;
  const duration = 600;
  const start = performance.now();

  function frame(now) {
    t = (now - start) / duration;
    if (t > 1) t = 1;

    blob.setAttribute("d", interpolator(t));

    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const box = document.querySelector(".box");

box.addEventListener("mouseenter", () => animate(shape2));
box.addEventListener("mouseleave", () => animate(shape1));
