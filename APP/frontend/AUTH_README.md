# Authentication System Documentation

## Overview
This document describes the authentication system implemented for Hirelytic. The system includes professional Login and Signup pages with Google and GitHub OAuth integration placeholders.

## Features

### ✨ Login Page (`/login`)
- **Email/Password Authentication**: Users can log in with email and password
- **Demo Credentials**:
  - Email: `harsh@hirelytic.com`
  - Password: `harsh@123`
- **Social Login Options**: Google and GitHub (placeholders for future OAuth integration)
- **Form Validation**: Real-time validation with error messages
- **Password Visibility Toggle**: Show/hide password functionality
- **Remember Me**: Checkbox for persistent sessions
- **Forgot Password**: Link for password recovery (placeholder)
- **Responsive Design**: Works on all screen sizes
- **Animated Background**: Beautiful gradient orbs with floating animations
- **Dark Mode Support**: Automatically adapts to system theme

### 🎨 Signup Page (`/signup`)
- **User Registration**: Create new account with name, email, and password
- **Social Signup Options**: Google and GitHub (placeholders for future OAuth integration)
- **Form Validation**:
  - Name: Minimum 2 characters
  - Email: Valid email format
  - Password: Minimum 6 characters
  - Confirm Password: Must match password
- **Password Visibility Toggle**: Show/hide password for both fields
- **Terms & Conditions**: Checkbox agreement
- **Responsive Design**: Mobile-friendly layout
- **Animated Background**: Matching design with login page

### 🎯 Navigation Integration
- **Dynamic Navbar**: Shows different content based on authentication state
  - **Not Logged In**: "Sign In" and "Get Started" buttons
  - **Logged In**: User name display and "Logout" button
- **Session Management**: Uses sessionStorage to persist user data
- **Automatic Redirect**: After login/signup, redirects to home page

## File Structure

```
APP/frontend/src/
├── pages/
│   ├── Login.js          # Login page component
│   └── Signup.js         # Signup page component
├── styles/
│   └── Auth.css          # Authentication pages styling
├── contexts/
│   └── AuthContext.js    # Authentication context (for future use)
├── components/
│   └── Navbar.js         # Updated with auth integration
└── App.js                # Updated with routing
```

## Usage

### Accessing the Pages
- **Login**: Navigate to `http://localhost:3000/login`
- **Signup**: Navigate to `http://localhost:3000/signup`
- **Home**: Navigate to `http://localhost:3000/`

### Testing Login
Use the demo credentials:
```
Email: harsh@hirelytic.com
Password: harsh@123
```

### Testing Signup
1. Fill in all required fields
2. Ensure passwords match
3. Check the terms & conditions checkbox
4. Click "Create Account"
5. You'll be automatically logged in and redirected

## Technical Details

### Authentication Flow
1. **Login/Signup**: User submits credentials
2. **Validation**: Form validates input client-side
3. **Session Storage**: User data stored in `sessionStorage`
4. **Redirect**: User redirected to home page
5. **Navbar Update**: Navbar shows user info and logout button

### Session Management
```javascript
// User data structure
{
  name: "Harsh Gupta",
  email: "harsh@hirelytic.com",
  isAuthenticated: true
}
```

### Future Backend Integration

The frontend is designed to easily integrate with a backend API. Here's how:

#### Login Integration
```javascript
// In Login.js, replace the setTimeout with:
const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
  email: formData.email,
  password: formData.password
});

if (response.data.success) {
  sessionStorage.setItem('user', JSON.stringify(response.data.user));
  sessionStorage.setItem('token', response.data.token);
  window.location.href = '/';
}
```

#### Signup Integration
```javascript
// In Signup.js, replace the setTimeout with:
const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
  name: formData.name,
  email: formData.email,
  password: formData.password
});

if (response.data.success) {
  sessionStorage.setItem('user', JSON.stringify(response.data.user));
  sessionStorage.setItem('token', response.data.token);
  window.location.href = '/';
}
```

#### OAuth Integration (Google/GitHub)
```javascript
// For Google OAuth
const handleGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/api/auth/google`;
};

// For GitHub OAuth
const handleGithubLogin = () => {
  window.location.href = `${BACKEND_URL}/api/auth/github`;
};
```

## Design Features

### Color Scheme
- **Primary Gradient**: Purple to Pink (`#667eea` to `#764ba2`)
- **Accent Colors**:
  - Success: `#10b981` (Green)
  - Error: `#ef4444` (Red)
  - Google: `#ea4335`
  - GitHub: `#333333`

### Animations
- **Floating Orbs**: Background gradient orbs with smooth floating animation
- **Slide In**: Card slides up on page load
- **Hover Effects**: Buttons and inputs have smooth hover transitions
- **Loading Spinner**: Animated spinner during form submission

### Accessibility
- **ARIA Labels**: All interactive elements have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Clear focus states for all inputs
- **Error Messages**: Screen reader friendly error announcements

## Responsive Breakpoints
- **Desktop**: > 768px (Full layout)
- **Mobile**: ≤ 768px (Stacked layout, hidden text on small buttons)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Considerations (For Backend Implementation)
1. **Password Hashing**: Use bcrypt or similar
2. **JWT Tokens**: Implement secure token-based authentication
3. **HTTPS**: Always use HTTPS in production
4. **CSRF Protection**: Implement CSRF tokens
5. **Rate Limiting**: Prevent brute force attacks
6. **Input Sanitization**: Sanitize all user inputs
7. **Session Expiry**: Implement token expiration

## Next Steps for Backend Integration
1. Set up authentication endpoints (`/api/auth/login`, `/api/auth/signup`)
2. Implement OAuth providers (Google, GitHub)
3. Add JWT token generation and validation
4. Create protected routes middleware
5. Implement password reset functionality
6. Add email verification
7. Set up refresh token mechanism

## Support
For questions or issues, please contact the development team.

---
**Version**: 1.0.0
**Last Updated**: 2025
**Author**: Hirelytic Development Team
