import express from 'express';
import {
  createComment,
  getNoteComments,
  likeComment,
  editComment,
  deleteComment,
  getcomments,
} from '../controllers/comment.controller.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

router.post('/creat', verifyToken, createComment);
router.get('/getPostComments/:noteId', getNoteComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get('/getcomments', verifyToken, getcomments);

export default router;