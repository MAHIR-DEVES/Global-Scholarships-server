import express from 'express';
import {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
} from '../controllers/scholarshipController.js';

const router = express.Router();

router.post('/', createScholarship);
router.get('/', getAllScholarships); // optional filters: ?level=PhD&country=USA&major=CS
router.get('/:id', getScholarshipById);
router.put('/:id', updateScholarship);
router.delete('/:id', deleteScholarship);

export default router;
