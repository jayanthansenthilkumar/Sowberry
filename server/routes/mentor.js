import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All mentor routes require authentication + mentor or admin role
router.use(authenticate, authorize('mentor', 'admin'));

// ──────────────── DASHBOARD ────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const mentorId = req.user.id;

    const [totalCourses] = await pool.query('SELECT COUNT(*) as count FROM courses WHERE mentorId = ?', [mentorId]);
    const [totalStudents] = await pool.query(`
      SELECT COUNT(DISTINCT ce.studentId) as count
      FROM courseEnrollments ce
      JOIN courses c ON ce.courseId = c.id
      WHERE c.mentorId = ?
    `, [mentorId]);
    const [totalAssignments] = await pool.query('SELECT COUNT(*) as count FROM assignments WHERE mentorId = ?', [mentorId]);
    const [pendingSubmissions] = await pool.query(`
      SELECT COUNT(*) as count FROM assignmentSubmissions asub
      JOIN assignments a ON asub.assignmentId = a.id
      WHERE a.mentorId = ? AND asub.score IS NULL
    `, [mentorId]);
    const [totalEvents] = await pool.query('SELECT COUNT(*) as count FROM events WHERE mentorId = ?', [mentorId]);
    const [avgCompletion] = await pool.query(`
      SELECT COALESCE(AVG(ce.completionPercentage), 0) as avg
      FROM courseEnrollments ce
      JOIN courses c ON ce.courseId = c.id
      WHERE c.mentorId = ?
    `, [mentorId]);

    // Recent submissions
    const [recentSubmissions] = await pool.query(`
      SELECT asub.*, a.title as assignmentTitle, u.fullName as studentName
      FROM assignmentSubmissions asub
      JOIN assignments a ON asub.assignmentId = a.id
      JOIN users u ON asub.studentId = u.id
      WHERE a.mentorId = ?
      ORDER BY asub.submittedAt DESC LIMIT 5
    `, [mentorId]);

    // Upcoming events
    const [upcomingEvents] = await pool.query(`
      SELECT e.*, (SELECT COUNT(*) FROM eventRegistrations WHERE eventId = e.id) as registrationCount
      FROM events e
      WHERE e.mentorId = ? AND e.startDate > NOW()
      ORDER BY e.startDate ASC LIMIT 5
    `, [mentorId]);

    res.json({
      success: true,
      data: {
        stats: {
          totalCourses: totalCourses[0].count,
          totalStudents: totalStudents[0].count,
          totalAssignments: totalAssignments[0].count,
          pendingSubmissions: pendingSubmissions[0].count,
          totalEvents: totalEvents[0].count,
          avgCompletion: Math.round(avgCompletion[0].avg)
        },
        recentSubmissions,
        upcomingEvents
      }
    });
  } catch (error) {
    console.error('Mentor dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── COURSES (CRUD) ────────────────
router.get('/courses', async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.*,
        (SELECT COUNT(*) FROM courseEnrollments WHERE courseId = c.id) as enrollmentCount,
        (SELECT COALESCE(AVG(completionPercentage), 0) FROM courseEnrollments WHERE courseId = c.id) as avgCompletion
      FROM courses c
      WHERE c.mentorId = ?
      ORDER BY c.createdAt DESC
    `, [req.user.id]);

    res.json({ success: true, data: { courses } });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/courses', async (req, res) => {
  try {
    const { title, description, image, duration, category, difficulty, maxStudents } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Course title is required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO courses (title, description, image, duration, mentorId, category, difficulty, maxStudents) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, image, duration, req.user.id, category, difficulty || 'beginner', maxStudents || 100]
    );

    res.status(201).json({ success: true, message: 'Course created successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/courses/:id', async (req, res) => {
  try {
    const { title, description, image, duration, category, difficulty, maxStudents, isPublished } = req.body;

    await pool.query(
      `UPDATE courses SET title = COALESCE(?, title), description = COALESCE(?, description), image = COALESCE(?, image),
       duration = COALESCE(?, duration), category = COALESCE(?, category), difficulty = COALESCE(?, difficulty),
       maxStudents = COALESCE(?, maxStudents), isPublished = COALESCE(?, isPublished) WHERE id = ? AND mentorId = ?`,
      [title, description, image, duration, category, difficulty, maxStudents, isPublished, req.params.id, req.user.id]
    );

    res.json({ success: true, message: 'Course updated successfully.' });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id = ? AND mentorId = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── ASSIGNMENTS (CRUD) ────────────────
router.get('/assignments', async (req, res) => {
  try {
    const [assignments] = await pool.query(`
      SELECT a.*, c.title as courseTitle,
        (SELECT COUNT(*) FROM assignmentSubmissions WHERE assignmentId = a.id) as submissionCount,
        (SELECT COUNT(*) FROM assignmentSubmissions WHERE assignmentId = a.id AND score IS NOT NULL) as gradedCount
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      WHERE a.mentorId = ?
      ORDER BY a.createdAt DESC
    `, [req.user.id]);

    res.json({ success: true, data: { assignments } });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/assignments', async (req, res) => {
  try {
    const { courseId, title, description, dueDate, maxScore } = req.body;

    if (!courseId || !title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Course, title, and due date are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO assignments (courseId, mentorId, title, description, dueDate, maxScore, isPublished) VALUES (?, ?, ?, ?, ?, ?, 1)',
      [courseId, req.user.id, title, description, dueDate, maxScore || 100]
    );

    res.status(201).json({ success: true, message: 'Assignment created successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/assignments/:id', async (req, res) => {
  try {
    const { title, description, dueDate, maxScore, isPublished } = req.body;

    await pool.query(
      `UPDATE assignments SET title = COALESCE(?, title), description = COALESCE(?, description),
       dueDate = COALESCE(?, dueDate), maxScore = COALESCE(?, maxScore), isPublished = COALESCE(?, isPublished)
       WHERE id = ? AND mentorId = ?`,
      [title, description, dueDate, maxScore, isPublished, req.params.id, req.user.id]
    );

    res.json({ success: true, message: 'Assignment updated successfully.' });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/assignments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM assignments WHERE id = ? AND mentorId = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Assignment deleted successfully.' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Grade a submission
router.put('/submissions/:id/grade', async (req, res) => {
  try {
    const { score, feedback } = req.body;

    await pool.query(
      'UPDATE assignmentSubmissions SET score = ?, feedback = ?, gradedAt = NOW(), gradedBy = ? WHERE id = ?',
      [score, feedback, req.user.id, req.params.id]
    );

    // Also insert to grades table
    const [submission] = await pool.query(`
      SELECT asub.*, a.courseId, a.maxScore FROM assignmentSubmissions asub
      JOIN assignments a ON asub.assignmentId = a.id WHERE asub.id = ?
    `, [req.params.id]);

    if (submission.length > 0) {
      const s = submission[0];
      const percentage = (score / s.maxScore) * 100;
      await pool.query(
        'INSERT INTO grades (studentId, courseId, assignmentId, gradeType, score, maxScore, percentage) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [s.studentId, s.courseId, s.assignmentId, 'assignment', score, s.maxScore, percentage]
      );
    }

    res.json({ success: true, message: 'Submission graded successfully.' });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Get submissions for an assignment
router.get('/assignments/:id/submissions', async (req, res) => {
  try {
    const [submissions] = await pool.query(`
      SELECT asub.*, u.fullName as studentName, u.email as studentEmail
      FROM assignmentSubmissions asub
      JOIN users u ON asub.studentId = u.id
      WHERE asub.assignmentId = ?
      ORDER BY asub.submittedAt DESC
    `, [req.params.id]);

    res.json({ success: true, data: { submissions } });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── STUDENT PROGRESS ────────────────
router.get('/students-progress', async (req, res) => {
  try {
    const [students] = await pool.query(`
      SELECT DISTINCT u.id, u.fullName, u.email, u.profileImage,
        COALESCE(AVG(ce.completionPercentage), 0) as avgCompletion,
        COUNT(DISTINCT ce.courseId) as enrolledCourses,
        (SELECT COUNT(*) FROM assignmentSubmissions asub
         JOIN assignments a ON asub.assignmentId = a.id
         WHERE asub.studentId = u.id AND a.mentorId = ?) as totalSubmissions
      FROM users u
      JOIN courseEnrollments ce ON u.id = ce.studentId
      JOIN courses c ON ce.courseId = c.id
      WHERE c.mentorId = ? AND u.role = 'student'
      GROUP BY u.id
      ORDER BY avgCompletion DESC
    `, [req.user.id, req.user.id]);

    res.json({ success: true, data: { students } });
  } catch (error) {
    console.error('Students progress error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── CODING PROBLEMS ────────────────
router.get('/problems', async (req, res) => {
  try {
    const [problems] = await pool.query(`
      SELECT cp.*,
        (SELECT COUNT(*) FROM codingSubmissions WHERE problemId = cp.id) as submissionCount,
        (SELECT COUNT(*) FROM codingSubmissions WHERE problemId = cp.id AND status = 'accepted') as acceptedCount
      FROM codingProblems cp
      WHERE cp.mentorId = ?
      ORDER BY cp.createdAt DESC
    `, [req.user.id]);

    res.json({ success: true, data: { problems } });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/problems', async (req, res) => {
  try {
    const { title, description, difficulty, category, inputFormat, outputFormat, constraints, sampleInput, sampleOutput, testCases } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO codingProblems (mentorId, title, description, difficulty, category, inputFormat, outputFormat, constraints, sampleInput, sampleOutput, testCases)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, description, difficulty || 'easy', category, inputFormat, outputFormat, constraints, sampleInput, sampleOutput, JSON.stringify(testCases || [])]
    );

    res.status(201).json({ success: true, message: 'Problem created successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/problems/:id', async (req, res) => {
  try {
    const { title, description, difficulty, category, inputFormat, outputFormat, constraints, sampleInput, sampleOutput, testCases } = req.body;

    await pool.query(
      `UPDATE codingProblems SET title = COALESCE(?, title), description = COALESCE(?, description),
       difficulty = COALESCE(?, difficulty), category = COALESCE(?, category),
       inputFormat = COALESCE(?, inputFormat), outputFormat = COALESCE(?, outputFormat),
       constraints = COALESCE(?, constraints), sampleInput = COALESCE(?, sampleInput),
       sampleOutput = COALESCE(?, sampleOutput), testCases = COALESCE(?, testCases)
       WHERE id = ? AND mentorId = ?`,
      [title, description, difficulty, category, inputFormat, outputFormat, constraints, sampleInput, sampleOutput,
       testCases ? JSON.stringify(testCases) : null, req.params.id, req.user.id]
    );

    res.json({ success: true, message: 'Problem updated successfully.' });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/problems/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM codingProblems WHERE id = ? AND mentorId = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Problem deleted successfully.' });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── APTITUDE TESTS ────────────────
router.get('/aptitude-tests', async (req, res) => {
  try {
    const [tests] = await pool.query(`
      SELECT at.*,
        (SELECT COUNT(*) FROM aptitudeQuestions WHERE testId = at.id) as questionCount,
        (SELECT COUNT(*) FROM aptitudeTestAttempts WHERE testId = at.id) as attemptCount
      FROM aptitudeTests at
      WHERE at.mentorId = ?
      ORDER BY at.createdAt DESC
    `, [req.user.id]);

    res.json({ success: true, data: { tests } });
  } catch (error) {
    console.error('Get aptitude tests error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/aptitude-tests', async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Test title is required.' });
    }

    const totalQuestions = questions ? questions.length : 0;
    const totalMarks = questions ? questions.reduce((sum, q) => sum + (q.marks || 1), 0) : 0;

    const [result] = await pool.query(
      'INSERT INTO aptitudeTests (mentorId, title, description, duration, totalQuestions, totalMarks, isPublished) VALUES (?, ?, ?, ?, ?, ?, 1)',
      [req.user.id, title, description, duration || 30, totalQuestions, totalMarks]
    );

    // Insert questions
    if (questions && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await pool.query(
          'INSERT INTO aptitudeQuestions (testId, question, optionA, optionB, optionC, optionD, correctOption, marks, explanation, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [result.insertId, q.question, q.optionA, q.optionB, q.optionC, q.optionD, q.correctOption, q.marks || 1, q.explanation, i + 1]
        );
      }
    }

    res.status(201).json({ success: true, message: 'Aptitude test created successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create aptitude test error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.get('/aptitude-tests/:id', async (req, res) => {
  try {
    const [tests] = await pool.query('SELECT * FROM aptitudeTests WHERE id = ? AND mentorId = ?', [req.params.id, req.user.id]);
    if (tests.length === 0) return res.status(404).json({ success: false, message: 'Test not found.' });

    const [questions] = await pool.query('SELECT * FROM aptitudeQuestions WHERE testId = ? ORDER BY orderIndex', [req.params.id]);
    const [attempts] = await pool.query(`
      SELECT ata.*, u.fullName as studentName
      FROM aptitudeTestAttempts ata
      JOIN users u ON ata.studentId = u.id
      WHERE ata.testId = ?
      ORDER BY ata.startedAt DESC
    `, [req.params.id]);

    res.json({ success: true, data: { test: tests[0], questions, attempts } });
  } catch (error) {
    console.error('Get aptitude test error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/aptitude-tests/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM aptitudeTests WHERE id = ? AND mentorId = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Aptitude test deleted successfully.' });
  } catch (error) {
    console.error('Delete aptitude test error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── EVENTS ────────────────
router.get('/events', async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT e.*,
        DATE_FORMAT(e.startDate, '%Y-%m-%d') as eventDate,
        DATE_FORMAT(e.startDate, '%H:%i') as eventTime,
        TIMESTAMPDIFF(MINUTE, e.startDate, e.endDate) as duration,
        (SELECT COUNT(*) FROM eventRegistrations WHERE eventId = e.id) as registrationCount
      FROM events e
      WHERE e.mentorId = ?
      ORDER BY e.startDate DESC
    `, [req.user.id]);

    res.json({ success: true, data: { events } });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/events', async (req, res) => {
  try {
    let { title, description, eventType, startDate, endDate, location, maxParticipants, eventDate, eventTime, duration } = req.body;

    // Support frontend format: eventDate + eventTime + duration → startDate + endDate
    if (!startDate && eventDate) {
      startDate = eventTime ? `${eventDate}T${eventTime}` : `${eventDate}T00:00:00`;
      const durationMs = (duration || 60) * 60 * 1000;
      endDate = new Date(new Date(startDate).getTime() + durationMs).toISOString();
    }

    if (!title || !startDate) {
      return res.status(400).json({ success: false, message: 'Title and date are required.' });
    }
    if (!endDate) endDate = startDate;

    const [result] = await pool.query(
      'INSERT INTO events (mentorId, title, description, eventType, startDate, endDate, location, maxParticipants, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)',
      [req.user.id, title, description, eventType || 'webinar', startDate, endDate, location, maxParticipants || 100]
    );

    res.status(201).json({ success: true, message: 'Event created successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/events/:id', async (req, res) => {
  try {
    let { title, description, eventType, startDate, endDate, location, maxParticipants, isPublished, eventDate, eventTime, duration } = req.body;

    // Support frontend format
    if (!startDate && eventDate) {
      startDate = eventTime ? `${eventDate}T${eventTime}` : `${eventDate}T00:00:00`;
      const durationMs = (duration || 60) * 60 * 1000;
      endDate = new Date(new Date(startDate).getTime() + durationMs).toISOString();
    }

    await pool.query(
      `UPDATE events SET title = COALESCE(?, title), description = COALESCE(?, description),
       eventType = COALESCE(?, eventType), startDate = COALESCE(?, startDate), endDate = COALESCE(?, endDate),
       location = COALESCE(?, location), maxParticipants = COALESCE(?, maxParticipants),
       isPublished = COALESCE(?, isPublished) WHERE id = ? AND mentorId = ?`,
      [title, description, eventType, startDate, endDate, location, maxParticipants, isPublished, req.params.id, req.user.id]
    );

    res.json({ success: true, message: 'Event updated successfully.' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = ? AND mentorId = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── DISCUSSIONS ────────────────
router.get('/discussions', async (req, res) => {
  try {
    const [discussions] = await pool.query(`
      SELECT d.*, c.title as courseTitle, u.fullName as authorName,
        (SELECT COUNT(*) FROM discussionReplies WHERE discussionId = d.id) as replyCount
      FROM discussions d
      LEFT JOIN courses c ON d.courseId = c.id
      JOIN users u ON d.userId = u.id
      WHERE d.courseId IN (SELECT id FROM courses WHERE mentorId = ?) OR d.userId = ?
      ORDER BY d.createdAt DESC
    `, [req.user.id, req.user.id]);

    res.json({ success: true, data: { discussions } });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/discussions', async (req, res) => {
  try {
    const { courseId, title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO discussions (courseId, userId, title, content) VALUES (?, ?, ?, ?)',
      [courseId || null, req.user.id, title, content]
    );

    res.status(201).json({ success: true, message: 'Discussion created successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.get('/discussions/:id', async (req, res) => {
  try {
    const [discussions] = await pool.query(`
      SELECT d.*, c.title as courseTitle, u.fullName as authorName
      FROM discussions d
      LEFT JOIN courses c ON d.courseId = c.id
      JOIN users u ON d.userId = u.id
      WHERE d.id = ?
    `, [req.params.id]);

    if (discussions.length === 0) return res.status(404).json({ success: false, message: 'Discussion not found.' });

    const [replies] = await pool.query(`
      SELECT dr.*, u.fullName as authorName, u.role as authorRole, u.profileImage
      FROM discussionReplies dr
      JOIN users u ON dr.userId = u.id
      WHERE dr.discussionId = ?
      ORDER BY dr.createdAt ASC
    `, [req.params.id]);

    res.json({ success: true, data: { discussion: discussions[0], replies } });
  } catch (error) {
    console.error('Get discussion error:', error);
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

// ──────────────── STUDY MATERIALS ────────────────
router.get('/study-materials', async (req, res) => {
  try {
    const [materials] = await pool.query(`
      SELECT sm.*, c.title as courseTitle
      FROM studyMaterials sm
      LEFT JOIN courses c ON sm.courseId = c.id
      WHERE sm.mentorId = ?
      ORDER BY sm.createdAt DESC
    `, [req.user.id]);

    res.json({ success: true, data: { materials } });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/study-materials', async (req, res) => {
  try {
    const { courseId, title, description, fileUrl, fileType, category } = req.body;

    if (!title) return res.status(400).json({ success: false, message: 'Title is required.' });

    const [result] = await pool.query(
      'INSERT INTO studyMaterials (courseId, mentorId, title, description, fileUrl, fileType, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [courseId || null, req.user.id, title, description, fileUrl, fileType, category]
    );

    res.status(201).json({ success: true, message: 'Material uploaded successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/study-materials/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM studyMaterials WHERE id = ? AND mentorId = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Material deleted successfully.' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;
