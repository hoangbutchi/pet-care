# 🐱🐕 Pet Care + _web pet care

A full-stack web application for pet management, veterinary appointments, and pet product shopping,
edit product,add my pet.

[English](#english) | [Tiếng Việt](#tiếng-việt)

---

## 🇺🇸 English

### 📋 Table of Contents
- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Demo Accounts](#demo-accounts)
- [Project Structure](#project-structure)

### Introduction

Pet Care Pro is a comprehensive pet management system built with modern web technologies:

- 🐕 **Pet Management** - Track pet info, medical history
- 📅 **Appointment Booking** - Book checkups, vaccinations, grooming
- 🛒 **Online Shop** - Buy food, accessories, medicine
- 💬 **Live Chat** - Chat with veterinarians
- 📧 **Email Marketing** - Campaign management
- 👨‍💼 **Admin Dashboard** - For Staff/Admin management
- 🌐 **Multi-language** - English & Vietnamese support

### Tech Stack

#### Frontend
| Technology | Version | Description |
|------------|---------|-------------|
| React.js | 18.x | Modern UI library |
| Vite | 5.x | Fast build tool |
| Tailwind CSS | 3.x | Utility-first CSS |
| React Router | 6.x | Client-side routing |
| Zustand | 5.x | State management |
| Framer Motion | 10.x | Animations |
| Ant Design | 6.x | UI components |

#### Backend
| Technology | Version | Description |
|------------|---------|-------------|
| Node.js | 18.x | JavaScript runtime |
| Express.js | 4.x | Web framework |
| PostgreSQL | 14.x | Relational database |
| Prisma | 5.x | Database ORM |
| JWT | - | Authentication |
| Socket.io | 4.x | Real-time communication |

### Features

#### 🐕 Pet Management
- Add/edit/delete pets
- Medical history tracking
- Vaccination schedules
- Health records with photos

#### 📅 Appointment Booking
- 3-step booking wizard
- 25+ service types (Grooming, Vaccination, Surgery, etc.)
- Date/time slot selection
- Status tracking (Pending, Confirmed, Completed)

#### 🛒 Online Shop
- Product categories (Food, Accessories, Medicine, Toys)
- Advanced search and filters
- Shopping cart with user-specific storage
- Product detail pages with image galleries

#### 👨‍💼 Admin Dashboard
- **Overview**: Quick stats and analytics
- **Product Management**: Add/edit/delete products
- **Inventory Management**: Stock tracking
- **Price Management**: Dynamic pricing
- **Employee Management**: Staff and role management
- **Order Management**: Process and track orders

#### 💬 Communication Module
- **Live Chat**: Real-time messaging
- **Email Marketing**: Campaign creation and management
- **Online Consultation**: Video consultations with vets

#### 🌐 Internationalization
- English and Vietnamese support
- Easy language toggle
- Localized content

#### 🎨 UI/UX
- Responsive design (mobile, tablet, desktop)
- Modern animations with Framer Motion
- Intuitive user interface
- Accessibility compliant

### Installation

#### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm or yarn

#### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/pet-care-pro.git
cd pet-care-pro
Step 2: Setup Backend
cd backend
npm install

# Create .env file with:
DATABASE_URL="postgresql://username:password@localhost:5432/petcare"
JWT_SECRET="your_jwt_secret_key_here"
PORT=3001

# Run database migrations
npx prisma migrate dev

# Seed demo data
node prisma/seedBasicData.js
node prisma/seedUsers.js

# Start server
npm start
Backend runs at: http://localhost:3001

Step 3: Setup Frontend
cd frontend
npm install

# Start development server
npm run dev
Frontend runs at: http://localhost:5174

API Documentation
Base URL
http://localhost:3001/api

Auth Endpoints
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login
GET	/auth/me	Get current user
Pet Endpoints
Method	Endpoint	Description
GET	/pets	Get user's pets
POST	/pets	Add new pet
PUT	/pets/:id	Update pet
DELETE	/pets/:id	Delete pet
POST	/pets/:id/health	Add medical record
Appointment Endpoints
Method	Endpoint	Description
GET	/appointments	Get appointments
POST	/appointments	Create appointment
PUT	/appointments/:id	Update appointment
GET	/appointments/my	Get user appointments
Product Endpoints
Method	Endpoint	Description
GET	/products	List products
GET	/products/:id	Get product detail
POST	/products	Add product (Admin)
PUT	/products/:id	Update product (Admin)
Communication Endpoints
Method	Endpoint	Description
GET	/chat/conversations	Get conversations
POST	/chat/messages	Send message
GET	/email/campaigns	Get email campaigns
POST	/consultations	Create consultation
Demo Accounts
Role	Email	Password
👑 Admin	admin@petcare.com	admin123
👤 User	user@petcare.com	user123
🇻🇳 Tiếng Việt
📋 Mục Lục
Giới Thiệu
Công Nghệ
Tính Năng
Cài Đặt
API Documentation
Tài Khoản Demo
Cấu Trúc Dự Án
Giới Thiệu
Pet Care Pro là hệ thống quản lý thú cưng toàn diện:

🐕 Quản lý thú cưng - Theo dõi thông tin, lịch sử y tế
📅 Đặt lịch hẹn - Đặt lịch khám, tiêm phòng, làm đẹp
🛒 Cửa hàng online - Mua sắm thức ăn, phụ kiện, thuốc
💬 Chat trực tiếp - Trao đổi với bác sĩ thú y
📧 Email Marketing - Quản lý chiến dịch email
👨‍💼 Dashboard quản lý - Dành cho Admin/Staff
🌐 Đa ngôn ngữ - Hỗ trợ Tiếng Việt & English
Công Nghệ
Frontend
Công nghệ	Phiên bản	Mô tả
React.js	18.x	Library UI hiện đại
Vite	5.x	Build tool nhanh
Tailwind CSS	3.x	Utility-first CSS
React Router	6.x	Client-side routing
Zustand	5.x	Quản lý state
Framer Motion	10.x	Animations
Ant Design	6.x	UI components
Backend
Công nghệ	Phiên bản	Mô tả
Node.js	18.x	JavaScript runtime
Express.js	4.x	Web framework
PostgreSQL	14.x	Cơ sở dữ liệu
Prisma	5.x	Database ORM
JWT	-	Xác thực
Socket.io	4.x	Giao tiếp real-time
Tính Năng
🐕 Quản Lý Thú Cưng
Thêm/sửa/xóa thông tin thú cưng
Theo dõi lịch sử y tế
Lịch tiêm phòng
Hồ sơ sức khỏe có ảnh
📅 Đặt Lịch Hẹn
Wizard đặt lịch 3 bước
25+ loại dịch vụ (Làm đẹp, Tiêm phòng, Phẫu thuật, v.v.)
Chọn ngày/giờ
Theo dõi trạng thái
🛒 Cửa Hàng Online
Danh mục sản phẩm đa dạng
Tìm kiếm và lọc nâng cao
Giỏ hàng cá nhân hóa
Trang chi tiết sản phẩm với thư viện ảnh
👨‍💼 Admin Dashboard
Tổng quan: Thống kê nhanh
Quản lý sản phẩm: Thêm/sửa/xóa
Quản lý kho: Theo dõi tồn kho
Quản lý giá: Định giá linh hoạt
Quản lý nhân viên: Staff và phân quyền
Quản lý đơn hàng: Xử lý và theo dõi
💬 Module Giao Tiếp
Chat trực tiếp: Tin nhắn real-time
Email Marketing: Tạo và quản lý chiến dịch
Tư vấn online: Video call với bác sĩ
Cài Đặt
Yêu Cầu
Node.js >= 18.0.0
PostgreSQL >= 14.0
npm hoặc yarn
Bước 1: Clone Repository
git clone https://github.com/your-username/pet-care-pro.git
cd pet-care-pro
Bước 2: Cài Đặt Backend
cd backend
npm install

# Tạo file .env:
DATABASE_URL="postgresql://username:password@localhost:5432/petcare"
JWT_SECRET="your_jwt_secret_key_here"
PORT=3001

# Chạy migration database
npx prisma migrate dev

# Seed dữ liệu demo
node prisma/seedBasicData.js
node prisma/seedUsers.js

# Khởi động server
npm start
Backend chạy tại: http://localhost:3001

Bước 3: Cài Đặt Frontend
cd frontend
npm install

# Khởi động development server
npm run dev
Frontend chạy tại: http://localhost:5174

Tài Khoản Demo
Vai trò	Email	Mật khẩu
👑 Admin	admin@petcare.com	admin123
👤 User	user@petcare.com	user123
📁 Cấu Trúc Dự Án
pet-care-pro/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── locales/         # Translations (EN/VI)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand stores
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js API server
│   ├── config/              # Database connection
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose schemas
│   ├── prisma/              # Prisma schema & migrations
│   ├── routes/              # API routes
│   ├── sockets/             # Socket.io handlers
│   ├── uploads/             # File uploads
│   ├── index.js             # Entry point
│   └── package.json
│
└── README.md
🚀 Deployment
Frontend (Vercel/Netlify)
cd frontend
npm run build
# Deploy dist/ folder
Backend (Railway/Heroku)
cd backend
# Set environment variables
# Deploy to your platform
🤝 Contributing
Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📝 License
MIT License - Free to use for learning and personal projects!
