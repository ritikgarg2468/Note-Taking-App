import { Response } from 'express';
import Note from '../models/note.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Please provide title and content' });

  try {
    const note = new Note({ user: req.user?._id, title, content });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user?._id) return res.status(401).json({ message: 'Not authorized' });
    
    await note.deleteOne();
    res.json({ message: 'Note removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};