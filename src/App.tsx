import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TransactionsBySchool from "./pages/TransactionsBySchool";
import TransactionStatus from "./pages/TransactionStatus";
import CreatePayment from "./pages/CreatePayment";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="transactions/school/:schoolId"
                element={<TransactionsBySchool />}
              />
              <Route
                path="transaction-status"
                element={<TransactionStatus />}
              />
              <Route path="create-payment" element={<CreatePayment />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
