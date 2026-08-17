const { getCurrentWindow } = window.__TAURI__.window;
const appWindow = getCurrentWindow();

const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = './assets/topbar/styles.css';

document.head.appendChild(stylesheet);

const topBar = `
<div id="titlebar" data-tauri-drag-region="true">
    <div id="title" data-tauri-drag-region="true">Sourisfinance</div>
    <div class="titlebar-actions">
        <button class="titlebar-button" id="minimize">_</button>
        <button class="titlebar-button" id="maximize">[]</button>
        <button class="titlebar-button" id="close">X</button>
    </div>
</div>
`;

document.body.insertAdjacentHTML('afterbegin', topBar);

document.getElementById("minimize").addEventListener("click", () => appWindow.minimize());
document.getElementById("maximize").addEventListener("click", () => appWindow.toggleMaximize());
document.getElementById("close").addEventListener("click", () => appWindow.close());
