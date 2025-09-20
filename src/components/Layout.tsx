import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  Home,
  CreditCard,
  Search,
  Plus,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

function Layout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Create Payment", href: "/create-payment", icon: Plus },
    { name: "Transaction Status", href: "/transaction-status", icon: Search },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {/* ADDED: transition-colors and duration-300 for smooth theme switching */}
      {/* CHANGED: Refined dark theme sidebar color to dark:bg-gray-900 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300">
        <div className="flex flex-col h-full">
          {/* Logo */}
          {/* CHANGED: Refined border color for dark mode */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
              School Pay
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    // CHANGED: Refined active and hover states for better contrast and feel
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          {/* CHANGED: Refined border color for dark mode */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.email[0].toUpperCase()}
                  </span>
                </div>
                {/* CHANGED: Refined text colors for better readability */}
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      {/* CHANGED: Made background theme-aware (light for light, dark for dark) */}
      {/* ADDED: transition-colors and duration-300 for smooth theme switching */}
      <div className="flex-1 ml-64 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
