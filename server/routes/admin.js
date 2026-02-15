import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

// ──────────────── DASHBOARD STATS ────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const [totalStudents] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const [totalMentors] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'mentor'");
    const [totalCourses] = await pool.query("SELECT COUNT(*) as count FROM courses");
    const [totalEnrollments] = await pool.query("SELECT COUNT(*) as count FROM courseEnrollments");
    const [avgCompletion] = await pool.query("SELECT COALESCE(AVG(completionPercentage), 0) as avg FROM courseEnrollments");
    const [pendingVerifications] = await pool.query("SELECT COUNT(*) as count FROM users WHERE isVerified = 0 AND role = 'student'");
    const [activeStudents] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND isActive = 1");
    const [contactUnread] = await pool.query("SELECT COUNT(*) as count FROM contactMessages WHERE isRead = 0");

    // Monthly enrollment trends (last 6 months)
    const [enrollmentTrends] = await pool.query(`
      SELECT DATE_FORMAT(enrolledAt, '%Y-%m') as month, COUNT(*) as count
      FROM courseEnrollments
      WHERE enrolledAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month ORDER BY month
    `);

    // Recent activities
    const [recentActivities] = await pool.query(`
      SELECT al.*, u.fullName, u.role as userRole
      FROM activityLogs al
      LEFT JOIN users u ON al.userId = u.id
      ORDER BY al.createdAt DESC LIMIT 10
    `);

    // Recent registrations
    const [recentRegistrations] = await pool.query(`
      SELECT id, fullName, email, role, isVerified, createdAt
      FROM users
      ORDER BY createdAt DESC LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents: totalStudents[0].count,
          totalMentors: totalMentors[0].count,
          totalCourses: totalCourses[0].count,
          totalEnrollments: totalEnrollments[0].count,
          avgCompletion: Math.round(avgCompletion[0].avg),
          pendingVerifications: pendingVerifications[0].count,
          activeStudents: activeStudents[0].count,
          unreadMessages: contactUnread[0].count
        },
        enrollmentTrends,
        recentActivities,
        recentRegistrations
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── MANAGE STUDENTS ────────────────
// List all students
router.get('/students', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT id, email, username, fullName, phone, countryCode, profileImage, isVerified, isActive, createdAt FROM users WHERE role = 'student'";
    const params = [];

    if (search) {
      query += ' AND (fullName LIKE ? OR email LIKE ? OR username LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status === 'active') { query += ' AND isActive = 1'; }
    if (status === 'inactive') { query += ' AND isActive = 0'; }
    if (status === 'unverified') { query += ' AND isVerified = 0'; }

    const [countResult] = await pool.query(query.replace('SELECT id, email, username, fullName, phone, countryCode, profileImage, isVerified, isActive, createdAt', 'SELECT COUNT(*) as total'), params);

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [students] = await pool.query(query, params);

    // Get enrollment counts per student
    for (const student of students) {
      const [enrollments] = await pool.query(
        'SELECT COUNT(*) as count FROM courseEnrollments WHERE studentId = ?',
        [student.id]
      );
      student.enrolledCourses = enrollments[0].count;
    }

    res.json({
      success: true,
      data: { students, total: countResult[0].total, page: Number(page), limit: Number(limit) }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Get single student
router.get('/students/:id', async (req, res) => {
  try {
    const [students] = await pool.query(
      "SELECT id, email, username, fullName, phone, countryCode, profileImage, isVerified, isActive, createdAt FROM users WHERE id = ? AND role = 'student'",
      [req.params.id]
    );

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Get enrollments
    const [enrollments] = await pool.query(`
      SELECT ce.*, c.title as courseTitle, c.category
      FROM courseEnrollments ce
      JOIN courses c ON ce.courseId = c.id
      WHERE ce.studentId = ?
    `, [req.params.id]);

    // Get grades
    const [grades] = await pool.query(`
      SELECT g.*, c.title as courseTitle
      FROM grades g
      LEFT JOIN courses c ON g.courseId = c.id
      WHERE g.studentId = ?
      ORDER BY g.gradedAt DESC
    `, [req.params.id]);

    res.json({
      success: true,
      data: { student: students[0], enrollments, grades }
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Create student (admin-created)
router.post('/students', async (req, res) => {
  try {
    const { email, username, fullName, password, phone, countryCode } = req.body;

    if (!email || !username || !fullName || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email.toLowerCase(), username.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email or username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (email, username, fullName, password, phone, countryCode, role, isVerified, isActive)
       VALUES (?, ?, ?, ?, ?, ?, 'student', 1, 1)`,
      [email.toLowerCase(), username.toLowerCase(), fullName, hashedPassword, phone || null, countryCode || '+91']
    );

    await pool.query('INSERT INTO activityLogs (userId, action, description) VALUES (?, ?, ?)',
      [req.user.id, 'admin_create_student', `Admin created student: ${fullName}`]);

    res.status(201).json({ success: true, message: 'Student created successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Update student
router.put('/students/:id', async (req, res) => {
  try {
    const { fullName, phone, isActive, isVerified } = req.body;

    await pool.query(
      'UPDATE users SET fullName = COALESCE(?, fullName), phone = COALESCE(?, phone), isActive = COALESCE(?, isActive), isVerified = COALESCE(?, isVerified) WHERE id = ? AND role = ?',
      [fullName, phone, isActive, isVerified, req.params.id, 'student']
    );

    res.json({ success: true, message: 'Student updated successfully.' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Delete student
router.delete('/students/:id', async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = ? AND role = 'student'", [req.params.id]);
    res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── MANAGE MENTORS ────────────────
router.get('/mentors', async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT id, email, username, fullName, phone, profileImage, isVerified, isActive, createdAt FROM users WHERE role = 'mentor'";
    const params = [];

    if (search) {
      query += ' AND (fullName LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM'), params);

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [mentors] = await pool.query(query, params);

    // Get course counts per mentor
    for (const mentor of mentors) {
      const [courses] = await pool.query('SELECT COUNT(*) as count FROM courses WHERE mentorId = ?', [mentor.id]);
      mentor.totalCourses = courses[0].count;

      const [students] = await pool.query(`
        SELECT COUNT(DISTINCT ce.studentId) as count
        FROM courseEnrollments ce
        JOIN courses c ON ce.courseId = c.id
        WHERE c.mentorId = ?
      `, [mentor.id]);
      mentor.totalStudents = students[0].count;
    }

    res.json({
      success: true,
      data: { mentors, total: countResult[0].total, page: Number(page), limit: Number(limit) }
    });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.get('/mentors/:id', async (req, res) => {
  try {
    const [mentors] = await pool.query(
      "SELECT id, email, username, fullName, phone, profileImage, isVerified, isActive, createdAt FROM users WHERE id = ? AND role = 'mentor'",
      [req.params.id]
    );

    if (mentors.length === 0) {
      return res.status(404).json({ success: false, message: 'Mentor not found.' });
    }

    const [courses] = await pool.query('SELECT * FROM courses WHERE mentorId = ?', [req.params.id]);

    res.json({ success: true, data: { mentor: mentors[0], courses } });
  } catch (error) {
    console.error('Get mentor error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/mentors', async (req, res) => {
  try {
    const { email, username, fullName, password, phone, countryCode } = req.body;

    if (!email || !username || !fullName || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email.toLowerCase(), username.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email or username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (email, username, fullName, password, phone, countryCode, role, isVerified, isActive)
       VALUES (?, ?, ?, ?, ?, ?, 'mentor', 1, 1)`,
      [email.toLowerCase(), username.toLowerCase(), fullName, hashedPassword, phone || null, countryCode || '+91']
    );

    await pool.query('INSERT INTO activityLogs (userId, action, description) VALUES (?, ?, ?)',
      [req.user.id, 'admin_create_mentor', `Admin created mentor: ${fullName}`]);

    res.status(201).json({ success: true, message: 'Mentor created successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create mentor error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/mentors/:id', async (req, res) => {
  try {
    const { fullName, phone, isActive, isVerified } = req.body;
    await pool.query(
      'UPDATE users SET fullName = COALESCE(?, fullName), phone = COALESCE(?, phone), isActive = COALESCE(?, isActive), isVerified = COALESCE(?, isVerified) WHERE id = ? AND role = ?',
      [fullName, phone, isActive, isVerified, req.params.id, 'mentor']
    );
    res.json({ success: true, message: 'Mentor updated successfully.' });
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/mentors/:id', async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = ? AND role = 'mentor'", [req.params.id]);
    res.json({ success: true, message: 'Mentor deleted successfully.' });
  } catch (error) {
    console.error('Delete mentor error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── COURSES OVERVIEW ────────────────
router.get('/courses', async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.*, u.fullName as mentorName,
        (SELECT COUNT(*) FROM courseEnrollments WHERE courseId = c.id) as enrollmentCount,
        (SELECT COALESCE(AVG(completionPercentage), 0) FROM courseEnrollments WHERE courseId = c.id) as avgCompletion
      FROM courses c
      JOIN users u ON c.mentorId = u.id
      ORDER BY c.createdAt DESC
    `);

    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── PERFORMANCE ANALYTICS ────────────────
router.get('/analytics', async (req, res) => {
  try {
    // Course completion rates
    const [courseCompletion] = await pool.query(`
      SELECT c.title, c.category,
        COUNT(ce.id) as totalEnrolled,
        SUM(CASE WHEN ce.status = 'completed' THEN 1 ELSE 0 END) as completedCount,
        COALESCE(AVG(ce.completionPercentage), 0) as avgCompletion
      FROM courses c
      LEFT JOIN courseEnrollments ce ON c.id = ce.courseId
      GROUP BY c.id
      ORDER BY avgCompletion DESC
    `);

    // Top performing students
    const [topStudents] = await pool.query(`
      SELECT u.fullName, u.email,
        COUNT(ce.id) as enrolledCourses,
        COALESCE(AVG(ce.completionPercentage), 0) as avgCompletion
      FROM users u
      LEFT JOIN courseEnrollments ce ON u.id = ce.studentId
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY avgCompletion DESC
      LIMIT 10
    `);

    // Mentor stats
    const [mentorStats] = await pool.query(`
      SELECT u.fullName,
        COUNT(DISTINCT c.id) as totalCourses,
        COUNT(DISTINCT ce.studentId) as totalStudents,
        COALESCE(AVG(c.rating), 0) as avgRating
      FROM users u
      LEFT JOIN courses c ON u.id = c.mentorId
      LEFT JOIN courseEnrollments ce ON c.id = ce.courseId
      WHERE u.role = 'mentor'
      GROUP BY u.id
      ORDER BY avgRating DESC
    `);

    // Monthly registration trends
    const [registrationTrends] = await pool.query(`
      SELECT DATE_FORMAT(createdAt, '%Y-%m') as month,
        SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as students,
        SUM(CASE WHEN role = 'mentor' THEN 1 ELSE 0 END) as mentors
      FROM users
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY month ORDER BY month
    `);

    res.json({
      success: true,
      data: { courseCompletion, topStudents, mentorStats, registrationTrends }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── SYSTEM REPORTS ────────────────
router.get('/reports', async (req, res) => {
  try {
    const [activityLogs] = await pool.query(`
      SELECT al.*, u.fullName, u.role as userRole
      FROM activityLogs al
      LEFT JOIN users u ON al.userId = u.id
      ORDER BY al.createdAt DESC LIMIT 50
    `);

    const [userStats] = await pool.query(`
      SELECT role, COUNT(*) as count, SUM(isActive) as activeCount, SUM(isVerified) as verifiedCount
      FROM users GROUP BY role
    `);

    const [contactMessages] = await pool.query(`
      SELECT * FROM contactMessages ORDER BY createdAt DESC LIMIT 20
    `);

    res.json({
      success: true,
      data: { activityLogs, userStats, contactMessages }
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── SETTINGS ────────────────
router.get('/settings', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM systemSettings');
    const settingsObj = {};
    settings.forEach(s => { settingsObj[s.settingKey] = s.settingValue; });
    res.json({ success: true, data: settingsObj });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO systemSettings (settingKey, settingValue) VALUES (?, ?) ON DUPLICATE KEY UPDATE settingValue = ?',
        [key, value, value]
      );
    }
    res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── NOTIFICATIONS ────────────────
router.get('/notifications', async (req, res) => {
  try {
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 20',
      [req.user.id]
    );
    const [unreadCount] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = 0',
      [req.user.id]
    );
    res.json({ success: true, data: { notifications, unreadCount: unreadCount[0].count } });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/notifications/read-all', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET isRead = 1 WHERE userId = ?', [req.user.id]);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── CONTACT MESSAGES ────────────────
router.get('/contact-messages', async (req, res) => {
  try {
    const [messages] = await pool.query('SELECT * FROM contactMessages ORDER BY createdAt DESC');
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/contact-messages/:id/read', async (req, res) => {
  try {
    await pool.query('UPDATE contactMessages SET isRead = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Message marked as read.' });
  } catch (error) {
    console.error('Mark message error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;
