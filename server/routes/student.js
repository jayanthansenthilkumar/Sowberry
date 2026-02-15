import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All student routes require authentication + student role
router.use(authenticate, authorize('student'));

// ──────────────── DASHBOARD ────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const studentId = req.user.id;

    const [enrolledCourses] = await pool.query('SELECT COUNT(*) as count FROM courseEnrollments WHERE studentId = ?', [studentId]);
    const [completedCourses] = await pool.query("SELECT COUNT(*) as count FROM courseEnrollments WHERE studentId = ? AND status = 'completed'", [studentId]);
    const [avgCompletion] = await pool.query('SELECT COALESCE(AVG(completionPercentage), 0) as avg FROM courseEnrollments WHERE studentId = ?', [studentId]);
    const [pendingAssignments] = await pool.query(`
      SELECT COUNT(*) as count FROM assignments a
      JOIN courses c ON a.courseId = c.id
      JOIN courseEnrollments ce ON ce.courseId = c.id
      WHERE ce.studentId = ? AND a.isPublished = 1
      AND a.id NOT IN (SELECT assignmentId FROM assignmentSubmissions WHERE studentId = ?)
    `, [studentId, studentId]);
    const [avgGrade] = await pool.query('SELECT COALESCE(AVG(percentage), 0) as avg FROM grades WHERE studentId = ?', [studentId]);

    // Current courses with progress
    const [currentCourses] = await pool.query(`
      SELECT c.title, c.category, c.image, ce.completionPercentage, ce.status, u.fullName as mentorName
      FROM courseEnrollments ce
      JOIN courses c ON ce.courseId = c.id
      JOIN users u ON c.mentorId = u.id
      WHERE ce.studentId = ?
      ORDER BY ce.enrolledAt DESC LIMIT 5
    `, [studentId]);

    // Upcoming assignments
    const [upcomingAssignments] = await pool.query(`
      SELECT a.id, a.title, a.dueDate, a.maxScore, c.title as courseTitle
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      JOIN courseEnrollments ce ON ce.courseId = c.id
      WHERE ce.studentId = ? AND a.isPublished = 1 AND a.dueDate > NOW()
      AND a.id NOT IN (SELECT assignmentId FROM assignmentSubmissions WHERE studentId = ?)
      ORDER BY a.dueDate ASC LIMIT 5
    `, [studentId, studentId]);

    // Upcoming events
    const [upcomingEvents] = await pool.query(`
      SELECT e.id, e.title, e.eventType, e.startDate, e.location, u.fullName as mentorName
      FROM events e
      JOIN users u ON e.mentorId = u.id
      WHERE e.isPublished = 1 AND e.startDate > NOW()
      ORDER BY e.startDate ASC LIMIT 5
    `, [studentId]);

    res.json({
      success: true,
      data: {
        stats: {
          enrolledCourses: enrolledCourses[0].count,
          completedCourses: completedCourses[0].count,
          avgCompletion: Math.round(avgCompletion[0].avg),
          pendingAssignments: pendingAssignments[0].count,
          avgGrade: Math.round(avgGrade[0].avg)
        },
        currentCourses,
        upcomingAssignments,
        upcomingEvents
      }
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── MY COURSES ────────────────
router.get('/courses', async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.*, ce.completionPercentage, ce.status as enrollmentStatus, ce.enrolledAt,
        u.fullName as mentorName,
        (SELECT COUNT(*) FROM courseEnrollments WHERE courseId = c.id) as totalStudents
      FROM courseEnrollments ce
      JOIN courses c ON ce.courseId = c.id
      JOIN users u ON c.mentorId = u.id
      WHERE ce.studentId = ?
      ORDER BY ce.enrolledAt DESC
    `, [req.user.id]);

    res.json({ success: true, data: { courses } });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Browse available courses
router.get('/courses/browse', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    let query = `
      SELECT c.*, u.fullName as mentorName,
        (SELECT COUNT(*) FROM courseEnrollments WHERE courseId = c.id) as totalStudents,
        (SELECT COUNT(*) FROM courseEnrollments WHERE courseId = c.id AND studentId = ?) as isEnrolled
      FROM courses c
      JOIN users u ON c.mentorId = u.id
      WHERE c.isPublished = 1
    `;
    const params = [req.user.id];

    if (category) { query += ' AND c.category = ?'; params.push(category); }
    if (difficulty) { query += ' AND c.difficulty = ?'; params.push(difficulty); }
    if (search) { query += ' AND (c.title LIKE ? OR c.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += ' ORDER BY c.createdAt DESC';
    const [courses] = await pool.query(query, params);

    res.json({ success: true, data: { courses } });
  } catch (error) {
    console.error('Browse courses error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Enroll in a course
router.post('/courses/:id/enroll', async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    // Check if already enrolled
    const [existing] = await pool.query(
      'SELECT id FROM courseEnrollments WHERE courseId = ? AND studentId = ?',
      [courseId, studentId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Already enrolled in this course.' });
    }

    // Check max students
    const [course] = await pool.query('SELECT maxStudents FROM courses WHERE id = ? AND isPublished = 1', [courseId]);
    if (course.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const [enrollCount] = await pool.query('SELECT COUNT(*) as count FROM courseEnrollments WHERE courseId = ?', [courseId]);
    if (enrollCount[0].count >= course[0].maxStudents) {
      return res.status(400).json({ success: false, message: 'Course is full.' });
    }

    await pool.query(
      'INSERT INTO courseEnrollments (courseId, studentId) VALUES (?, ?)',
      [courseId, studentId]
    );

    res.status(201).json({ success: true, message: 'Enrolled successfully!' });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Get course materials
router.get('/courses/:id/materials', async (req, res) => {
  try {
    // Verify student is enrolled
    const [enrollment] = await pool.query(
      'SELECT id FROM courseEnrollments WHERE courseId = ? AND studentId = ?',
      [req.params.id, req.user.id]
    );

    if (enrollment.length === 0) {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course.' });
    }

    const [materials] = await pool.query(
      'SELECT * FROM courseMaterials WHERE courseId = ? ORDER BY orderIndex',
      [req.params.id]
    );

    res.json({ success: true, data: { materials } });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── MY ASSIGNMENTS ────────────────
router.get('/assignments', async (req, res) => {
  try {
    const [assignments] = await pool.query(`
      SELECT a.*, c.title as courseTitle,
        asub.submittedAt, asub.score, asub.feedback, asub.id as submissionId
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      JOIN courseEnrollments ce ON ce.courseId = c.id
      LEFT JOIN assignmentSubmissions asub ON asub.assignmentId = a.id AND asub.studentId = ?
      WHERE ce.studentId = ? AND a.isPublished = 1
      ORDER BY a.dueDate ASC
    `, [req.user.id, req.user.id]);

    res.json({ success: true, data: { assignments } });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Submit an assignment
router.post('/assignments/:id/submit', async (req, res) => {
  try {
    const { content, fileUrl } = req.body;

    // Check if already submitted
    const [existing] = await pool.query(
      'SELECT id FROM assignmentSubmissions WHERE assignmentId = ? AND studentId = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length > 0) {
      // Update existing submission
      await pool.query(
        'UPDATE assignmentSubmissions SET content = ?, fileUrl = ?, submittedAt = NOW() WHERE assignmentId = ? AND studentId = ?',
        [content, fileUrl, req.params.id, req.user.id]
      );
      return res.json({ success: true, message: 'Submission updated successfully.' });
    }

    await pool.query(
      'INSERT INTO assignmentSubmissions (assignmentId, studentId, content, fileUrl) VALUES (?, ?, ?, ?)',
      [req.params.id, req.user.id, content, fileUrl]
    );

    res.status(201).json({ success: true, message: 'Assignment submitted successfully!' });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── MY GRADES ────────────────
router.get('/grades', async (req, res) => {
  try {
    const [grades] = await pool.query(`
      SELECT g.*, c.title as courseTitle, a.title as assignmentTitle, at.title as testTitle
      FROM grades g
      LEFT JOIN courses c ON g.courseId = c.id
      LEFT JOIN assignments a ON g.assignmentId = a.id
      LEFT JOIN aptitudeTests at ON g.testId = at.id
      WHERE g.studentId = ?
      ORDER BY g.gradedAt DESC
    `, [req.user.id]);

    // Calculate overall stats
    const [overallStats] = await pool.query(`
      SELECT
        COALESCE(AVG(percentage), 0) as avgPercentage,
        COUNT(*) as totalGrades,
        SUM(CASE WHEN percentage >= 90 THEN 1 ELSE 0 END) as excellentCount,
        SUM(CASE WHEN percentage >= 75 AND percentage < 90 THEN 1 ELSE 0 END) as goodCount,
        SUM(CASE WHEN percentage >= 50 AND percentage < 75 THEN 1 ELSE 0 END) as averageCount,
        SUM(CASE WHEN percentage < 50 THEN 1 ELSE 0 END) as needsImprovementCount
      FROM grades WHERE studentId = ?
    `, [req.user.id]);

    res.json({ success: true, data: { grades, stats: overallStats[0] } });
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── MY PROGRESS ────────────────
router.get('/progress', async (req, res) => {
  try {
    // Course progress
    const [courseProgress] = await pool.query(`
      SELECT c.title, c.category, ce.completionPercentage, ce.status, ce.enrolledAt, ce.completedAt
      FROM courseEnrollments ce
      JOIN courses c ON ce.courseId = c.id
      WHERE ce.studentId = ?
      ORDER BY ce.enrolledAt DESC
    `, [req.user.id]);

    // Assignment completion
    const [assignmentStats] = await pool.query(`
      SELECT
        COUNT(DISTINCT a.id) as totalAssignments,
        COUNT(DISTINCT asub.id) as submittedCount,
        COUNT(DISTINCT CASE WHEN asub.score IS NOT NULL THEN asub.id END) as gradedCount,
        COALESCE(AVG(CASE WHEN asub.score IS NOT NULL THEN (asub.score / a.maxScore * 100) END), 0) as avgScore
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      JOIN courseEnrollments ce ON ce.courseId = c.id
      LEFT JOIN assignmentSubmissions asub ON asub.assignmentId = a.id AND asub.studentId = ?
      WHERE ce.studentId = ? AND a.isPublished = 1
    `, [req.user.id, req.user.id]);

    // Aptitude test history
    const [aptitudeHistory] = await pool.query(`
      SELECT ata.*, at.title as testTitle, at.totalMarks as maxMarks
      FROM aptitudeTestAttempts ata
      JOIN aptitudeTests at ON ata.testId = at.id
      WHERE ata.studentId = ?
      ORDER BY ata.startedAt DESC
    `, [req.user.id]);

    // Coding submissions
    const [codingStats] = await pool.query(`
      SELECT
        COUNT(*) as totalSubmissions,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as acceptedCount,
        COUNT(DISTINCT problemId) as problemsAttempted
      FROM codingSubmissions WHERE studentId = ?
    `, [req.user.id]);

    // Compute overall progress
    const totalCourses = courseProgress.length;
    const completedCourses = courseProgress.filter(c => c.status === 'completed').length;
    const overallProgress = totalCourses > 0 ? Math.round(courseProgress.reduce((sum, c) => sum + (c.completionPercentage || 0), 0) / totalCourses) : 0;

    res.json({
      success: true,
      data: {
        progress: courseProgress,
        overall: { totalCourses, completedCourses, overallProgress },
        assignmentStats: assignmentStats[0],
        aptitudeHistory,
        codingStats: codingStats[0]
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── CODING PRACTICE ────────────────
router.get('/coding-problems', async (req, res) => {
  try {
    const { difficulty, category } = req.query;

    let query = `
      SELECT cp.id, cp.title, cp.description, cp.difficulty, cp.category, cp.sampleInput, cp.sampleOutput,
        (SELECT COUNT(*) FROM codingSubmissions WHERE problemId = cp.id AND studentId = ?) as mySubmissions,
        (SELECT status FROM codingSubmissions WHERE problemId = cp.id AND studentId = ? ORDER BY submittedAt DESC LIMIT 1) as lastStatus
      FROM codingProblems cp
      WHERE 1=1
    `;
    const params = [req.user.id, req.user.id];

    if (difficulty) { query += ' AND cp.difficulty = ?'; params.push(difficulty); }
    if (category) { query += ' AND cp.category = ?'; params.push(category); }

    query += ' ORDER BY FIELD(cp.difficulty, "easy", "medium", "hard"), cp.createdAt DESC';
    const [problems] = await pool.query(query, params);

    res.json({ success: true, data: { problems } });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.get('/coding-problems/:id', async (req, res) => {
  try {
    const [problems] = await pool.query(
      'SELECT * FROM codingProblems WHERE id = ?',
      [req.params.id]
    );

    if (problems.length === 0) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    const [submissions] = await pool.query(
      'SELECT id, language, status, executionTime, memory, submittedAt FROM codingSubmissions WHERE problemId = ? AND studentId = ? ORDER BY submittedAt DESC',
      [req.params.id, req.user.id]
    );

    res.json({ success: true, data: { problem: problems[0], submissions } });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Submit code
router.post('/coding-problems/:id/submit', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Code is required.' });
    }

    // Simple status for now (in production, integrate with a code execution service)
    const [result] = await pool.query(
      'INSERT INTO codingSubmissions (problemId, studentId, code, language, status) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, req.user.id, code, language || 'javascript', 'pending']
    );

    res.status(201).json({ success: true, message: 'Code submitted successfully!', data: { id: result.insertId } });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── APTITUDE TESTS ────────────────
router.get('/aptitude-tests', async (req, res) => {
  try {
    const [tests] = await pool.query(`
      SELECT at.*, u.fullName as mentorName,
        (SELECT COUNT(*) FROM aptitudeTestAttempts WHERE testId = at.id AND studentId = ?) as myAttempts,
        (SELECT score FROM aptitudeTestAttempts WHERE testId = at.id AND studentId = ? ORDER BY startedAt DESC LIMIT 1) as lastScore
      FROM aptitudeTests at
      JOIN users u ON at.mentorId = u.id
      WHERE at.isPublished = 1
      ORDER BY at.createdAt DESC
    `, [req.user.id, req.user.id]);

    res.json({ success: true, data: { tests } });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Start an aptitude test attempt
router.post('/aptitude-tests/:id/start', async (req, res) => {
  try {
    const testId = req.params.id;

    const [test] = await pool.query('SELECT * FROM aptitudeTests WHERE id = ? AND isPublished = 1', [testId]);
    if (test.length === 0) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    const [result] = await pool.query(
      "INSERT INTO aptitudeTestAttempts (testId, studentId, totalMarks, status) VALUES (?, ?, ?, 'inProgress')",
      [testId, req.user.id, test[0].totalMarks]
    );

    const [questions] = await pool.query(
      'SELECT id, question, optionA, optionB, optionC, optionD, marks, orderIndex FROM aptitudeQuestions WHERE testId = ? ORDER BY orderIndex',
      [testId]
    );

    res.status(201).json({
      success: true,
      data: {
        attemptId: result.insertId,
        test: { title: test[0].title, duration: test[0].duration, totalMarks: test[0].totalMarks },
        questions
      }
    });
  } catch (error) {
    console.error('Start test error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Submit aptitude test answers
router.post('/aptitude-tests/:attemptId/submit', async (req, res) => {
  try {
    const { answers } = req.body; // [{questionId, selectedOption}]

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers are required.' });
    }

    let totalScore = 0;

    for (const answer of answers) {
      const [question] = await pool.query(
        'SELECT correctOption, marks FROM aptitudeQuestions WHERE id = ?',
        [answer.questionId]
      );

      const isCorrect = question.length > 0 && question[0].correctOption === answer.selectedOption;
      if (isCorrect) totalScore += question[0].marks;

      await pool.query(
        'INSERT INTO aptitudeAnswers (attemptId, questionId, selectedOption, isCorrect) VALUES (?, ?, ?, ?)',
        [req.params.attemptId, answer.questionId, answer.selectedOption, isCorrect ? 1 : 0]
      );
    }

    // Update attempt
    await pool.query(
      "UPDATE aptitudeTestAttempts SET score = ?, completedAt = NOW(), status = 'completed' WHERE id = ? AND studentId = ?",
      [totalScore, req.params.attemptId, req.user.id]
    );

    // Get attempt details for grade record
    const [attempt] = await pool.query('SELECT testId, totalMarks FROM aptitudeTestAttempts WHERE id = ?', [req.params.attemptId]);
    if (attempt.length > 0) {
      const percentage = (totalScore / attempt[0].totalMarks) * 100;
      await pool.query(
        'INSERT INTO grades (studentId, testId, gradeType, score, maxScore, percentage) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.id, attempt[0].testId, 'aptitude', totalScore, attempt[0].totalMarks, percentage]
      );
    }

    res.json({
      success: true,
      message: 'Test submitted successfully!',
      data: { score: totalScore, totalMarks: attempt[0]?.totalMarks || 0 }
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── STUDY MATERIALS ────────────────
router.get('/study-materials', async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT sm.*, c.title as courseTitle, u.fullName as mentorName
      FROM studyMaterials sm
      LEFT JOIN courses c ON sm.courseId = c.id
      JOIN users u ON sm.mentorId = u.id
      WHERE sm.courseId IN (SELECT courseId FROM courseEnrollments WHERE studentId = ?)
         OR sm.courseId IS NULL
    `;
    const params = [req.user.id];

    if (category) { query += ' AND sm.category = ?'; params.push(category); }
    query += ' ORDER BY sm.createdAt DESC';

    const [materials] = await pool.query(query, params);
    res.json({ success: true, data: { materials } });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── EVENTS ────────────────
router.get('/events', async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT e.*, u.fullName as mentorName,
        (SELECT COUNT(*) FROM eventRegistrations WHERE eventId = e.id) as registrationCount,
        (SELECT COUNT(*) FROM eventRegistrations WHERE eventId = e.id AND studentId = ?) as isRegistered
      FROM events e
      JOIN users u ON e.mentorId = u.id
      WHERE e.isPublished = 1
      ORDER BY e.startDate ASC
    `, [req.user.id]);

    res.json({ success: true, data: { events } });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Register for an event
router.post('/events/:id/register', async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM eventRegistrations WHERE eventId = ? AND studentId = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Already registered for this event.' });
    }

    await pool.query(
      'INSERT INTO eventRegistrations (eventId, studentId) VALUES (?, ?)',
      [req.params.id, req.user.id]
    );

    res.status(201).json({ success: true, message: 'Registered for event successfully!' });
  } catch (error) {
    console.error('Register event error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── DISCUSSIONS ────────────────
router.get('/discussions', async (req, res) => {
  try {
    const [discussions] = await pool.query(`
      SELECT d.*, c.title as courseTitle, u.fullName as authorName, u.role as authorRole,
        (SELECT COUNT(*) FROM discussionReplies WHERE discussionId = d.id) as replyCount
      FROM discussions d
      LEFT JOIN courses c ON d.courseId = c.id
      JOIN users u ON d.userId = u.id
      WHERE d.courseId IN (SELECT courseId FROM courseEnrollments WHERE studentId = ?)
         OR d.courseId IS NULL
      ORDER BY d.createdAt DESC
    `, [req.user.id]);

    res.json({ success: true, data: { discussions } });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/discussions/:id/reply', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Content is required.' });

    await pool.query(
      'INSERT INTO discussionReplies (discussionId, userId, content) VALUES (?, ?, ?)',
      [req.params.id, req.user.id, content]
    );

    res.status(201).json({ success: true, message: 'Reply posted successfully.' });
  } catch (error) {
    console.error('Reply error:', error);
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

export default router;
