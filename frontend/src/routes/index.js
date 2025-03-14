import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotificationDemo from '../components/NotificationDemo';
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
        element: <Home />,
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
        element: (
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        ),
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
            path: 'notification-demo',
            element: <NotificationDemo />,
          },
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
