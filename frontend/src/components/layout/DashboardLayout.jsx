import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { RiMenuLine } from 'react-icons/ri';
import Sidebar from './Sidebar';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">

        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 h-14 flex items-center px-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]"
            aria-label="Open sidebar"
          >
            <RiMenuLine className="text-xl" />
          </button>

          <span className="ml-3 font-semibold text-[var(--color-text-primary)]">
            Muse
          </span>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;