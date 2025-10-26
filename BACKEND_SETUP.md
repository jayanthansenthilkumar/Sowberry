# Sowberry Academy - Learning Management System

A complete Learning Management System (LMS) with role-based access for Admin, Mentors, and Students. Built with HTML, CSS, JavaScript, PHP, MySQL, AJAX, jQuery, and SweetAlert2.

## 🎯 Features

### Admin Features
- **Dashboard Analytics**: View comprehensive statistics on students, mentors, courses, and enrollments
- **User Management**: Create, update, delete students and mentors
- **Course Management**: Oversee all courses across the platform
- **Reports & Analytics**: Generate and view system-wide reports
- **Contact Management**: Handle contact form submissions

### Mentor Features
- **Course Creation**: Create and manage courses with modules
- **Assignment Management**: Create, assign, and grade assignments
- **Student Progress Tracking**: Monitor individual student performance
- **Aptitude Tests**: Create and manage aptitude assessments
- **Coding Problems**: Create programming challenges
- **Event Organization**: Schedule and manage educational events
- **Study Materials**: Upload and organize learning resources

### Student Features
- **Course Enrollment**: Browse and enroll in available courses
- **Progress Tracking**: Monitor learning progress with visual analytics
- **Assignment Submission**: Submit assignments and receive feedback
- **Aptitude Tests**: Take assessments and view results
- **Coding Practice**: Solve programming problems
- **Study Materials**: Access course materials and resources
- **Event Registration**: Register for upcoming events
- **Activity Tracking**: GitHub-style contribution calendar
- **Grades & Certificates**: View grades and earned certificates

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Libraries**: jQuery 3.6.0, SweetAlert2, Chart.js, Particles.js
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Icons**: Remix Icon
- **Fonts**: Google Fonts (Poppins)

## 📦 Installation

### Prerequisites
- XAMPP/WAMP/MAMP or any local server with PHP 7.4+ and MySQL 5.7+
- Web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)

### Step 1: Database Setup

1. Start your MySQL server (via XAMPP/WAMP)
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `sowberry_academy`
4. Import the database schema:
   - Click on the `sowberry_academy` database
   - Go to "Import" tab
   - Choose file: `database/sowberry_db.sql`
   - Click "Go" to import

### Step 2: Backend Configuration

1. Navigate to `backend/config/database.php`
2. Update database credentials if needed (default is localhost/root):
   ```php
   private $host = "localhost";
   private $db_name = "sowberry_academy";
   private $username = "root";
   private $password = "";
   ```

### Step 3: File Placement

1. Copy the entire `Sowberry` folder to your web server directory:
   - **XAMPP**: `C:\xampp\htdocs\Sowberry`
   - **WAMP**: `C:\wamp\www\Sowberry`
   - **MAMP**: `/Applications/MAMP/htdocs/Sowberry`

### Step 4: Access the Application

1. Start Apache and MySQL services
2. Open your browser and navigate to:
   - **Main Site**: http://localhost/Sowberry/
   - **Login Page**: http://localhost/Sowberry/auth/index.html

## 👥 Default User Accounts

### Admin Account
- **Email**: admin@sowberry.com
- **Username**: admin
- **Password**: admin123
- **Dashboard**: /admin/admin.html

### Mentor Accounts
1. **Jayanthan S**
   - Email: jayanthan@sowberry.com
   - Username: jayanthan
   - Password: mentor123
   
2. **Prithika K**
   - Email: prithika@sowberry.com
   - Username: prithika
   - Password: mentor123

3. **Sreelekha S**
   - Email: sreelekha@sowberry.com
   - Username: sreelekha
   - Password: mentor123

### Student Accounts
1. **Sowmiya R**
   - Email: student1@sowberry.com
   - Username: student1
   - Password: student123

2. **Ravi Kumar**
   - Email: student2@sowberry.com
   - Username: student2
   - Password: student123

3. **Priya Sharma**
   - Email: student3@sowberry.com
   - Username: student3
   - Password: student123

## 📁 Project Structure

```
Sowberry/
├── admin/                      # Admin dashboard pages
│   ├── admin.html
│   ├── adminSettings.html
│   ├── coursesOverview.html
│   ├── manageMentors.html
│   ├── manageStudents.html
│   ├── performanceAnalytics.html
│   └── systemReports.html
├── assets/
│   ├── css/                    # Stylesheets
│   │   ├── main.css
│   │   ├── mentor.css
│   │   └── students.css
│   ├── script/                 # JavaScript files
│   │   ├── api-config.js      # API configuration
│   │   ├── auth.js            # Authentication handlers
│   │   ├── codeEditor.js
│   │   ├── main.js
│   │   ├── mentor.js
│   │   └── students.js
│   └── team/                   # Team member photos
├── auth/
│   └── index.html             # Login/Registration page
├── backend/
│   ├── api/                    # API endpoints
│   │   ├── admin.php          # Admin operations
│   │   ├── auth.php           # Authentication
│   │   ├── common.php         # Common operations
│   │   ├── mentor.php         # Mentor operations
│   │   └── student.php        # Student operations
│   └── config/                 # Configuration files
│       ├── config.php         # App configuration
│       └── database.php       # Database connection
├── database/
│   └── sowberry_db.sql        # Database schema & sample data
├── mentor/                     # Mentor dashboard pages
│   ├── mentorDashboard.html
│   ├── mentorDiscussion.html
│   ├── newAptitude.html
│   ├── newAssignments.html
│   ├── newCourses.html
│   ├── newEvents.html
│   ├── newproblemSolving.html
│   └── studentsProgress.html
├── students/                   # Student dashboard pages
│   ├── aptitudeTests.html
│   ├── codeEditor.html
│   ├── codingPractice.html
│   ├── learningGames.html
│   ├── myAssignments.html
│   ├── myCourses.html
│   ├── myGrades.html
│   ├── myProgress.html
│   ├── studentsDashboard.html
│   └── studyMaterial.html
├── index.html                  # Homepage
└── README.md                   # This file
```

## 🗃️ Database Schema (3NF)

### Core Tables
- **users**: Main user authentication and profile data
- **admins**: Admin-specific details
- **mentors**: Mentor-specific details and statistics
- **students**: Student-specific details and progress

### Course Management
- **courses**: Course information
- **course_modules**: Course lessons/modules
- **enrollments**: Student course enrollments
- **study_materials**: Learning resources

### Assessment & Grading
- **assignments**: Assignment details
- **assignment_submissions**: Student submissions
- **aptitude_tests**: Aptitude test definitions
- **aptitude_questions**: Test questions
- **test_attempts**: Student test attempts
- **test_answers**: Student answers
- **grades**: Student grades
- **coding_problems**: Programming challenges
- **coding_submissions**: Code submissions

### Engagement
- **events**: Educational events
- **event_registrations**: Event registrations
- **discussions**: Discussion forum posts
- **discussion_replies**: Forum replies
- **notifications**: User notifications
- **student_activity**: Daily activity tracking

### Other
- **contact_submissions**: Contact form submissions
- **password_reset_otps**: OTP for password reset
- **system_reports**: Admin reports
- **learning_games**: Educational games
- **game_scores**: Game performance

## 🔌 API Endpoints

### Authentication (`/backend/api/auth.php`)
- `POST /auth.php?action=login` - User login
- `POST /auth.php?action=register` - User registration
- `POST /auth.php?action=logout` - User logout
- `POST /auth.php?action=send-otp` - Send OTP for password reset
- `POST /auth.php?action=verify-otp` - Verify OTP
- `POST /auth.php?action=reset-password` - Reset password
- `GET /auth.php?action=check-session` - Check session status

### Student Operations (`/backend/api/student.php`)
- `GET /student.php?action=dashboard` - Get dashboard data
- `GET /student.php?action=courses` - Get all courses
- `POST /student.php?action=enroll` - Enroll in course
- `GET /student.php?action=my-courses` - Get enrolled courses
- `GET /student.php?action=assignments` - Get assignments
- `POST /student.php?action=submit-assignment` - Submit assignment
- `GET /student.php?action=grades` - Get grades
- `GET /student.php?action=progress` - Get progress
- `GET /student.php?action=study-activity` - Get activity data
- `GET /student.php?action=aptitude-tests` - Get tests
- `POST /student.php?action=start-test` - Start test
- `POST /student.php?action=submit-test` - Submit test
- `GET /student.php?action=coding-problems` - Get problems
- `POST /student.php?action=submit-code` - Submit code
- `GET /student.php?action=events` - Get events
- `POST /student.php?action=register-event` - Register for event

### Mentor Operations (`/backend/api/mentor.php`)
- `GET /mentor.php?action=dashboard` - Get dashboard data
- `GET /mentor.php?action=my-courses` - Get courses
- `POST /mentor.php?action=create-course` - Create course
- `PUT /mentor.php?action=update-course` - Update course
- `DELETE /mentor.php?action=delete-course` - Delete course
- `GET /mentor.php?action=students` - Get students
- `GET /mentor.php?action=assignments` - Get assignments
- `POST /mentor.php?action=create-assignment` - Create assignment
- `GET /mentor.php?action=submissions` - Get submissions
- `POST /mentor.php?action=grade-assignment` - Grade assignment
- `POST /mentor.php?action=create-event` - Create event
- `POST /mentor.php?action=create-aptitude-test` - Create test
- `POST /mentor.php?action=create-coding-problem` - Create problem

### Admin Operations (`/backend/api/admin.php`)
- `GET /admin.php?action=dashboard` - Get dashboard data
- `GET /admin.php?action=students` - Get all students
- `POST /admin.php?action=create-student` - Create student
- `PUT /admin.php?action=update-student` - Update student
- `DELETE /admin.php?action=delete-student` - Delete student
- `GET /admin.php?action=mentors` - Get all mentors
- `POST /admin.php?action=create-mentor` - Create mentor
- `PUT /admin.php?action=update-mentor` - Update mentor
- `DELETE /admin.php?action=delete-mentor` - Delete mentor
- `GET /admin.php?action=all-courses` - Get all courses
- `GET /admin.php?action=analytics` - Get analytics
- `POST /admin.php?action=generate-report` - Generate report
- `GET /admin.php?action=reports` - Get reports

### Common Operations (`/backend/api/common.php`)
- `POST /common.php?action=contact` - Submit contact form
- `GET /common.php?action=notifications` - Get notifications
- `PUT /common.php?action=mark-notification-read` - Mark as read
- `GET /common.php?action=user-profile` - Get profile
- `PUT /common.php?action=update-profile` - Update profile
- `POST /common.php?action=change-password` - Change password

## 🎨 Features Implementation

### SweetAlert2 Integration
All user interactions use SweetAlert2 for beautiful, consistent alerts:
```javascript
// Success alert
showAlert('success', 'Success!', 'Operation completed');

// Error alert
showAlert('error', 'Error', 'Something went wrong');

// Loading alert
showLoading('Processing...');
```

### AJAX API Calls
All backend communication uses the centralized API request function:
```javascript
const result = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, 'POST', {
    email: email,
    password: password
});
```

### Session Management
PHP sessions track user authentication and role-based access control.

### Password Security
Note: Passwords are **not hashed** as per requirements. In production, implement proper password hashing (bcrypt, argon2).

## 🔒 Security Considerations

1. **Input Sanitization**: All inputs are sanitized using `sanitizeInput()` function
2. **Email Validation**: Proper email validation on both frontend and backend
3. **SQL Injection Protection**: Using PDO prepared statements
4. **XSS Protection**: HTML special characters are escaped
5. **Session Management**: Secure session handling with HTTP-only cookies
6. **CORS Headers**: Configured for API access

## 🚀 Development Guidelines

### Adding New API Endpoints

1. Create endpoint in appropriate API file (`admin.php`, `mentor.php`, `student.php`, or `common.php`)
2. Add endpoint to `API_CONFIG.ENDPOINTS` in `assets/script/api-config.js`
3. Use the `apiRequest()` function for frontend calls
4. Implement proper error handling with SweetAlert2

### Database Changes

1. Update `database/sowberry_db.sql` with new tables/columns
2. Maintain 3NF normalization
3. Add appropriate indexes for performance
4. Update foreign key constraints

### Frontend Updates

1. Follow existing naming conventions
2. Use consistent styling with CSS variables
3. Implement responsive design for all new components
4. Add SweetAlert2 for user feedback
5. Use AJAX for all backend communication

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL service is running
- Check database credentials in `backend/config/database.php`
- Ensure `sowberry_academy` database exists

### 404 Errors on API Calls
- Check Apache is running
- Verify file paths are correct
- Check `.htaccess` if using URL rewriting

### Session Issues
- Clear browser cookies
- Check PHP session configuration
- Verify session_start() is called in config.php

### CORS Errors
- Verify CORS headers in `backend/config/config.php`
- Check browser console for specific errors

## 📝 License

This project is created for educational purposes.

## 👥 Team

- **Jayanthan S** - Founder & Director
- **Prithika K** - Head of Curriculum
- **Sreelekha S** - Learning Specialist
- **Priyadharshini B** - Technology Director
- **Sridevi S** - Student Success Coach

## 📧 Contact

- **Email**: berries@sowberry.com
- **Phone**: +91 8825756388
- **Address**: 123 Education Avenue, Chennai, Tamil Nadu 600001

---

**Note**: This is a demonstration project. For production use, implement proper security measures including password hashing, HTTPS, input validation, and regular security audits.
