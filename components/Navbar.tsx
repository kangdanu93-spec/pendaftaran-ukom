import React from 'react';
import { ViewState } from '../types';
import { Layout, Users, FileText, SearchCheck, List, Briefcase, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout?: () => void; // Optional to handle "Exit" action
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout }) => {
  const navItems = [
    { view: ViewState.HOME, label: 'Beranda', icon: <Layout className="w-5 h-5" /> },
    { view: ViewState.WORKFLOW, label: 'Alur & Jobdesk', icon: <Briefcase className="w-5 h-5" /> },
    { view: ViewState.FORM, label: 'Daftar', icon: <FileText className="w-5 h-5" /> },
    { view: ViewState.PUBLIC_LIST, label: 'Lihat Kelompok', icon: <List className="w-5 h-5" /> },
    { view: ViewState.CHECK_STATUS, label: 'Cek Nilai', icon: <SearchCheck className="w-5 h-5" /> },
    // Admin list is conditional, usually we can keep it here, but if "Gatekeeper" handles admin login, 
    // user might want to click this to go to admin view if they are already logged in.
    { view: ViewState.LIST, label: 'Admin', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="flex-shrink-0 flex items-center gap-2 text-emerald-600 font-bold text-xl cursor-pointer" onClick={() => setView(ViewState.HOME)}>
              <Users className="w-8 h-8" />
              EduSMKMA
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`${
                  currentView === item.view
                    ? 'border-emerald-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}

            {/* EXIT / LOGOUT BUTTON */}
            {onLogout && (
                 <button
                    onClick={onLogout}
                    className="ml-4 flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                    title="Keluar Aplikasi"
                 >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                 </button>
            )}
          </div>

          {/* Mobile Menu Button (Simple implementation) */}
          <div className="flex items-center sm:hidden gap-2">
             {onLogout && (
                 <button onClick={onLogout} className="p-2 text-red-600 bg-red-50 rounded-lg">
                    <LogOut className="w-5 h-5" />
                 </button>
             )}
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Bar for basic nav */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-50 overflow-x-auto">
         {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex flex-col items-center flex-shrink-0 px-2 ${
                  currentView === item.view ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1 text-center leading-tight max-w-[60px] whitespace-nowrap">{item.label}</span>
              </button>
            ))}
      </div>
    </nav>
  );
};

export default Navbar;