# Frontend Setup Instructions

## Environment Configuration

Create a `.env.local` file in the frontend directory with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="UIP Africa ERP"

# Development
NEXT_PUBLIC_DEBUG=true
```

## Backend Integration

### 1. Start the Backend Server

In a separate terminal, navigate to the backend directory and start the server:

```bash
cd ../backend
npm run dev
```

The backend should be running on `http://localhost:5000`

### 2. Seed the Database (if needed)

If you haven't already seeded the database with test users:

```bash
cd ../backend
npm run seed
```

### 3. Test Credentials

Use these credentials to test the login functionality:

- **Employee:** `employee@uip.test` / `secret123`
- **Approver:** `supervisor@uip.test` / `secret123`
- **Admin:** `admin@uip.test` / `secret123`
- **CEO:** `ceo@uip.test` / `secret123`
- **IT Manager:** `manager@uip.test` / `secret123`
- **IT Staff:** `itstaff@uip.test` / `secret123`

## Frontend Development

Start the frontend development server:

```bash
npm run dev
```

Visit: `http://localhost:3000`

## API Endpoints

The frontend will make requests to these backend endpoints:

- **Login:** `POST /api/auth/login`
- **Refresh Token:** `POST /api/auth/refresh`
- **Register:** `POST /api/auth/register`

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure the backend is configured with:

```javascript
app.use(cors({ origin: true, credentials: true }));
```

### Connection Refused

- Make sure the backend is running on port 5000
- Check that the `NEXT_PUBLIC_API_URL` environment variable is correct
- Verify the backend health endpoint: `http://localhost:5000/health`

### Authentication Issues

- Check browser developer tools for network requests
- Verify JWT tokens are being stored in localStorage and cookies
- Check backend logs for authentication errors

## Features Implemented

✅ **Real API Integration:**

- Login with actual backend authentication
- JWT token handling (access + refresh)
- Cookie-based middleware authentication
- Proper error handling and user feedback

✅ **Role-Based Access:**

- Employee, Approver, and Admin roles
- Role-based sidebar navigation
- Role-specific dashboard views

✅ **Security:**

- Protected routes with middleware
- Automatic token refresh
- Secure logout with token cleanup
