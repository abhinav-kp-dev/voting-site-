<div align="center">

# 🗳️ Votesy

### Modern Professional Voting Platform

[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.9-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

*Create professional voting campaigns, collect votes securely, and visualize results in real-time.*

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [API](#api-routes) • [Contributing](#contributing)

</div>

---

## ✨ Features

### For Voters
- **Secure Authentication** - Sign up with email/password or OAuth (Google, LinkedIn)
- **LinkedIn Verification** - Ensures one authentic vote per person
- **Easy Voting** - Clean, intuitive interface to cast your vote
- **Voting History** - Track all your past votes in one place

### For Candidates
- **Campaign Management** - Create and manage voting campaigns
- **Real-time Analytics** - Watch votes come in live with instant updates
- **Voter Export** - Download voter lists in CSV or JSON format (without revealing vote choices)
- **Custom Deadlines** - Set voting deadlines for your campaigns

### Platform Features
- **Modern UI/UX** - Beautiful dark theme with smooth animations
- **Animated Splash Screen** - Professional branding on site load
- **Cursor Light Effects** - Interactive glow effects on the homepage
- **Fully Responsive** - Works seamlessly on desktop and mobile
- **Password Recovery** - Secure password reset via email

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 13, React 18, Framer Motion |
| **Styling** | CSS Variables, Custom Design System |
| **Authentication** | NextAuth.js (Credentials, Google, LinkedIn) |
| **Database** | MongoDB with MongoDB Adapter |
| **Icons** | Lucide React |
| **Animations** | Framer Motion, CSS Keyframes |

---

## 📦 Installation

### Prerequisites

- Node.js 16.x or higher
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google OAuth credentials (optional)
- LinkedIn OAuth credentials (optional)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/votesy.git
   cd votesy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://your-connection-string
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # LinkedIn OAuth (optional)
   LINKEDIN_CLIENT_ID=your-linkedin-client-id
   LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
   
   # Email (for password reset)
   EMAIL_SERVER_HOST=smtp.example.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@example.com
   EMAIL_SERVER_PASSWORD=your-email-password
   EMAIL_FROM=noreply@votesy.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚀 Usage

### For Voters

1. **Sign Up** - Create an account using email or OAuth
2. **Browse Campaigns** - View active voting campaigns on the homepage
3. **Cast Your Vote** - Click on a campaign and select your preferred candidate
4. **View Results** - See real-time voting results after casting your vote

### For Candidates

1. **Register as Candidate** - Click "Candidate Register" in the navbar
2. **Create Campaign** - Set up your voting campaign with:
   - Campaign name and description
   - Two candidates with names, bios, and LinkedIn profiles
   - Optional voting deadline
3. **Share Your Link** - Share the unique campaign URL with your audience
4. **Monitor Results** - Track votes in real-time from your dashboard
5. **Export Data** - Download voter lists (CSV/JSON) from the edit page

---

## 📁 Project Structure

```
votesy/
├── components/
│   ├── Layout.js          # Main layout with navbar
│   ├── SplashScreen.js    # Animated splash screen
│   └── CursorTrail.js     # Cursor glow effect
├── pages/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── candidate/     # Candidate management
│   │   ├── teams/         # Team/campaign endpoints
│   │   ├── user/          # User profile endpoints
│   │   └── vote.js        # Voting endpoint
│   ├── candidate/
│   │   ├── login.js       # Candidate login
│   │   ├── signup.js      # Candidate registration
│   │   ├── dashboard.js   # Campaign management
│   │   ├── create-team.js # Create new campaign
│   │   └── edit-team/     # Edit campaign
│   ├── team/
│   │   └── [slug].js      # Public voting page
│   ├── _app.js            # App wrapper
│   ├── index.js           # Homepage
│   ├── login.js           # Voter login
│   ├── signup.js          # Voter registration
│   └── profile.js         # User profile
├── styles/
│   └── globals.css        # Global styles & design system
├── lib/
│   └── mongodb.js         # Database connection
└── public/                # Static assets
```

---

## 🔌 API Routes

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new voter |
| POST | `/api/auth/candidate-signup` | Register new candidate |
| POST | `/api/auth/forgot` | Request password reset |
| POST | `/api/auth/reset` | Reset password |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | List all campaigns |
| GET | `/api/teams/[slug]` | Get campaign details |
| GET | `/api/teams/[slug]/voters` | Get voters list |
| GET | `/api/teams/[slug]/download-voters` | Download voters (CSV/JSON) |

### Voting
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vote` | Cast a vote |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/api/user/profile` | Get/update user profile |
| GET | `/api/user/voting-history` | Get user's voting history |

---

## 🎨 Design System

Votesy uses a custom dark theme design system with CSS variables:

```css
/* Brand Colors */
--brand-primary: #22c55e;    /* Green */
--brand-accent: #06b6d4;     /* Cyan */

/* Background */
--bg-primary: #09090b;
--bg-elevated: #18181b;

/* Text */
--text-primary: #fafafa;
--text-secondary: #a1a1aa;
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful icons
- [MongoDB](https://www.mongodb.com/) - Database

---

<div align="center">

**Built with ❤️ by the Votesy Team**

[⬆ Back to Top](#-votesy)

</div>
