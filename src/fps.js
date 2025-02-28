export function mountFPSMonitor() {
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 0;

  function updateFPS() {
    const now = performance.now();
    frameCount++;
    if (now - lastTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = now;
      document.getElementById("fps").innerText = `FPS: ${fps}`;
    }
    requestAnimationFrame(updateFPS);
  }

  requestAnimationFrame(updateFPS);
}
