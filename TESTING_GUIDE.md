# 🧪 TESTING GUIDE - Sowberry Academy Backend Integration

## 🎯 Quick Test (2 Minutes)

### Method 1: Visual Verification Dashboard
```
1. Open: http://localhost/Sowberry/system_verification.html
2. Click: "Run All Tests"
3. Check: All tests show ✅ green checkmarks
```

### Method 2: Manual Login Test
```
1. Open: http://localhost/Sowberry/login.php
2. Login: admin@sowberry.com / admin123
3. Verify: Redirects to dashboard with no errors
4. Check: Browser console (F12) shows no errors
```

---

## 🔬 DETAILED TESTING PROCEDURES

### Test Suite 1: Backend API Endpoints

#### Test 1.1: Authentication Endpoints
```javascript
// Open browser console on any page and run:

// Check Session (should return false if not logged in)
fetch('backend/auth.php?action=check_session')
  .then(r => r.json())
  .then(d => console.log('Session Check:', d));

// Expected Response:
// { success: false, message: "Not authenticated" }
// OR
// { success: true, data: { user_id, email, role, ... } }
```

#### Test 1.2: Student API
```javascript
// Get All Students
fetch('backend/students.php?action=getAll')
  .then(r => r.json())
  .then(d => console.log('Students:', d));

// Expected Response:
// { success: true, data: [...array of students...] }
```

#### Test 1.3: Mentor API
```javascript
// Get All Mentors
fetch('backend/mentors.php?action=getAll')
  .then(r => r.json())
  .then(d => console.log('Mentors:', d));

// Expected Response:
// { success: true, data: [...array of mentors...] }
```

#### Test 1.4: Course API
```javascript
// Get All Courses
fetch('backend/courses.php?action=getAll')
  .then(r => r.json())
  .then(d => console.log('Courses:', d));

// Expected Response:
// { success: true, data: [...array of courses...] }
```

---

### Test Suite 2: Frontend Integration

#### Test 2.1: API.js Helper Functions
Open browser console and test:

```javascript
// Test 1: showSuccess
API.showSuccess('Test Success Message');
// Should show green SweetAlert2 toast

// Test 2: showError
API.showError('Test Error Message');
// Should show red SweetAlert2 toast

// Test 3: confirmAction
API.confirmAction('Are you sure?', 'This is a test')
  .then(() => console.log('Confirmed'))
  .catch(() => console.log('Cancelled'));
// Should show confirmation dialog
```

#### Test 2.2: API Wrapper Functions
```javascript
// Test Auth API
API.Auth.checkSession()
  .then(data => console.log('Session:', data))
  .catch(err => console.error('Error:', err));

// Test Student API
API.Student.getAll()
  .then(data => console.log('Students:', data.length, 'found'))
  .catch(err => console.error('Error:', err));

// Test Mentor API
API.Mentor.getAll()
  .then(data => console.log('Mentors:', data.length, 'found'))
  .catch(err => console.error('Error:', err));
```

---

### Test Suite 3: Page-by-Page Testing

#### Test 3.1: login.php
**Steps**:
1. Navigate to `login.php`
2. Clear any existing sessions (logout if needed)
3. Fill in credentials
4. Click "Sign In"

**Validation Points**:
- [ ] Form fields have validation
- [ ] Empty submit shows validation errors
- [ ] Invalid credentials show error message
- [ ] Valid credentials show success and redirect
- [ ] SweetAlert2 messages appear correctly
- [ ] Network tab shows POST to `backend/auth.php?action=login`
- [ ] Response is JSON with success/error

**Test Registration**:
1. Click "Don't have an account? Sign up"
2. Fill registration form
3. Submit

**Validation Points**:
- [ ] Email validation works
- [ ] Password confirmation matches
- [ ] Success message appears
- [ ] Network call to `backend/auth.php?action=register`

---

#### Test 3.2: manageStudents.php
**Pre-requisite**: Must be logged in as admin

**Steps**:
1. Navigate to `manageStudents.php`
2. Page should load with DataTable

**Test CREATE**:
```
1. Click "Add New Student"
2. Fill form with test data
3. Click "Add Student"
```

**Validation Points**:
- [ ] Modal opens with empty form
- [ ] All fields are editable
- [ ] Submit triggers API call
- [ ] Success message appears
- [ ] Table refreshes with new data
- [ ] Network tab shows POST to `backend/students.php?action=create`
- [ ] Database has new record: `SELECT * FROM students ORDER BY student_id DESC LIMIT 1;`

**Test EDIT**:
```
1. Click "Edit" on any student row
2. Modify name
3. Click "Update Student"
```

**Validation Points**:
- [ ] Modal opens with populated data
- [ ] Fields contain existing values
- [ ] Submit triggers update API
- [ ] Success message appears
- [ ] Table row updates instantly
- [ ] Network shows POST to `backend/students.php?action=update`
- [ ] Database record updated: `SELECT * FROM students WHERE student_id = ?;`

**Test DELETE**:
```
1. Click "Delete" on test student
2. Confirm in dialog
```

**Validation Points**:
- [ ] Confirmation dialog appears
- [ ] Clicking confirm triggers delete
- [ ] Success message appears
- [ ] Row disappears from table
- [ ] Network shows POST to `backend/students.php?action=delete`
- [ ] Database record removed

**Test SEARCH**:
```
1. Type in search box
2. Results filter in real-time
```

**Test PAGINATION**:
```
1. If >10 students, pagination appears
2. Click page 2
3. Different students load
```

---

#### Test 3.3: manageMentors.php
**Same testing procedure as manageStudents.php**

**Key Differences**:
- Expertise field (comma-separated)
- Bio field (textarea)
- API endpoint: `backend/mentors.php`

---

#### Test 3.4: studentsDashboard.php
**Pre-requisite**: Logged in as student

**Steps**:
1. Navigate to `studentsDashboard.php`

**Validation Points**:
- [ ] Welcome message shows student name
- [ ] Statistics cards display numbers:
  - Total Courses
  - Active Assignments  
  - Completion Rate
  - Average Score
- [ ] Recent courses section loads
- [ ] Upcoming tasks section loads
- [ ] Recent activities section loads
- [ ] Progress chart renders

**API Calls to Verify** (DevTools > Network):
```
✅ students.php?action=getProgress&student_id=X
✅ courses.php?action=getAll
✅ assignments.php?action=getAll
```

**Database Verification**:
```sql
-- Get student's enrollment data
SELECT * FROM course_enrollments WHERE student_id = ?;

-- Get student's assignments
SELECT * FROM assignment_submissions WHERE student_id = ?;
```

---

#### Test 3.5: mentorDashboard.php
**Pre-requisite**: Logged in as mentor

**Steps**:
1. Navigate to `mentorDashboard.php`

**Validation Points**:
- [ ] Welcome message shows mentor name
- [ ] Statistics cards display:
  - Total Students
  - Active Courses
  - Pending Assignments
  - Average Performance
- [ ] Courses list displays
- [ ] Charts render (if Chart.js loaded)

**API Calls**:
```
✅ mentors.php?action=getStats&mentor_id=X
✅ courses.php?action=getAll&mentor_id=X
```

---

### Test Suite 4: Session & Security

#### Test 4.1: Session Management
**Test Unauthenticated Access**:
```
1. Clear browser cookies/session
2. Try to access manageStudents.php directly
3. Should redirect to login.php
```

**Test Logout**:
```
1. Login successfully
2. Click logout button
3. Confirm in dialog
4. Should redirect to login.php
5. Try to go back to authenticated page
6. Should redirect to login again
```

**Validation Points**:
- [ ] `checkAuth()` runs on page load
- [ ] Redirects work correctly
- [ ] Session destroyed on logout
- [ ] Cannot access pages after logout

---

#### Test 4.2: Password Security
**Verification**:
```sql
-- Check password hashing
SELECT user_id, email, password FROM users LIMIT 3;
```

**Expected**: 
- Passwords should be bcrypt hashes (60 characters starting with `$2y$`)
- NOT plain text

---

### Test Suite 5: Error Handling

#### Test 5.1: Network Errors
**Simulate Server Down**:
```javascript
// In browser console
API.Student.getAll()
  .then(data => console.log(data))
  .catch(err => console.error('Should show error:', err));
```

**Expected**:
- Error message appears via SweetAlert2
- Console logs error details
- App doesn't crash

---

#### Test 5.2: Invalid Data
**Test Invalid Email**:
```
1. Try to create student with email: "notanemail"
2. Should show validation error
```

**Test Missing Required Fields**:
```
1. Try to submit form with empty required fields
2. Should show validation errors
```

---

### Test Suite 6: Database Integration

#### Test 6.1: CRUD Operations Persist
**Create**:
```sql
-- Before creating via UI
SELECT COUNT(*) FROM students;
-- Create student via UI
-- After creating
SELECT COUNT(*) FROM students; -- Should be +1
```

**Update**:
```sql
-- Before update
SELECT full_name FROM students WHERE student_id = ?;
-- Update via UI
-- After update
SELECT full_name FROM students WHERE student_id = ?; -- Should be changed
```

**Delete**:
```sql
-- Before delete
SELECT * FROM students WHERE student_id = ?;
-- Delete via UI
-- After delete  
SELECT * FROM students WHERE student_id = ?; -- Should return empty
```

---

### Test Suite 7: UI/UX Testing

#### Test 7.1: SweetAlert2 Notifications
**Success Messages**:
- [ ] Show on successful create
- [ ] Show on successful update
- [ ] Show on successful delete
- [ ] Show on successful login
- [ ] Green color, checkmark icon

**Error Messages**:
- [ ] Show on failed operations
- [ ] Show on validation errors
- [ ] Red color, error icon

**Confirmation Dialogs**:
- [ ] Show before delete
- [ ] Show before logout
- [ ] Have Cancel and Confirm buttons

---

#### Test 7.2: DataTables Functionality
**Features to Test**:
- [ ] Sorting (click column headers)
- [ ] Searching (type in search box)
- [ ] Pagination (if >10 records)
- [ ] Show entries dropdown
- [ ] Responsive design

---

## 📊 TEST RESULTS TEMPLATE

Use this template to document your testing:

```
=== SOWBERRY ACADEMY TESTING REPORT ===
Date: __________
Tested By: __________

✅ = Pass | ❌ = Fail | ⚠️ = Partial

BACKEND TESTS:
[ ] Database Connection: ___
[ ] Auth API: ___
[ ] Student API: ___
[ ] Mentor API: ___
[ ] Course API: ___
[ ] Assignment API: ___
[ ] Coding Practice API: ___
[ ] Category API: ___

FRONTEND TESTS:
[ ] api.js Loaded: ___
[ ] common.js Loaded: ___
[ ] SweetAlert2 Working: ___
[ ] jQuery Working: ___
[ ] DataTables Working: ___

PAGE TESTS:
[ ] login.php: ___
[ ] manageStudents.php: ___
[ ] manageMentors.php: ___
[ ] studentsDashboard.php: ___
[ ] mentorDashboard.php: ___

FUNCTIONALITY TESTS:
[ ] Login: ___
[ ] Logout: ___
[ ] Create Student: ___
[ ] Update Student: ___
[ ] Delete Student: ___
[ ] Create Mentor: ___
[ ] Update Mentor: ___
[ ] Delete Mentor: ___
[ ] Dashboard Loading: ___
[ ] Session Management: ___

SECURITY TESTS:
[ ] Password Hashing: ___
[ ] SQL Injection Prevention: ___
[ ] Session Validation: ___
[ ] Unauthorized Access Block: ___

UI/UX TESTS:
[ ] Success Notifications: ___
[ ] Error Notifications: ___
[ ] Confirmation Dialogs: ___
[ ] DataTables Rendering: ___
[ ] Responsive Design: ___

NOTES:
_________________________________
_________________________________
_________________________________

OVERALL STATUS: ___________
```

---

## 🚨 CRITICAL TEST SCENARIOS

### Scenario 1: First-Time Setup
```
1. Fresh database import
2. No users exist except default admin
3. Login with admin@sowberry.com / admin123
4. Create first student
5. Create first mentor
6. Logout and login as student
7. Logout and login as mentor
8. All should work smoothly
```

### Scenario 2: High Load (Multiple Records)
```
1. Create 50+ students via UI
2. Test DataTables pagination
3. Test search with large dataset
4. Test sorting
5. All should remain responsive
```

### Scenario 3: Error Recovery
```
1. Simulate network failure (disable wifi mid-operation)
2. App should show appropriate error
3. Reconnect network
4. Retry operation
5. Should work normally
```

---

## ✅ ACCEPTANCE CRITERIA

### Minimum Requirements for "VERIFIED"

#### Backend:
- ✅ All 8 API files respond
- ✅ Database connection successful
- ✅ All endpoints return valid JSON
- ✅ No PHP errors in error log

#### Frontend:
- ✅ All JS files load without errors
- ✅ SweetAlert2 notifications work
- ✅ DataTables render properly
- ✅ No console errors

#### Functionality:
- ✅ Login/Logout works
- ✅ CRUD operations complete successfully
- ✅ Dashboards load data
- ✅ Session management functional

#### Security:
- ✅ Passwords hashed
- ✅ SQL injection prevented
- ✅ Unauthorized access blocked
- ✅ Sessions expire properly

---

## 📞 TESTING SUPPORT

### If Tests Fail:

1. **Check Error Log**: `error_log` in PHP
2. **Browser Console**: F12 > Console tab
3. **Network Tab**: F12 > Network tab
4. **Database**: Run SQL queries to verify data
5. **Documentation**: Refer to `VERIFICATION_CHECKLIST.md`

### Common Fixes:

**Issue**: "API is not defined"  
**Fix**: Check `api.js` is loaded before other scripts

**Issue**: "Database connection failed"  
**Fix**: Verify MySQL is running and `sowberry` database exists

**Issue**: "404 on backend files"  
**Fix**: Check backend folder exists and has correct permissions

**Issue**: "SweetAlert not showing"  
**Fix**: Verify SweetAlert2 CDN is loaded (check network tab)

---

## 🎉 SUCCESS CRITERIA

**All Systems Operational When**:
- ✅ All test suites pass
- ✅ No critical errors
- ✅ Core functionality works
- ✅ Security measures active
- ✅ User experience smooth

**Status**: READY FOR PRODUCTION ✅

---

**Last Updated**: Now  
**Version**: 1.0.0  
**Maintained By**: Sowberry Academy Development Team
