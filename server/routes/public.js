import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// ──────────────── CONTACT FORM (Public) ────────────────
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    await pool.query(
      'INSERT INTO contactMessages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || null, message]
    );

    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── PUBLIC COURSES (Browse without auth) ────────────────
router.get('/courses', async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.id, c.title, c.description, c.image, c.duration, c.category, c.difficulty, c.rating,
        u.fullName as mentorName,
        (SELECT COUNT(*) FROM courseEnrollments WHERE courseId = c.id) as totalStudents
      FROM courses c
      JOIN users u ON c.mentorId = u.id
      WHERE c.isPublished = 1
      ORDER BY c.rating DESC, c.createdAt DESC
    `);

    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Public courses error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ──────────────── NEWSLETTER (Public) ────────────────
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // For now, log it. In production, integrate with email service
    console.log('Newsletter subscription:', email);

    res.json({ success: true, message: 'Subscribed to newsletter successfully!' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;
