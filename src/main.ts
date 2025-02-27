import { setupApp } from "./app.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div id="main">
  Hello world
</div>
`;

setupApp(document.querySelector<HTMLButtonElement>("#main")!);
