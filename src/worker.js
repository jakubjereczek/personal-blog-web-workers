onmessage = function (event) {
  try {
    if (event.data.type === "calculate") {
      // The importScripts allows to import scripts in the context of Web Worker.
      importScripts(
        "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js",
      );

      let numbers = _.times(event.data.count, () =>
        _.random(1, event.data.range),
      );
      let [commonNumber, occurs] = _.chain(numbers)
        .countBy()
        .toPairs()
        .maxBy(1)
        .value();

      postMessage({
        type: "result",
        data: {
          commonNumber,
          occurs,
        },
      });
    } else {
      throw new Error("Unknown message type");
    }
  } catch (error) {
    postMessage({ type: "error", message: error.message });
  }
};
