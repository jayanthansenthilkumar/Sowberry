# PAGE INTEGRATION GUIDE

This guide shows you how to integrate the backend API into all existing PHP pages.

## ✅ COMPLETED INTEGRATIONS

### 1. login.php ✅
**What was done:**
- Added jQuery, SweetAlert2, and api.js
- Replaced alert() with API.Auth.login()
- Added backend-powered registration
- Implemented forgot password with OTP
- Auto-redirects based on user role (admin/mentor/student)

**Test it:**
- Open login.php
- Use: admin@sowberry.com / admin123
- Should redirect to admin.php

---

### 2. manageStudents.php ✅
**What was done:**
- Added SweetAlert2 and api.js
- Replaced static table with API.Student.getAll()
- Implemented real-time CRUD operations
- Added DataTables with dynamic data
- Delete confirmation with SweetAlert2
- Edit/Add student modals with validation

**Test it:**
- Login as admin
- Go to manageStudents.php
- Click "Add New Student"
- Edit or delete existing students

---

### 3. Common Logout Functionality ✅
**Created:** `assets/script/common.js`
- Global logout handler
- Session check function
- Works across all pages

---

## 🔧 HOW TO INTEGRATE OTHER PAGES

### Step 1: Add Required Scripts
Add these lines to **every PHP page** after your existing scripts:

```html
<!-- SweetAlert2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<!-- API Handler -->
<script src="./assets/script/api.js"></script>
<!-- Common Functions -->
<script src="./assets/script/common.js"></script>
```

### Step 2: Page-Specific Integration Templates

---

## 📊 ADMIN DASHBOARD (admin.php)

**Replace hardcoded stats with:**
```javascript
async function loadDashboardStats() {
    try {
        // Get student count
        const students = await API.Student.getAll();
        document.getElementById('totalStudents').textContent = students.length;
        
        // Get mentor count
        const mentors = await API.Mentor.getAll();
        document.getElementById('totalMentors').textContent = mentors.length;
        
        // Get course count
        const courses = await API.Course.getAll();
        document.getElementById('totalCourses').textContent = courses.length;
        
        // Calculate active students
        const activeStudents = students.filter(s => s.status === 'active').length;
        document.getElementById('activeStudents').textContent = activeStudents;
        
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadDashboardStats);
```

---

## 👨‍🎓 STUDENT DASHBOARD (studentsDashboard.php)

**Load student's courses and progress:**
```javascript
async function loadStudentDashboard() {
    try {
        // Get current user session
        const session = await API.Auth.checkSession();
        const studentId = session.user.id;
        
        // Get student progress
        const progress = await API.Student.getProgress(studentId);
        
        // Update progress bars
        document.getElementById('overallProgress').style.width = `${progress.overall_progress}%`;
        document.getElementById('progressText').textContent = `${progress.overall_progress}%`;
        
        // Load enrolled courses
        const courses = await API.Course.getAll({ student_id: studentId });
        renderCourseCards(courses);
        
        // Load recent assignments
        const assignments = await API.Assignment.getAll({ student_id: studentId, limit: 5 });
        renderAssignments(assignments);
        
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

function renderCourseCards(courses) {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = '';
    
    courses.forEach(course => {
        const card = `
            <div class="course-card">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${course.progress}%"></div>
                </div>
                <span>${course.progress}% Complete</span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', card);
    });
}

document.addEventListener('DOMContentLoaded', loadStudentDashboard);
```

---

## 👨‍🏫 MENTOR DASHBOARD (mentorDashboard.php)

**Load mentor statistics:**
```javascript
async function loadMentorDashboard() {
    try {
        const session = await API.Auth.checkSession();
        const mentorId = session.user.id;
        
        // Get mentor statistics
        const stats = await API.Mentor.getStats(mentorId);
        
        document.getElementById('totalCourses').textContent = stats.total_courses;
        document.getElementById('totalStudents').textContent = stats.total_students;
        document.getElementById('activeStudents').textContent = stats.active_students;
        
        // Load mentor's courses
        const courses = await API.Course.getAll({ mentor_id: mentorId });
        renderMentorCourses(courses);
        
    } catch (error) {
        console.error('Failed to load mentor dashboard:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadMentorDashboard);
```

---

## 📚 COURSE MANAGEMENT (newCourses.php)

**Similar to manageStudents.php:**
```javascript
async function loadCourses() {
    try {
        const courses = await API.Course.getAll();
        
        const tbody = document.querySelector('#coursesTable tbody');
        tbody.innerHTML = '';
        
        courses.forEach(course => {
            const row = `
                <tr>
                    <td>${course.id}</td>
                    <td>${course.title}</td>
                    <td>${course.category_name}</td>
                    <td>${course.enrolled_students} students</td>
                    <td><span class="status-${course.status}">${course.status}</span></td>
                    <td>
                        <button class="edit-btn" data-id="${course.id}">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="delete-btn" data-id="${course.id}">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });
        
        // Initialize DataTable
        $('#coursesTable').DataTable();
        
    } catch (error) {
        console.error('Failed to load courses:', error);
    }
}

// Add course form submission
document.getElementById('addCourseForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDescription').value,
        category_id: document.getElementById('categoryId').value,
        mentor_id: document.getElementById('mentorId').value,
        duration: document.getElementById('duration').value,
        difficulty: document.getElementById('difficulty').value
    };
    
    try {
        await API.Course.create(formData);
        hideModal();
        await loadCourses();
    } catch (error) {
        console.error('Failed to create course:', error);
    }
});

document.addEventListener('DOMContentLoaded', loadCourses);
```

---

## 📝 MANAGE MENTORS (manageMentors.php)

**Exact same pattern as manageStudents.php:**
```javascript
async function loadMentors() {
    try {
        const mentors = await API.Mentor.getAll();
        
        const tbody = document.querySelector('#mentorsTable tbody');
        tbody.innerHTML = '';
        
        mentors.forEach(mentor => {
            const row = `
                <tr>
                    <td>${mentor.id}</td>
                    <td>${mentor.full_name}</td>
                    <td>${mentor.email}</td>
                    <td>${mentor.expertise}</td>
                    <td>${mentor.total_students} students</td>
                    <td>
                        <button class="edit-btn" data-id="${mentor.id}">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="delete-btn" data-id="${mentor.id}">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });
        
        $('#mentorsTable').DataTable();
        
    } catch (error) {
        console.error('Failed to load mentors:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadMentors);
```

---

## 📋 ASSIGNMENTS (newAssignments.php, myAssignments.php)

**Create assignment:**
```javascript
document.getElementById('createAssignmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        await API.Assignment.create(formData);
        API.showSuccess('Assignment created successfully!');
        loadAssignments();
    } catch (error) {
        console.error('Failed to create assignment:', error);
    }
});
```

**Submit assignment (student):**
```javascript
document.getElementById('submitAssignmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const assignmentId = document.getElementById('assignmentId').value;
    
    try {
        await API.Assignment.submit(assignmentId, formData);
        API.showSuccess('Assignment submitted successfully!');
    } catch (error) {
        console.error('Failed to submit assignment:', error);
    }
});
```

---

## 💻 CODING PRACTICE (codingPractice.php, newproblemSolving.php)

**Load problems:**
```javascript
async function loadCodingProblems() {
    try {
        const problems = await API.CodingPractice.getProblems();
        renderProblems(problems);
    } catch (error) {
        console.error('Failed to load problems:', error);
    }
}

function renderProblems(problems) {
    const container = document.getElementById('problemsContainer');
    container.innerHTML = '';
    
    problems.forEach(problem => {
        const card = `
            <div class="problem-card" data-id="${problem.id}">
                <h3>${problem.title}</h3>
                <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
                <p>${problem.description}</p>
                <button onclick="openProblem(${problem.id})">Solve</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', card);
    });
}

async function submitCode(problemId, code, language) {
    try {
        const result = await API.CodingPractice.submitCode(problemId, code, language);
        
        if (result.passed) {
            API.showSuccess(`All ${result.test_results.length} test cases passed!`);
        } else {
            API.showError('Some test cases failed');
        }
        
        return result;
    } catch (error) {
        console.error('Failed to submit code:', error);
    }
}
```

---

## 🎯 QUICK CHECKLIST FOR EACH PAGE

For **EVERY** page that needs backend integration:

1. ✅ Add these scripts before closing `</body>`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
   <script src="./assets/script/api.js"></script>
   <script src="./assets/script/common.js"></script>
   ```

2. ✅ Replace hardcoded data with API calls:
   - Find static `<tbody>` or data containers
   - Create `loadData()` function using appropriate API
   - Call in `DOMContentLoaded`

3. ✅ Replace form submissions:
   ```javascript
   form.addEventListener('submit', async (e) => {
       e.preventDefault();
       const formData = {...};
       await API.XXX.create(formData);
       loadData(); // Refresh
   });
   ```

4. ✅ Add edit/delete handlers:
   ```javascript
   // Event delegation
   table.addEventListener('click', async (e) => {
       if (e.target.closest('.delete-btn')) {
           const id = e.target.closest('.delete-btn').dataset.id;
           await API.XXX.delete(id);
           loadData();
       }
   });
   ```

5. ✅ Test thoroughly:
   - Login
   - View data
   - Create new item
   - Edit existing item
   - Delete item
   - Logout

---

## 📡 AVAILABLE API ENDPOINTS

### Authentication
- `API.Auth.login(email, password, remember)`
- `API.Auth.logout()`
- `API.Auth.register(formData)`
- `API.Auth.forgotPassword(email)`
- `API.Auth.resetPassword(email, otp, password)`
- `API.Auth.checkSession()`

### Students
- `API.Student.getAll(filters)`
- `API.Student.getOne(id)`
- `API.Student.create(formData)`
- `API.Student.update(id, formData)`
- `API.Student.delete(id)`
- `API.Student.getProgress(id)`
- `API.Student.updateStatus(id, status)`

### Mentors
- `API.Mentor.getAll(filters)`
- `API.Mentor.getOne(id)`
- `API.Mentor.create(formData)`
- `API.Mentor.update(id, formData)`
- `API.Mentor.delete(id)`
- `API.Mentor.getStats(id)`

### Courses
- `API.Course.getAll(filters)`
- `API.Course.getOne(id)`
- `API.Course.create(formData)`
- `API.Course.update(id, formData)`
- `API.Course.delete(id)`
- `API.Course.enroll(courseId, studentId)`
- `API.Course.updateStatus(id, status)`

### Assignments
- `API.Assignment.getAll(filters)`
- `API.Assignment.getOne(id)`
- `API.Assignment.create(formData)`
- `API.Assignment.update(id, formData)`
- `API.Assignment.delete(id)`
- `API.Assignment.submit(assignmentId, formData)`
- `API.Assignment.grade(submissionId, formData)`
- `API.Assignment.getSubmissions(assignmentId)`

### Coding Practice
- `API.CodingPractice.getProblems(filters)`
- `API.CodingPractice.getProblem(id)`
- `API.CodingPractice.createProblem(formData)`
- `API.CodingPractice.updateProblem(id, formData)`
- `API.CodingPractice.deleteProblem(id)`
- `API.CodingPractice.submitCode(problemId, code, language)`
- `API.CodingPractice.getSubmissions(problemId)`
- `API.CodingPractice.getLeaderboard(problemId)`

### Categories
- `API.Category.getAll()`
- `API.Category.create(formData)`
- `API.Category.update(id, formData)`
- `API.Category.delete(id)`

---

## 🚀 TESTING GUIDE

### 1. Test Login Flow
1. Open login.php
2. Enter: admin@sowberry.com / admin123
3. Should redirect to admin.php
4. Check for success toast notification

### 2. Test Student Management
1. Login as admin
2. Navigate to manageStudents.php
3. Click "Add New Student"
4. Fill form and submit
5. Verify student appears in table
6. Click edit, modify, save
7. Click delete, confirm

### 3. Test Other Pages
Follow the same pattern for:
- Mentor management
- Course management
- Assignment creation
- Coding problems

---

## ⚠️ COMMON ISSUES & FIXES

### Issue: "API is not defined"
**Fix:** Make sure api.js is loaded before your custom scripts

### Issue: "CORS error"
**Fix:** Backend already has CORS headers. Check backend/config.php

### Issue: "Session expired"
**Fix:** User needs to login again. API automatically shows error

### Issue: "DataTables warning"
**Fix:** Destroy existing table before reinitializing:
```javascript
if ($.fn.DataTable.isDataTable('#table')) {
    $('#table').DataTable().destroy();
}
```

---

## 📝 SUMMARY

**Completed Pages:**
1. ✅ login.php - Full authentication with backend
2. ✅ manageStudents.php - Complete CRUD with API
3. ✅ common.js - Global logout and session handling

**Remaining Pages (Use templates above):**
- admin.php - Dashboard stats
- studentsDashboard.php - Student view
- mentorDashboard.php - Mentor view
- newCourses.php - Course management
- manageMentors.php - Mentor CRUD
- newAssignments.php / myAssignments.php - Assignments
- codingPractice.php / newproblemSolving.php - Coding problems
- All other 60+ pages as needed

**Default Login Credentials:**
- Admin: admin@sowberry.com / admin123
- (More can be created through registration)

---

**Need Help?** Refer to:
- `START_HERE.md` - Getting started
- `QUICK_START.md` - Quick reference
- `INTEGRATION_GUIDE.md` - Detailed API docs
- `student_management_example.html` - Complete working example
- `login_example.html` - Working login page

🎉 **Your backend is ready! Start integrating page by page using the templates above!**
