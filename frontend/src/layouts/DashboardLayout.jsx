import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import PageIntelligencePanel from '../components/page-intelligence/PageIntelligencePanel';
import './DashboardLayout.css';

export default function DashboardLayout() {
  return (
    <div className="pp-dashboard-layout">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Workspace Area */}
      <main className="pp-dashboard-main pp-scroll">
        <Outlet />
      </main>

      {/* Right Page Intelligence Panel */}
      <PageIntelligencePanel />
    </div>
  );
}
