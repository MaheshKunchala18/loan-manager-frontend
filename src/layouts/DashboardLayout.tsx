import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';

const DashboardLayout: React.FC = () => {
  const { user, logout, isAdmin, isVerifier } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['user', 'verifier', 'admin'] },
    { name: 'Borrowers', href: '/borrowers', icon: Users, roles: ['verifier', 'admin'] },
    { name: 'Loans', href: '/loans', icon: FileText, roles: ['user', 'verifier', 'admin'] },
    { name: 'Repayments', href: '/repayments', icon: DollarSign, roles: ['verifier', 'admin'] },
    { name: 'Loan Parameters', href: '/loan-parameters', icon: Settings, roles: ['admin'] },
    { name: 'Accounting', href: '/accounting', icon: FileText, roles: ['admin'] },
    { name: 'Reports', href: '/reports', icon: FileText, roles: ['verifier', 'admin'] },
    { name: 'Collateral', href: '/collateral', icon: Settings, roles: ['admin'] },
    { name: 'Access Configuration', href: '/access-config', icon: Settings, roles: ['admin'] },
    { name: 'Savings', href: '/savings', icon: DollarSign, roles: ['admin'] },
    { name: 'Other Incomes', href: '/other-incomes', icon: DollarSign, roles: ['admin'] },
    { name: 'Payroll', href: '/payroll', icon: Users, roles: ['admin'] },
    { name: 'Expenses', href: '/expenses', icon: DollarSign, roles: ['admin'] },
    { name: 'E-signature', href: '/e-signature', icon: FileText, roles: ['admin'] },
    { name: 'Investor Accounts', href: '/investor-accounts', icon: Users, roles: ['admin'] },
    { name: 'Calendar', href: '/calendar', icon: Settings, roles: ['verifier', 'admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['user', 'verifier', 'admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'user')
  );

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold">CREDIT APP</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1 overflow-y-auto h-full pb-20">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(item.href)
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout button at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full text-primary-100 hover:bg-primary-700 hover:text-white justify-start"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4 ml-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">🏠</span>
                <span className="text-primary-600">Home</span>
                <span className="text-gray-500">💰</span>
                <span className="text-primary-600">Payments</span>
                <span className="text-gray-500">📊</span>
                <span className="text-primary-600">Budget</span>
                <span className="text-gray-500">💳</span>
                <span className="text-primary-600">Card</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.firstName?.charAt(0)}
                </div>
                <span className="hidden md:block">{user?.role === 'admin' ? 'Admin' : user?.role}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout; 