import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/note.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.route('/').get(getNotes).post(createNote);
router.route('/:id').delete(deleteNote);

export default router;