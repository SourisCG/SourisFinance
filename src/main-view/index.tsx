import { LinkComponent } from "../components/link-component/link-component";

import styles from "./main-view.module.css";

export function MainView() {
  return (
    <div className={styles.container}>
      <h1>Welcome to the Main View</h1>
      <p>
        This is the main content area of the application. <br />
        Select whatever you need.
      </p>

      {LinkComponent("/expenses", "Expenses and Incomes", "Manage your expenses and incomes.")}

      {LinkComponent("/reports", "Reports", "View your financial reports.")}

      {LinkComponent("/configuration", "Configuration", "Manage your application settings.")}
    </div>
  );
}
