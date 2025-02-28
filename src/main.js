import { mountFPSMonitor } from "./fps";

document.querySelector("#app").innerHTML = `
<div id="main" class="flex flex-col items-center p-4 gap-4">
  <p class="text-center">
    When you press the first button, a Web Worker starts processing a large set
    of random numbers while still allowing the alert box to appear instantly.
    This demonstrates that the main thread remains unblocked. However, if you
    run the same calculation without the worker and try to trigger the alert,
    the browser will freeze, showing the impact of blocking the main thread.
  </p>
  <div id="fps" class="text-center text-white">fps: 0</div>
  <button
    id="button"
    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Run Worker
  </button>
  <button
    id="buttonNoWorker"
    class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
  >
    Run Without Worker
  </button>
  <button
    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    onclick="window.alert('Alert')"
  >
    Alert
  </button>
  <div id="result" class="mt-2 text-white">Worker result: 0</div>
</div>
`;

let worker;

window.addEventListener("DOMContentLoaded", () => {
  mountFPSMonitor();

  if (!window.Worker) {
    console.warn("Web Workers are not supported in this browser.");
    return;
  }
  worker = new Worker("src/worker.js");

  worker.onmessage = (event) => {
    const message = event.data;
    const { commonNumber, occurs } = message.data;

    if (message.type === "result") {
      const output = document.getElementById("result");
      if (output) {
        output.innerText = `Worker result: ${commonNumber} (${occurs} times)`;
      }
    } else if (message.type === "error") {
      console.error("Worker internal error: ", message.message);
    }
  };

  worker.onerror = (error) => {
    console.error("Worker error: ", error);
  };

  const button = document.getElementById("button");
  if (button) {
    button.addEventListener("click", process);
  }
  document
    .getElementById("buttonNoWorker")
    .addEventListener("click", processWithoutWorker);
});

window.addEventListener("beforeUnload", terminate);

function process() {
  if (worker) {
    worker.postMessage({ type: "calculate", count: 20000000, range: 500 });
  }
}

function terminate() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

async function processWithoutWorker() {
  const result = await heavyComputation(20000000, 500);
  document.getElementById("result").innerText =
    `No Worker result: ${result.commonNumber} (${result.occurs} times)`;
}

async function heavyComputation(count, range) {
  const _ = (
    await import("https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js")
  ).default;

  let numbers = _.times(count, () => _.random(1, range));
  let [commonNumber, occurs] = _.chain(numbers)
    .countBy()
    .toPairs()
    .maxBy(1)
    .value();

  return { commonNumber, occurs };
}
