# FundWise - Mutual Fund Recommender

AI-powered mutual fund recommendation system that provides personalized investment suggestions based on user risk profiles, investment goals, and financial parameters. Built with React, Node.js, Express, MongoDB, and featuring real-time data from AMFI India.

## 🌟 Features

### Core Functionality
- **Personalized Recommendations**: AI-powered fund recommendations with profile-based caching for instant results
- **Profile-Based Caching**: Recommendations persist until profile changes, ensuring consistency and performance
- **Smart Cache Invalidation**: Automatic regeneration when user updates investment preferences
- **Real-time Fund Data**: Daily automated data refresh from AMFI India at 6:30 PM IST
- **Comprehensive Fund Explorer**: Browse and filter 14,000+ mutual funds with advanced search
- **Performance Analytics**: Historical NAV data, returns (1m/3m/6m/1y), and volatility metrics
- **Risk Profiling**: Customizable investment profiles (Conservative, Balanced, Aggressive)

### Technical Highlights
- **Optimized Performance**: MongoDB aggregation pipeline reduces recommendation generation from 30s+ to 5-10s
- **Efficient Caching**: First load takes ~5-10 seconds, subsequent loads are instant (<100ms)
- **Profile Hash Tracking**: SHA-256 hashing ensures recommendations stay synchronized with user profiles
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Error Handling**: Comprehensive error handling with user-friendly notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks and context API
- **React Router v6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Toast notifications
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime (ES Modules)
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **node-cron** - Scheduled tasks
- **axios** - HTTP client for AMFI API

### Data Source
- **AMFI India** - Association of Mutual Funds in India
- Daily NAV updates from https://www.amfiindia.com/spages/NAVAll.txt
- 14,000+ mutual funds data
- Automated refresh at 6:30 PM IST daily

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/SuryaPS3/mutual-fund-recommender.git
cd mutual-fund-recommender
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# ML Service (Optional - fallback system will be used if not configured)
ML_SERVICE_URL=http://localhost:8000
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Initialize Database

```bash
# From server directory
npm run dev

# The server will automatically:
# 1. Connect to MongoDB
# 2. Fetch latest fund data from AMFI India
# 3. Calculate metrics
# 4. Schedule daily refresh at 6:30 PM IST
```

### 5. Start Development Servers

**Backend (Terminal 1):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

## 📁 Project Structure

```
mutual-fund-recommender/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/             # Recharts visualization components
│   │   │   ├── common/             # Reusable UI components
│   │   │   ├── fund/               # Fund-related components
│   │   │   ├── layout/             # Navbar, Footer
│   │   │   └── recommendation/     # Recommendation components
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication context
│   │   ├── pages/
│   │   │   ├── auth/               # Login, Register
│   │   │   ├── dashboard/          # Dashboard
│   │   │   ├── funds/              # Fund Explorer, Details
│   │   │   ├── profile/            # Risk Profile
│   │   │   └── recommendations/    # Recommendations
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with interceptors
│   │   │   ├── authService.js      # Authentication API calls
│   │   │   ├── fundService.js      # Fund data API calls
│   │   │   ├── recommendationService.js
│   │   │   └── userService.js
│   │   └── App.jsx                 # Root component with routing
│   └── package.json
│
├── server/                          # Backend Node.js application
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── logger.js           # Winston logger
│   │   ├── controllers/
│   │   │   ├── authController.js   # Authentication logic
│   │   │   ├── fundController.js   # Fund CRUD operations
│   │   │   ├── profileController.js # User profile management
│   │   │   └── recommendationController.js # Recommendation engine
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   └── validation.js       # Request validation
│   │   ├── models/
│   │   │   ├── Fund.js             # Fund schema
│   │   │   ├── FundMetrics.js      # Performance metrics schema
│   │   │   ├── NAVHistory.js       # Historical NAV data
│   │   │   ├── Recommendation.js   # Recommendations with profile_hash
│   │   │   ├── User.js             # User authentication
│   │   │   └── UserProfile.js      # Investment profile
│   │   ├── routes/
│   │   │   ├── admin.js            # Admin endpoints (data refresh)
│   │   │   ├── auth.js             # Authentication routes
│   │   │   ├── funds.js            # Fund routes
│   │   │   ├── profile.js          # Profile routes
│   │   │   └── recommendations.js  # Recommendation routes
│   │   ├── services/
│   │   │   └── fundDataService.js  # AMFI data fetching & processing
│   │   ├── utils/
│   │   │   ├── errors.js           # Custom error classes
│   │   │   └── helpers.js          # Utility functions
│   │   ├── app.js                  # Express app configuration
│   │   └── server.js               # Server entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/me                # Get current user
```

### Profile Management
```
POST   /api/profile                # Create/Update profile
GET    /api/profile                # Get user profile
PATCH  /api/profile                # Update profile fields
```

### Recommendations
```
POST   /api/recommendations        # Get personalized recommendations
GET    /api/recommendations/history # Get recommendation history
```

### Funds
```
GET    /api/funds                  # List all funds (with filters)
GET    /api/funds/categories       # Get fund categories
GET    /api/funds/:id              # Get fund details
GET    /api/funds/:id/nav-history  # Get NAV history
POST   /api/funds/compare          # Compare multiple funds
```

### Admin (Protected)
```
POST   /api/admin/refresh-data     # Trigger manual data refresh
GET    /api/admin/status           # Get system status
```

## 🧠 Recommendation System

### How It Works

1. **Profile Analysis**: System generates SHA-256 hash of user profile (risk, horizon, budget, goals)
2. **Cache Check**: Looks for existing recommendations matching profile hash
3. **Instant Return**: If cached recommendations exist, returns immediately (<100ms)
4. **Generation** (if no cache):
   - Aggregates 500 active funds with latest metrics via MongoDB pipeline
   - Attempts ML service call (if configured)
   - Falls back to rule-based scoring algorithm
   - Calculates scores based on:
     - Risk profile match (Conservative/Balanced/Aggressive)
     - Historical returns (1m/3m/6m/1y)
     - Expense ratio penalties
     - Volatility adjustments
   - Saves top 10 recommendations with profile hash
5. **Cache Invalidation**: Automatically clears when user updates profile

### Performance Metrics
- **First Generation**: 5-10 seconds (500 funds aggregated)
- **Cached Results**: <100ms (instant)
- **Database Queries**: 1 aggregation pipeline (vs 1000 individual queries)
- **Cache Hit Rate**: ~95% for established users

## 📊 Database Schema

### Key Collections

**users**: User authentication
```javascript
{ email, password_hash, name, created_at }
```

**userprofiles**: Investment preferences
```javascript
{ 
  user_id, risk_profile, investment_horizon, 
  budget_type, budget_amount, expense_ratio_limit,
  dividend_preference, investment_goal 
}
```

**funds**: Mutual fund master data (14,000+ records)
```javascript
{ 
  scheme_code, scheme_name, fund_house, category,
  expense_ratio, aum, risk_rating, is_active 
}
```

**fundmetrics**: Performance calculations
```javascript
{ 
  fund_id, return_1m, return_3m, return_6m, return_1y,
  volatility, sharpe_ratio, computed_at 
}
```

**navhistory**: Historical NAV data
```javascript
{ fund_id, nav, nav_date }
```

**recommendations**: Cached recommendations with profile hash
```javascript
{ 
  user_id, fund_id, score, rank, reason,
  profile_hash, created_at 
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for all inputs
- **Error Handling**: Sanitized error messages
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet.js**: Security headers
- **Rate Limiting**: Express rate limit middleware

## 🎨 UI Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme Footer**: Professional footer with contact information
- **Toast Notifications**: Real-time feedback with react-hot-toast
- **Loading States**: Skeleton loaders and spinners
- **Error Boundaries**: Graceful error handling
- **Protected Routes**: Authentication-based navigation
- **Persistent Auth**: LocalStorage with auto-logout on expiry

## 📈 Data Pipeline

### Daily Refresh Cycle (Automated)
1. **6:30 PM IST**: Cron job triggers
2. **Data Fetch**: Downloads latest NAV from AMFI India
3. **Parsing**: Extracts fund details and NAV data
4. **Upsert**: Updates existing funds, creates new ones
5. **NAV History**: Inserts daily NAV records
6. **Metrics**: Calculates returns and volatility
7. **Logging**: Records success/failure status

### Manual Refresh (Admin)
```bash
POST /api/admin/refresh-data
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Developer

**Surya Pratap Singh**
- Email: spsingh2003.sps@gmail.com
- GitHub: [@SuryaPS3](https://github.com/SuryaPS3)
- LinkedIn: [Surya Pratap Singh](https://linkedin.com/in/surya-pratap-singh-55b2281bb)

## 📄 License

This project is built for educational and informational purposes. Fund data sourced from AMFI India.

## 🙏 Acknowledgments

- **AMFI India** - For providing mutual fund data
- **MongoDB Atlas** - Cloud database platform
- **Vercel/Netlify** - Deployment options
- **React & Vite** - Frontend tooling

---

**Note**: This application provides information only and should not be considered as financial advice. Always consult with a certified financial advisor before making investment decisions.
