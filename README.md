# 🎓 BTP Portal – Academic Project Management System

A full-stack web application designed to manage the Bachelor Thesis Project (BTP) workflow for students, professors, and administrators.

🔗 Live Demo: https://btp-project-kohl.vercel.app

------------------------------------------------------------

📌 Overview

BTP Portal is an academic project management platform that simplifies project registration, group formation, supervision approval, and academic session configuration.

The system provides role-based dashboards for:

• Students  
• Professors  
• Administrators  

------------------------------------------------------------

🚀 Features

👨‍🎓 Student Portal
• View notifications  
• Profile management  
• BTP group registration  
• Send & receive group invitations  
• Project overview tracking  
• Password management  

👨‍🏫 Professor Portal
• Manage student group requests  
• Approve / Reject BTP groups  
• Publication management  
• Supervision dashboard  
• Profile & photo management  
• BTP configuration overview  

🛠 Admin Portal
• Upload students & faculty via Excel  
• Manage user accounts  
• Create academic sessions  
• Configure BTP rules  
• Notification broadcasting  
• System configuration dashboard  

------------------------------------------------------------

🧩 Tech Stack

Frontend
• React.js  
• React Router  
• Axios  
• Inline CSS Styling  

Backend
• Node.js  
• Express.js  
• MongoDB (Mongoose)  

Cloud & Deployment
• Vercel (Frontend Hosting)  
• Cloudinary (Image Upload & Storage)  
• MongoDB Atlas (Database)  

------------------------------------------------------------

🔐 Authentication & Security

• Role-based access control  
• JWT authentication  
• Password change enforcement  
• Session-based access management  

------------------------------------------------------------

📊 Key Functional Modules

✔ Group Registration System
Students can:
• Create groups  
• Send invitations  
• Accept / Reject members  
• Submit BTP proposals  

✔ Professor Approval Workflow
Professors can:
• Review group requests  
• Approve or reject proposals  
• Monitor supervised teams  

✔ Academic Session Control
Admins can:
• Configure semester timelines  
• Define group size limits  
• Set registration deadlines  

✔ Bulk User Upload
Excel-based onboarding for:
• Students  
• Faculty members  

------------------------------------------------------------

⚙ Installation & Setup

1️⃣ Clone Repository

git clone <your-repo-url>
cd btp-portal

------------------------------------------------------------

2️⃣ Install Dependencies

Frontend
cd client  
npm install  

Backend
cd server  
npm install  

------------------------------------------------------------

3️⃣ Environment Variables

Create .env files in both frontend and backend folders.

Backend (.env)

NODE_ENV=production  
PORT=5000  
MONGO_URI=your_mongodb_connection_string  

JWT_SECRET=your_jwt_secret  

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  

ADMIN_SECRET_PATH=your_admin_secret_path  
ADMIN_EMAIL=your_admin_email  
ADMIN_PASSWORD=your_admin_password  

FRONTEND_URL=your_frontend_url  

------------------------------------------------------------

Frontend (.env)

REACT_APP_API_URL=your_backend_url  

⚠ Sensitive credentials such as database URLs and API keys are excluded for security reasons.

------------------------------------------------------------

▶ Running the Application

Start Backend Server

cd server  
npm run dev  

Start Frontend Server

cd client  
npm start  

Frontend runs on:
http://localhost:3000  

Backend runs on:
http://localhost:5000  

------------------------------------------------------------

🌐 Deployment

Frontend Deployment
• Hosted on Vercel  
• Automatic CI/CD via GitHub  

Backend Deployment
• Hosted on cloud server  
• Connected with MongoDB Atlas  
• Uses environment variables for security  

------------------------------------------------------------

🧪 Future Enhancements

• Real-time notifications  
• Email integration  
• Advanced analytics dashboard  
• File upload for BTP reports  
• Professor workload visualization  
• Multi-session historical data tracking  

------------------------------------------------------------

🤝 Contribution

Contributions are welcome!

Steps:
1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Submit a Pull Request  

------------------------------------------------------------

📝 License

This project is built for academic and educational purposes.

------------------------------------------------------------

👩‍💻 Author

Kajal  
Full Stack MERN Developer  
Special Interest: Academic Management Systems & Workflow Automation
