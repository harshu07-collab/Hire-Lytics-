# Hire-Lytics – AI-Powered Resume Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React 18">
  <img src="https://img.shields.io/badge/FastAPI-Python-green?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/Three.js-3D-orange?logo=javascript" alt="Three.js">
  <img src="https://img.shields.io/badge/License-MIT-brightgreen" alt="License MIT">
</p>

Hire-Lytics is a cutting-edge AI-powered resume analysis platform that transforms how professionals optimize their careers. Built with modern web technologies, it delivers instant ATS scoring, intelligent content rewriting, and comprehensive resume enhancement tools.

## 🎉 What's New (Latest Updates)

### ✨ **Real Authentication System** (March 2026)
- 🔐 **Email OTP Authentication** - Secure 6-digit code verification
- 🌐 **Google OAuth 2.0** - One-click social login
- 💾 **Database Integration** - Supabase PostgreSQL ready
- 📧 **Real Email Service** - Resend + SMTP support
- 🔑 **JWT Token Management** - Secure sessions with auto-refresh
- ⚡ **Works Immediately** - No configuration needed (console OTP mode)

### 📊 **Enhanced Resume Analysis Dashboard** (March 2026)
- 🎨 **Professional Loading Animation** - Beautiful 4-step progress indicator
- 🎯 **Comprehensive Scoring UI** - Circular score display (0-100) with animations
- 📁 **Category Breakdown** - Content, Sections, ATS, Tailoring scores
- 💳 **Expandable Issue Cards** - Detailed feedback with action buttons
- 👁️ **Resume Preview Panel** - Side-by-side comparison view
- ✨ **Smooth Animations** - Professional 60fps transitions throughout

### 🛠️ **Developer Experience**
- 🚀 **Startup Script** - `.start-dev.ps1` for easy launching
- ✅ **Verification Tools** - `verify-auth-setup.py` to check setup
- 🔄 **Easy Rollback** - `rollback-auth.bat` to revert changes
- 📚 **Complete Documentation** - 9 comprehensive guides

## 🚀 Key Features

### 🎯 **Core Functionality**
- **AI-Powered Analysis**: Advanced algorithms analyze resume effectiveness and compatibility
- **ATS Scoring System**: Real-time Applicant Tracking System compatibility assessment
- **Smart Rewriting**: AI-driven content optimization and enhancement suggestions
- **Interactive 3D Visualization**: Immersive data representation (when enabled)
- **Performance Metrics**: Detailed scoring across 16 critical resume factors

### 📊 **Resume Analysis Dashboard** (NEW!)
- **Professional Loading Animation** - Beautiful 4-step analysis progress indicator
- **Comprehensive Scoring** - Circular score display with animated progress ring (0-100)
- **Category Breakdown** - Content, Sections, ATS Essentials, Tailoring scores
- **Expandable Issue Cards** - Detailed feedback with color-coded severity
- **Resume Preview Panel** - Side-by-side comparison view
- **Action Buttons** - "Fix This Issue" and "Learn More" for each item
- **Smooth Animations** - Professional 60fps transitions throughout

### 🛠️ **Technical Excellence**
- **90+ FPS Performance**: Smooth, responsive user experience
- **Dark/Light Mode**: Adaptive UI with neon aesthetic options
- **Real-time Processing**: Instant feedback without page reloads
- **Cross-platform Compatibility**: Works seamlessly across devices
- **Secure Authentication**: Robust user account management

## 🏗️ Architecture Overview

```
Hire-Lytics/
├── APP/
│   ├── frontend/           # React 18 + Three.js + Tailwind CSS
│   │   ├── src/
│   │   │   ├── components/ # Modular UI components
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   └── contexts/   # State management
│   │   └── public/         # Static assets
│   └── backend/            # FastAPI + Python
│       ├── server.py       # Main API server
│       └── requirements.txt # Python dependencies
├── package.json            # Root configuration and scripts
└── README.md              # Project documentation
```

## 📋 Prerequisites

### **Development Environment**
- **Node.js**: v18.0 or higher ([Download](https://nodejs.org/))
- **Python**: 3.9 or higher ([Download](https://www.python.org/))
- **Git**: Latest version ([Download](https://git-scm.com/))

### **Optional Components**
- **MongoDB**: 4.4+ for persistent data storage ([Download](https://www.mongodb.com/))
- **WebGL Compatible Browser**: For 3D features (Chrome 90+, Firefox 88+, Safari 15+)

## ⚡ Quick Start Guide

### **1. Initial Setup**
```bash
# Clone the repository
git clone https://github.com/yourusername/hire-lytics.git
cd hire-lytics

# Install all dependencies
npm run install:all
```

### **2. Running the Application**

**Option A: Using Startup Script (Recommended)**
```powershell
# Windows PowerShell
.\start-dev.ps1
```

**Option B: Manual Start**
```bash
# Terminal 1: Backend
cd APP/backend && python server.py
# Server available at: http://localhost:8000

# Terminal 2: Frontend
cd APP/frontend && npm start
# Application available at: http://localhost:3000
```

### **3. Production Deployment**
```bash
# Build for production
npm run build

# Serve production build
npm run serve
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install frontend and backend dependencies |
| `npm run dev:frontend` | Start React development server |
| `npm run dev:backend` | Start FastAPI development server |
| `npm run build` | Create production builds |
| `npm run test` | Run automated tests |
| `npm run lint` | Check code quality |

## 🎨 UI/UX Features

### **Modern Design System**
- **Neon Dark Theme**: Sleek dark mode with vibrant accents
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Framer Motion powered transitions
- **Accessibility Ready**: WCAG 2.1 compliant components

### **Professional Typography** (NEW!)
- **Headings**: Work Sans font (700-800 weight)
- **Body Text**: Inter font (400-600 weight)
- **Color Scheme**: Professional palette with indigo, purple, success/warning/error indicators

### **Animation System** (NEW!)
- **Loading Animations**: Gradient backgrounds with rotating elements
- **Progress Indicators**: Animated circular score rings
- **Shimmer Effects**: Loading placeholders with smooth animations
- **Expand/Collapse**: Smooth transitions for issue cards
- **Performance**: Optimized 60fps animations throughout

### **Interactive Components**
- **Resume Analyzer**: Real-time scoring and suggestions
- **AI Rewriter**: Intelligent content enhancement
- **Optimization Dashboard**: Comprehensive metrics visualization
- **3D Data Core**: (Optional) Advanced data visualization

## 🔐 Security & Authentication

### **Real Authentication System** (NEW!)
- **Email OTP Authentication** - 6-digit codes sent via email
- **Google OAuth 2.0** - Social login integration
- **JWT Token Management** - Secure session with auto-refresh
- **User Profile Persistence** - Persistent account data
- **Real-time Email Service** - Transactional emails (Resend/SMTP)
- **Database Integration Ready** - Supabase PostgreSQL support

### **Authentication Features**
✅ **Works Immediately** - No configuration needed (OTP in console)  
✅ **Email Signup/Login** - OTP-based authentication  
✅ **Google Sign-in** - One-click social login (optional)  
✅ **Session Persistence** - Auto-login on page refresh  
✅ **Secure Logout** - Token cleanup  
✅ **Token Refresh** - 7-day refresh token validity  

### **Quick Start (5 Minutes)**
```bash
# Install dependencies
cd APP/backend && pip install -r requirements.txt
cd ../frontend && npm install

# Create config
cp APP/.env.example APP/.env

# Start backend (Terminal 1)
cd APP/backend && python server.py

# Start frontend (Terminal 2)
cd APP/frontend && npm start

# Test at http://localhost:3000/signup
```

### **Security Features**
- JWT tokens with 15-minute expiry
- Bcrypt password hashing
- OTP 5-minute expiration
- Rate limiting (5 attempts)
- CORS validation
- Input sanitization
- Secure token storage

### **Optional Enhancements** (Each Takes 3-5 Minutes)
- **Google OAuth** - Add Client ID to `.env`
- **Real Emails** - Add Resend API key to `.env`
- **Database** - Setup Supabase and add keys to `.env`

### **Rollback Capability**
```bash
# Revert to dummy auth anytime
rollback-auth.bat  # Windows CMD
.\rollback-auth.ps1  # PowerShell
```

### **Verify Setup**
```bash
python verify-auth-setup.py
```

📚 **Full Documentation**: See `MASTER_GUIDE_AUTH.md` for complete setup guide

## 📊 API Endpoints

### **Authentication** (NEW!)
```
POST /api/auth/signup/send-otp    # Send signup OTP to email
POST /api/auth/signup/verify-otp  # Verify OTP & create account
POST /api/auth/login/send-otp     # Send login OTP to email
POST /api/auth/login/verify-otp   # Authenticate with OTP
POST /api/auth/google             # Google OAuth callback
POST /api/auth/refresh-token      # Refresh access token
GET  /api/auth/me                 # Get current user info
POST /api/auth/logout             # Clear session & logout
```

### **Traditional Authentication**
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User authentication
POST /api/auth/logout      # Session termination
```

### **Resume Services**
```
POST /api/resume/analyze   # Resume analysis and scoring
POST /api/resume/optimize  # AI-powered content rewriting
GET  /api/resume/history   # Previous analysis history
```

### **User Data**
```
GET  /api/user/profile     # User profile information
PUT  /api/user/settings    # Account preferences
DELETE /api/user/account   # Account deletion
```

## 🛠️ Development Guidelines

### **Technology Stack**

**Frontend:**
- React 18 - UI framework
- Framer Motion - Animations (60fps)
- Tailwind CSS - Styling
- React Router DOM - Navigation
- Axios - API calls
- Google OAuth Library - Social login

**Backend:**
- FastAPI - Modern Python web framework
- Python 3.9+ - Programming language
- PyJWT - JWT token management
- Bcrypt - Password hashing
- Supabase - PostgreSQL database
- Resend - Email service
- Groq AI - Resume analysis
- pdfplumber - PDF parsing

**Infrastructure:**
- PostgreSQL - User database
- Redis - OTP storage (optional)
- SMTP - Email fallback

### **Code Standards**
- **Frontend**: React Hooks, ES6+, TypeScript ready
- **Backend**: FastAPI, Pydantic validation, async/await
- **Styling**: Tailwind CSS with custom design tokens
- **Testing**: Jest for frontend, pytest for backend

### **Branch Strategy**
- `main`: Production-ready code
- `develop`: Active development branch
- `feature/*`: Individual feature branches
- `hotfix/*`: Critical bug fixes

### **Commit Convention**
```
feat: Add new feature
fix: Bug fixes
docs: Documentation changes
style: Code formatting
refactor: Code restructuring
test: Adding tests
chore: Maintenance tasks
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Contribution Guidelines**
- Follow the existing code style
- Write comprehensive tests
- Update documentation when needed
- Ensure all tests pass before submitting

## 🧪 Testing

### **Manual Testing Checklist**

**Resume Analysis:**
- [ ] Upload resume from home page
- [ ] Verify loading animation plays (4 steps)
- [ ] Check results display after loading
- [ ] Test category tab switching
- [ ] Expand/collapse issue cards
- [ ] Verify responsive design on mobile
- [ ] Test dark mode toggle

**Authentication:**
- [ ] Signup with email (check console for OTP)
- [ ] Login with email (check console for OTP)
- [ ] Verify session persistence after refresh
- [ ] Test logout functionality
- [ ] Check token in localStorage (F12 → Application)
- [ ] Optional: Test Google OAuth (if configured)

### **Automated Testing**
```bash
# Run test suite
npm run test

# Verify authentication setup
python verify-auth-setup.py
```

### **Browser Compatibility**
- Chrome ✓
- Firefox ✓
- Safari ✓
- Edge ✓

### **Common Issues**

**Frontend Won't Start:**
```bash
# Clear node_modules and reinstall
rm -rf APP/frontend/node_modules
npm run install:all
```

**Backend Connection Failed:**
```bash
# Check if Python dependencies are installed
cd APP/backend
pip install -r requirements.txt
```

**Port Already in Use:**
```bash
# Kill processes on ports 3000 and 8000
# Windows:
taskkill /f /im node.exe
# Mac/Linux:
sudo lsof -ti:3000,8000 | xargs kill -9
```

### **Debugging Tools**
- **Frontend**: React DevTools, Chrome DevTools
- **Backend**: FastAPI debug mode, logging configuration
- **Database**: MongoDB Compass for data inspection

## 📈 Performance Monitoring

### **Key Metrics Tracked**
- Page load times (< 2 seconds)
- API response times (< 500ms)
- 3D rendering performance (90+ FPS)
- Memory usage optimization

### **Optimization Techniques**
- Code splitting and lazy loading
- Image optimization and compression
- Database query optimization
- CDN integration for static assets

## 🔮 Roadmap

### **Planned Features**
- [ ] Multi-language support (i18n)
- [ ] Advanced AI content generation
- [ ] LinkedIn integration
- [ ] Portfolio builder
- [ ] Interview preparation tools
- [ ] Career path recommendations

### **Technical Improvements**
- [ ] Progressive Web App (PWA) support
- [ ] GraphQL API implementation
- [ ] Microservice architecture
- [ ] Real-time collaboration features

## 📞 Support

### **Community Resources**
- **Documentation**: [Wiki](https://github.com/yourusername/hire-lytics/wiki)
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/hire-lytics/issues)
- **Discussion Forum**: [GitHub Discussions](https://github.com/yourusername/hire-lytics/discussions)

### **Professional Support**
For enterprise inquiries and custom implementations:
- Email: support@hire-lytics.com
- Business: partnerships@hire-lytics.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **FastAPI Community** for excellent backend tools
- **Three.js Contributors** for 3D graphics capabilities
- **Open Source Community** for countless libraries and tools

---

<p align="center">
  Made with ❤️ by the Hire-Lytics Team
  <br/>
  <a href="https://hire-lytics.com">Visit our website</a> • 
  <a href="https://twitter.com/hirelytics">Follow us on Twitter</a>
</p>
