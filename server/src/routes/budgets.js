const express = require('express');
const Goal = require('../models/Goals');
const { getOrCreateDemoUser } = require('../utils/demoUser');
const { calculateAllocation } = require('../services/allocations');

const router = express.Router();

/**DEMO
 *
 * POST /api/budget/preview
 *
 * {
 * "income": (optional or baseSalary),
 * }
 */

router.post('/budgets/preview', async (req, res, next) => {
  try {
    const user = await getOrCreateDemoUser();

    const income =
      req.body && req.body.income !== undefined
        ? req.body.income
        : user.baseSalary;

    const query = { userId: user._id };
    //If isActive = true, filter
    if (req.query.active === 'true') {
      query.isActive = true;
    }
    const goals = await Goal.find(query).sort({
      sortOrder: 1,
      createdAt: 1,
    });

    console.log(user._id);
    console.log(await Goal.find({ user: user._id }));
    console.log(goals);

    const result = calculateAllocation(income, goals);

    res.json({
      currency: user.defaultCurrency,
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
