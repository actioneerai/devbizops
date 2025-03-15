import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import AIAgents from '../pages/AIAgents';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthenticatedLayout from '../components/AuthenticatedLayout';

// Define routes with authentication protection
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      // Protected routes with authenticated layout
      {
        path: '/',
        element: <ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'ai-agents',
            element: <AIAgents />,
          }
        ],
      },
      // Fallback route
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;