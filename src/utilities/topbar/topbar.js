const { getCurrentWindow } = window.__TAURI__.window;
const appWindow = getCurrentWindow();

const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = '../utilities/topbar/styles.css';

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

const content = document.createElement('div');
content.id = 'app-content';
while (document.body.firstChild) {
    content.appendChild(document.body.firstChild);
}
document.body.appendChild(content);

document.getElementById("minimize").addEventListener("click", () => appWindow.minimize());
document.getElementById("maximize").addEventListener("click", () => appWindow.toggleMaximize());
document.getElementById("close").addEventListener("click", () => appWindow.close());

const RESIZE_HANDLES = [
    { dir: 'North',      cursor: 'ns-resize',    css: 'top:0; left:0; width:100%; height:4px;' },
    { dir: 'South',      cursor: 'ns-resize',    css: 'bottom:0; left:0; width:100%; height:4px;' },
    { dir: 'East',       cursor: 'ew-resize',    css: 'top:0; right:0; width:4px; height:100%;' },
    { dir: 'West',       cursor: 'ew-resize',    css: 'top:0; left:0; width:4px; height:100%;' },
    { dir: 'NorthEast',  cursor: 'nesw-resize',  css: 'top:0; right:0; width:10px; height:10px;' },
    { dir: 'NorthWest',  cursor: 'nwse-resize',  css: 'top:0; left:0; width:10px; height:10px;' },
    { dir: 'SouthEast',  cursor: 'nwse-resize',  css: 'bottom:0; right:0; width:10px; height:10px;' },
    { dir: 'SouthWest',  cursor: 'nesw-resize',  css: 'bottom:0; left:0; width:10px; height:10px;' },
];

const handleWrappers = document.querySelectorAll('[data-tauri-drag-region]');
let handleParent = document.body;

RESIZE_HANDLES.forEach(({ dir, cursor, css }) => {
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    handle.dataset.dir = dir;
    handle.style.cssText = `position: fixed; z-index: 99999; cursor: ${cursor}; ${css}`;
    handle.addEventListener('mousedown', () => appWindow.startResizeDragging(dir));
    handleParent.appendChild(handle);
});
