const express = require('express');
const Goal = require('../models/Goals');
const { getOrCreateDemoUser } = require('../utils/demoUser');

const router = express.Router();

/** Demo
 * GET api/goals
 *
 * Returns Goals of the demo user
 * Checks if  goal isActive
 */
router.get('/goals', async (req, res, next) => {
  try {
    const user = await getOrCreateDemoUser();

    const query = { userId: user._id };
    //If isActive = true, filter
    if (req.query.active === 'true') {
      query.isActive = true;
    }

    const goals = await Goal.find(query).sort({ setOrder: 1, createdAt: 1 });

    res.json(goals);
  } catch (err) {
    next(err);
  }
});

/**Demo
 * POST api/goals
 *
 * Create a new Goal
 * Expected body(v0.1)
 * {
 * "name": "Rent",
 * "type": "fixed",
 * "importance": 10,
 * "minimumPerPeriod": 10000,
 * "maximumPerPeriod": null,
 * "targetAmount": null,
 * "sortOrder": 1
 * }
 */

router.post('/goals', async (req, res, next) => {
  try {
    const user = await getOrCreateDemoUser();
    const {
      name,
      type,
      importance,
      minimumPerPeriod,
      maximumPerPeriod,
      targetAmount,
      sortOrder,
    } = req.body;

    //Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      const error = new Error('Name is required, only text');
      error.statusCode = 400;
      throw error;
    }

    if (importance !== undefined) {
      if (
        typeof importance !== 'number' ||
        Number.isNaN(importance) ||
        importance < 0 ||
        importance > 10
      ) {
        const error = new Error('importance must be a number between 1 and 10');
        error.statusCode = 400;
        throw error;
      }
    }
    if (minimumPerPeriod !== undefined) {
      if (
        typeof minimumPerPeriod !== 'number' ||
        Number.isNaN(minimumPerPeriod) ||
        minimumPerPeriod < 0
      ) {
        const error = new Error('minimumPerPeriod must be a number above 0');
        error.statusCode = 400;
        throw error;
      }
    }

    //Create the Goal
    const goal = await Goal.create({
      userId: user._id,
      name: name.trim(),
      type: type ? type.trim() : 'variable',
      importance: importance ?? 1,
      minimumPerPeriod: minimumPerPeriod ?? 0,
      maximumPerPeriod: maximumPerPeriod ?? null,
      targetAmount: targetAmount ?? null,
      sortOrder: sortOrder ?? 0,
    });
    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
});

/**DEMO
 * PUT /api/goals/:id
 *
 * Update an existing goal.
 * {
 *   "name": "New name",
 *   "type": "savings",
 *   "importance": 4,
 *   "minimumPerPeriod": 500,
 *   "maximumPerPeriod": 2000,
 *   "targetAmount": 20000,
 *   "isActive": true,
 *   "sortOrder": 2
 * }
 */

router.put('/goals/:id', async (req, res, next) => {
  try {
    const user = await getOrCreateDemoUser();
    const goalId = req.params.id;

    const updates = {};
    const allowedFields = [
      'name',
      'type',
      'importance',
      'minimumPerPeriod',
      'maximumPerPeriod',
      'targetAmount',
      'isActive',
      'sortOrder',
    ];

    // Only allowed fields from body
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Validation
    if (updates.importance !== undefined) {
      if (
        typeof updates.importance !== 'number' ||
        Number.isNaN(updates.importance) ||
        updates.importance < 0
      ) {
        const err = new Error('importance must be a number between 1 and 10');
        err.statusCode = 400;
        throw err;
      }
    }

    if (updates.minimumPerPeriod !== undefined) {
      if (
        typeof updates.minimumPerPeriod !== 'number' ||
        Number.isNaN(updates.minimumPerPeriod) ||
        updates.minimumPerPeriod < 0
      ) {
        const err = new Error('minimumPerPeriod must be a number above 0');
        err.statusCode = 400;
        throw err;
      }
    }

    //Update name if exists
    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || updates.name.trim() === '') {
        const err = new Error('name must be letters');
        err.statusCode = 400;
        throw err;
      }
      updates.name = updates.name.trim();
    }

    if (updates.type !== undefined && typeof updates.type === 'string') {
      updates.type = updates.type.trim();
    }

    // Find and update goal
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: goalId, userId: user._id },
      updates,
      { new: true } // return the updated document
    );

    if (!updatedGoal) {
      const err = new Error('Goal not found');
      err.statusCode = 404;
      throw err;
    }

    if (!updates.isActive) {
      res.json({ message: 'Goal deactivated', goal: updatedGoal });
    } else {
      res.json({ message: 'Goal is active', goal: updatedGoal });
    }

    res.json(updatedGoal);
  } catch (err) {
    next(err);
  }
});

/** DEMO
 * PUT /api/goals/:id
 *
 * Soft-delete: set isActive = false
 * For future Tick UI
 */

// Hard delete
router.delete('/goals/:id', async (req, res, next) => {
  try {
    const user = await getOrCreateDemoUser();
    const goalId = req.params.id;

    const deleted = await Goal.findOneAndDelete({
      userId: user._id,
      _id: goalId,
    });

    if (!deleted) {
      const err = new Error('Goal not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ message: 'Goal deleted', goalId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
