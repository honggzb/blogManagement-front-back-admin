import express from 'express';
import {
  create,
  getNotes,
  updateNote,
  deleteNote,
} from '../controllers/note.controller.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

router.post('/creat', verifyToken, create);
router.get('/getnotes', getNotes);
router.delete('/deletenote/:noteId/:userId', verifyToken, deleteNote);
router.put('/updatenote/:noteId/:userId', verifyToken, updateNote);

export default router;