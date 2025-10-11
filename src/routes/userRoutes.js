import express from 'express';
import {
  getUsers,
  createUser,
  loginUser,
  getUserProfile,
} from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

export default router;
