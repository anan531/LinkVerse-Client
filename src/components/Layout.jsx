import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="page-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;