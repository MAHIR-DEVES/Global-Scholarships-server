import express from 'express';
import {
  getUsers,
  createUser,
  loginUser,
  getUserProfile,
  updateUserRole,
  deleteUser,
} from '../controllers/userControllers.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

router
  .route('/:id')
  .delete(protect, authorize('admin'), deleteUser);

router
  .route('/:id/role')
  .put(protect, authorize('admin'), updateUserRole);

export default router;
