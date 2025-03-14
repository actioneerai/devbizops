# DevBizOps Notification System

## Environment Setup

The notification system and other features in DevBizOps rely on Supabase for authentication and data storage. To set up your environment:

1. Copy the `.env.example` file to `.env` in the frontend directory
2. Replace the placeholder values with your actual Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

> **Note:** The application includes a mock Supabase client for development purposes when environment variables are not properly configured. This allows you to test the UI without a Supabase backend, but functionality will be limited.

## Overview

The notification system in DevBizOps provides a standardized way to display feedback to users across the application. It supports different types of notifications (success, error, warning, info) with consistent styling and behavior.

## Features

- **Multiple notification types**: Success, error, warning, and info notifications with appropriate styling
- **Auto-dismissal**: Notifications automatically dismiss after a configurable duration
- **Smooth animations**: CSS transitions for a polished user experience
- **Stacked notifications**: Multiple notifications can be displayed simultaneously
- **Global access**: Available throughout the application via the NotificationContext

## Implementation

### Components and Files

1. **NotificationContext.js**: Context provider for managing notifications
2. **Notification.js**: Component for rendering individual notifications
3. **index.css**: CSS styles for notification animations

### Usage

#### Basic Usage

```jsx
import { useNotification } from '../contexts/NotificationContext';

const MyComponent = () => {
  const { success, error, info, warning } = useNotification();
  
  const handleAction = () => {
    try {
      // Perform some action
      success('Operation completed successfully!');
    } catch (err) {
      error('An error occurred: ' + err.message);
    }
  };
  
  return (
    <button onClick={handleAction}>Perform Action</button>
  );
};
```

#### Notification Types

```jsx
// Success notification (green)
success('Operation completed successfully!');

// Error notification (red)
error('An error occurred while processing your request.');

// Info notification (blue)
info('This is an informational message.');

// Warning notification (yellow)
warning('Please be careful with this action.');
```

#### Custom Duration

You can specify a custom duration (in milliseconds) for how long the notification should display:

```jsx
// Display for 10 seconds (default is 5 seconds)
success('Operation completed successfully!', 10000);

// Display until manually dismissed
error('Critical error occurred.', 0); // 0 means no auto-dismiss
```

## Integration with Auth System

The notification system is integrated with the authentication system to provide feedback for login, registration, and other auth-related actions:

```jsx
// Example from AuthContext.js
const login = async (email, password) => {
  try {
    const { data, error } = await authService.login(email, password);
    
    if (error) {
      showError(error.message || 'Login failed');
      return { error };
    }
    
    if (data?.user) {
      setUser(data.user);
      success('Login successful');
      return { success: true };
    }
  } catch (err) {
    showError('An unexpected error occurred');
  }
};
```

## Demo

A demonstration component is available at `/notification-demo` that showcases all notification types and behaviors.

## Best Practices

1. **Use appropriate notification types**:
   - Success: For successful operations
   - Error: For failed operations or errors
   - Warning: For potential issues or cautions
   - Info: For general information

2. **Keep messages concise**: Notifications should be brief and to the point.

3. **Include actionable information**: When showing an error, provide information on how to resolve it if possible.

4. **Set appropriate durations**: Critical errors might need longer durations or manual dismissal.

5. **Use consistently**: Implement notifications for all similar actions across the application for consistency.

## Extending the System

The notification system can be extended with additional features:

- Action buttons within notifications
- Grouping similar notifications
- Persistent notifications (saved between sessions)
- Custom notification types
