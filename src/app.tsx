import { TopBar } from "./topbar";
import { MainView } from "./main-view";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ExpensesView } from "./expenses";
import { ConfigurationView } from "./configuration";
import { ReportsView } from "./reports";

const Layout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <TopBar />
      <main style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainView />} />
          <Route path="expenses" element={<ExpensesView />} />
          <Route path="reports" element={<ReportsView />} />
          <Route path="configuration" element={<ConfigurationView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
