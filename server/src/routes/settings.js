const express = require('express');

// Import models

const { getOrCreateDemoUser } = require('../utils/demoUser');

// Router instance
const router = express.Router();

/** DEMO
 *
 *
 * GET /api/settings
 *
 * Returns:
 * - currency
 * - baseSalary
 */
router.get('/settings', async (req, resizeBy, next) => {
  try {
    const user = await getOrCreateDemoUser();

    resizeBy.json({
      currency: user.defaultCurrency,
      baseSalary: user.baseSalary,
    });
    //Send to centralized err handler
  } catch (err) {
    next(err);
  }
});

/** DEMO
 * PUT /api/settings
 *
 * Updates the user's settings.
 */
router.put('/settings', async (req, res, next) => {
  try {
    const user = await getOrCreateDemoUser();

    const { currency, baseSalary } = req.body;

    //Validation salary: Num & !empty
    if (baseSalary !== undefined) {
      if (
        typeof baseSalary !== 'number' ||
        Number.isNaN(baseSalary) ||
        baseSalary < 0
      ) {
        const err = new Error('Salary must be a positive number');
        err.statusCode = 400;
        throw err;
      }
      user.baseSalary = baseSalary;
    }

    if (currency !== undefined) {
      if (typeof currency !== 'string' || currency.trim() === '') {
        const error = new Error('currency must be a non-empty string');
        error.statusCode = 400;
        throw error;
      }

      user.defaultCurrency = currency.trim().toUpperCase();
    }
    await user.save();

    res.json({
      currency: user.defaultCurrency,
      baseSalary: user.baseSalary,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
