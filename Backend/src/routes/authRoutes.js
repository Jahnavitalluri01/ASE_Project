// src/routes/authRoutes.js
import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/google', authController.googleLogin);
router.get('/providers/pending', authController.getallPendingProviders); // Admin
router.put('/providers/approve/:userId', authController.approveProvider); // Admin
router.get("/user", authController.getUserDetails);

export default router;
