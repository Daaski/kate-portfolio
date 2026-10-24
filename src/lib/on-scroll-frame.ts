// update — не чаще раза за кадр: события scroll приходят чаще, чем экран перерисовывается.
export function onScrollFrame(update: () => void) {
  let frame = 0;
  const run = () => {
    frame = 0;
    update();
  };
  const schedule = () => {
    if (!frame) {
      frame = requestAnimationFrame(run);
    }
  };

  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}
