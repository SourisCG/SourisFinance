import styles from "./report-box-component.module.css";

export function ReportBoxComponent() {
  return (
    <div id="report-box" className={styles.reportBox}>
      <h2>Reports</h2>
      <div id="report-table" className={styles.reportTable}>
        <p>No reports available.</p>
      </div>
    </div>
  );
}
