const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Schema Definitions
const TaskSchema = new mongoose.Schema({
  task: String,
  date: String,
  completed: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const JournalEntrySchema = new mongoose.Schema({
  date: String,
  feeling: String,
  productivity: Number,
  studyHours: Number,
  content: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Models
const Task = mongoose.model('Task', TaskSchema);
const JournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);

// Controllers
const calendarController = {
  // Tasks
  getTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ 
        userId: req.user._id,
        date: req.query.date 
      });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createTask: async (req, res) => {
    const task = new Task({
      task: req.body.task,
      date: req.body.date,
      completed: false,
      userId: req.user._id
    });

    try {
      const newTask = await task.save();
      res.status(201).json(newTask);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateTask: async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { completed: req.body.completed },
        { new: true }
      );
      res.json(updatedTask);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Journal Entries
  getJournalEntry: async (req, res) => {
    try {
      const entry = await JournalEntry.findOne({ 
        userId: req.user._id,
        date: req.query.date 
      });
      res.json(entry || null);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  saveJournalEntry: async (req, res) => {
    try {
      const existingEntry = await JournalEntry.findOne({
        userId: req.user._id,
        date: req.body.date
      });

      let entry;
      if (existingEntry) {
        entry = await JournalEntry.findByIdAndUpdate(
          existingEntry._id,
          {
            feeling: req.body.feeling,
            productivity: req.body.productivity,
            studyHours: req.body.studyHours,
            content: req.body.content
          },
          { new: true }
        );
      } else {
        entry = new JournalEntry({
          date: req.body.date,
          feeling: req.body.feeling,
          productivity: req.body.productivity,
          studyHours: req.body.studyHours,
          content: req.body.content,
          userId: req.user._id
        });
        await entry.save();
      }

      res.status(201).json(entry);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

// Routes
router.get('/tasks', calendarController.getTasks);
router.post('/tasks', calendarController.createTask);
router.patch('/tasks/:id', calendarController.updateTask);
router.delete('/tasks/:id', calendarController.deleteTask);
router.get('/journal', calendarController.getJournalEntry);
router.post('/journal', calendarController.saveJournalEntry);

module.exports = { router, Task, JournalEntry };