import { errorHandler } from '../utils/error.js';
import Comment from '../models/comment.model.js';

export const createComment = async (req, res) => {
  // #swagger.tags = ['Comments']
  // #swagger.description = 'Endpoint to create new Comment.'
  try {
    const { content, noteId, userId } = req.body;
    if(userId !== req.body.userId) {
      return next( errorHandler(403, 'You are not allowed to create this comment'));
    }
    const newComment = new Comment({
      content,
      noteId,
      userId,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getNoteComments = async (req, res, next) => {
  // #swagger.tags = ['Comments']
  // #swagger.description = 'Endpoint to get all Comments for a Comment.'
  try {
    const comments = await Comment.find({ noteId: req.params.noteId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
     next(error);
  }
};

export const getcomments = async (req, res, next) => {
  // #swagger.tags = ['Comments']
  // #swagger.description = 'Endpoint to get all Comments.'
  if (!req.user.isAdmin)
    return next(errorHandler(403, 'You are not allowed to get all comments'));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  // #swagger.tags = ['Comments']
  // #swagger.description = 'Endpoint to edit a Comment.'
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to edit this comment'));
    }
    const editedComment  = await Comment.findByIdAndUpdate(req.params.commentId, 
      {
        content: req.body.content,
      }, {new: true});
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  // #swagger.tags = ['Comments']
  // #swagger.description = 'Endpoint to delete a Comment.'
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete this comment'));
    }
    await User.findByIdAndDelete(req.params.commentId);
    res.status(200).json('The Comment has been deleted');
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  // #swagger.tags = ['Comments']
  // #swagger.description = 'Endpoint to Like a Comment.'
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
