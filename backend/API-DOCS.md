# API Documentation

## Key Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user account
- **POST** `/api/auth/login` - Login and get JWT token
- **POST** `/api/auth/forgot-password` - Request password reset email

### Categories
- **GET** `/api/categories` - List all product categories (Public)
- **POST** `/api/categories` - Create new category (Superadmin only)

### Admin - User Management
- **GET** `/api/admin/users` - List all users with pagination (Superadmin only)
- **PUT** `/api/admin/users/:id` - Update user details (Superadmin only)

### Notifications
- **GET** `/api/notifications` - Get user notifications (Authenticated)
- **PUT** `/api/notifications/read-all` - Mark all notifications as read (Authenticated)
