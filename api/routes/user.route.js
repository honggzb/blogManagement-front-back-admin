import express from 'express';
import {
    getTest,
    getUser,
    updateUser,
    deleteUser,
    getUsers,
    signout,
  } from '../controllers/user.controller.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

//router.get('/test', getTest);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);

export default router;