import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AttendanceView } from './components/AttendanceView';
import { LeaveManagementView } from './components/LeaveManagementView';
import { PayrollView } from './components/PayrollView';
import { WellbeingView } from './components/WellbeingView';
import { AIAssistantView } from './components/AIAssistantView';
import { EmployeeManagementView } from './components/EmployeeManagementView';
import { ReportsView } from './components/ReportsView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { ProjectExportModal } from './components/ProjectExportModal';
import { store } from './services/store';
import { User } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => store.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [projectExportModalOpen, setProjectExportModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync state if currentUser changes
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    store.logout();
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const handleSwitchRole = (newRole: 'admin' | 'employee') => {
    const updated = store.switchRole(newRole);
    setCurrentUser(updated);
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // If user is null and not explicitly on landing, show landing
  const isLanding = !currentUser || activeTab === 'landing';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => openAuth('login')}
        onOpenSignup={() => openAuth('signup')}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onOpenExportCode={() => setProjectExportModalOpen(true)}
      />

      {/* Main Container */}
      {isLanding ? (
        <main className="flex-1">
          <LandingPage
            onGetStarted={() => {
              if (currentUser) {
                setActiveTab('dashboard');
              } else {
                openAuth('login');
              }
            }}
            onExploreDemo={(role) => {
              handleSwitchRole(role);
              setActiveTab('dashboard');
            }}
            onOpenSourceCode={() => setProjectExportModalOpen(true)}
          />
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          {/* Dynamic Content Canvas */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
            {activeTab === 'dashboard' && currentUser.role === 'employee' && (
              <EmployeeDashboard currentUser={currentUser} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'dashboard' && currentUser.role === 'admin' && (
              <AdminDashboard
                setActiveTab={setActiveTab}
                onOpenAddEmployee={() => setActiveTab('employees')}
                onOpenZipModal={() => setProjectExportModalOpen(true)}
              />
            )}

            {activeTab === 'attendance' && <AttendanceView currentUser={currentUser} />}

            {activeTab === 'leave' && <LeaveManagementView currentUser={currentUser} />}

            {activeTab === 'payroll' && <PayrollView currentUser={currentUser} />}

            {activeTab === 'wellbeing' && <WellbeingView currentUser={currentUser} />}

            {activeTab === 'ai-assistant' && <AIAssistantView currentUser={currentUser} />}

            {activeTab === 'employees' && currentUser.role === 'admin' && <EmployeeManagementView />}

            {activeTab === 'reports' && <ReportsView />}

            {activeTab === 'profile' && (
              <ProfileView currentUser={currentUser} onUpdateUser={(u) => setCurrentUser(u)} />
            )}
          </main>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Project Export / Source Code Modal */}
      <ProjectExportModal
        isOpen={projectExportModalOpen}
        onClose={() => setProjectExportModalOpen(false)}
      />
    </div>
  );
}
