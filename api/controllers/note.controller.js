import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import Note from '../models/note.model.js';

export const create = async (req, res) => {
  // #swagger.tags = ['Notes']
  // #swagger.description = 'Endpoint to create new Note.'
  if(!req.user.isAdmin) {   //shoule be req.user, not req.body
    return next(errorHandler(403, 'You are not allowed to create a note'))
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newNote = new Note({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req, res, next) => {
  // #swagger.tags = ['Notes']
  // #swagger.description = 'Endpoint to get all  Notes.'
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const notes = await Note.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.noteId && { _id: req.query.noteId }),
      ...(req.query.searchTerm && {
        $or: [
          { title:  { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    }).sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalNotes = await Note.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthNotes = await Note.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      notes,
      totalNotes,
      lastMonthNotes,
    });
  } catch (error) {
     next(error);
  }
};

export const updateNote = async (req, res, next) => {
  // #swagger.tags = ['Notes']
  // #swagger.description = 'Endpoint to update Note.'
  //console.log(req.user);
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this Note'));
  }
  try {
    const updateNote = await Note.findByIdAndUpdate(req.params.noteId, {
      $set: {    //$set  ->  update even if there are missing, such as missing email
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      },
    }, {new: true});
    res.status(200).json(updateNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  // #swagger.tags = ['Notes']
  // #swagger.description = 'Endpoint to delete Note.'
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this Note'));
  }
  try {
    await User.findByIdAndDelete(req.params.noteId);
    res.status(200).json('The note has been deleted');
  } catch (error) {
    next(error);
  }
};
