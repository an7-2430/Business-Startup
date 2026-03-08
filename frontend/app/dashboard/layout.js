import Sidebar from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';

export const metadata = {
  title: 'Dashboard — BuildPath',
  description: 'Your BuildPath roadmap dashboard.',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-dark-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
