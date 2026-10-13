import { LinkComponent } from "../components/link-component/link-component";
import { ReportBoxComponent } from "../components/report-box/report-box-component";

export function ExpensesView() {
  return (
    <>
      {ReportBoxComponent()}
      {LinkComponent("/", "Main View", "Return to the main view of the application.")}
    </>
  );
}
