import React from 'react';
import { ViewState } from '../types';
import { Layout, Users, FileText, HelpCircle } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: ViewState.HOME, label: 'Beranda', icon: <Layout className="w-5 h-5" /> },
    { view: ViewState.FORM, label: 'Daftar Sekarang', icon: <FileText className="w-5 h-5" /> },
    { view: ViewState.LIST, label: 'Data Peserta', icon: <Users className="w-5 h-5" /> },
    { view: ViewState.GUIDE, label: 'Cara Hosting Gratis', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
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
          </div>

          {/* Mobile Menu Button (Simple implementation) */}
          <div className="flex items-center sm:hidden">
             <div className="text-xs text-gray-500">Menu tersedia di Desktop</div>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Bar for basic nav */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-50">
         {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex flex-col items-center ${
                  currentView === item.view ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1">{item.label}</span>
              </button>
            ))}
      </div>
    </nav>
  );
};

export default Navbar;