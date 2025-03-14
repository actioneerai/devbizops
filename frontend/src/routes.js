import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import AIAgents from './pages/AIAgents';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

// Helper component to access auth context in routes
const RouteElement = ({ children }) => {
  const auth = useAuth();
  return children(auth);
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <RouteElement>
            {({ isAuthenticated }) => (
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Home />
              )
            )}
          </RouteElement>
        )
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        element: <ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'settings',
            element: <Settings />
          },
          {
            path: 'ai-agents',
            element: <AIAgents />
          }
        ]
      }
    ]
  }
]);

export default router;
