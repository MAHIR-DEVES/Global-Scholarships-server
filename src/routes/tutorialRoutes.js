import express from 'express';
import {
  createTutorial,
  getAllTutorials,
  getTutorialById,
  updateTutorial,
  deleteTutorial,
} from '../controllers/tutorialController.js';

const router = express.Router();

router.post('/', createTutorial);
router.get('/', getAllTutorials);
router.get('/:id', getTutorialById);
router.put('/:id', updateTutorial);
router.delete('/:id', deleteTutorial);

export default router;
