import { getCurrentWindow } from "@tauri-apps/api/window";
import styles from "./topbar.module.css";

const appWindow = getCurrentWindow();

const handleMinimizer = () => {
  appWindow.minimize();
};

const handleMaximizer = () => {
  appWindow.toggleMaximize();
};

const handleClose = () => {
  appWindow.close();
};

export function TopBar() {
  return (
    <nav className={styles.topbar} data-tauri-drag-region>
      <h6 className={styles.topbar__title} data-tauri-drag-region>
        SourisFinance
      </h6>
      <ul className={styles.topbar__nav}>
        <li className={styles.topbar__navItem} onClick={handleMinimizer}>
          -
        </li>
        <li className={styles.topbar__navItem} onClick={handleMaximizer}>
          []
        </li>
        <li className={styles.topbar__navItem} onClick={handleClose}>
          X
        </li>
      </ul>
    </nav>
  );
}
