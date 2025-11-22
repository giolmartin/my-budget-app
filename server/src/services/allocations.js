

/**
 * Calculate how to allocate a given income across goals.
 *
 * @param {number} incomeAmount - total income to allocate
 * @param {Array} goals - array of goal documents (Mongo objects)
 *
 * Returns an object:
 * {
 *   incomeAmount,
 *   allocations: [
 *     { goalId, goalName, amount, percentage }
 *   ],
 *   leftover
 * }
 */

function calculateAllocation(incomeAmount, goals) {

  // Convert income to number and validate
  const income = Number(incomeAmount);

  if (!Number.isFinite(income) || income <= 0) {
    const error = new Error('income must be a positive number');
    error.statusCode = 400;
    throw error;
  }

  if (!Array.isArray(goals) || goals.length === 0) {
    const error = new Error('No goals found to allocate to');
    error.statusCode = 400;
    throw error;
  }

  // Only allocate to active goals
  const activeGoals = goals.filter((g) => g.isActive !== false);

  if (activeGoals.length === 0) {
    const error = new Error('No active goals found to allocate to');
    error.statusCode = 400;
    throw error;
  }

  //  1) Minimums and fixed //

  // Track allocations in a map: goalId -> amount
  const allocationsMap = new Map();

  let totalMinimums = 0;

  activeGoals.forEach((goal) => {
    const min = Number(goal.minimumPerPeriod) || 0;

    if (min < 0) {
      const error = new Error(`Goal "${goal.name}" has a negative minimumPerPeriod`);
      error.statusCode = 400;
      throw error;
    }

    allocationsMap.set(goal._id.toString(), min);
    totalMinimums += min;
  });

  // If income can't cover minimums, throw err
  if (income < totalMinimums) {
    const error = new Error(
      `Income (${income}) is less than total minimum required (${totalMinimums})`
    );
    error.statusCode = 400;
    // TODO: Implement requiredMinimum
    throw error;
  }

  // Money left after covering all minimums
  let remaining = income - totalMinimums;

  //  2) Distribute remaining by importance //

  // Goals weighted
  const weightedGoals = activeGoals.filter((g) => (g.importance || 0) > 0);

  if (remaining > 0 && weightedGoals.length > 0) {
    const totalImportance = weightedGoals.reduce(
      (sum, g) => sum + (Number(g.importance) || 0),
      0
    );

    // Avoid division by 0
    if (totalImportance > 0) {
      let totalUsedFromRemaining = 0;

      weightedGoals.forEach((goal) => {
        const id = goal._id.toString();
        const currentAllocated = allocationsMap.get(id) ?? 0;

        const weight = Number(goal.importance) || 0;
        const share = (weight / totalImportance) * remaining;

        // Proposed new total for this goal
        let proposedTotal = currentAllocated + share;

        // Respect maximumPerPeriod if set (v0.1: DO NOT redistribute the overflow)
        if (goal.maximumPerPeriod !== null && goal.maximumPerPeriod !== undefined) {
          const max = Number(goal.maximumPerPeriod);
          if (Number.isFinite(max)) {
            if (proposedTotal > max) {
              proposedTotal = max;
            }
          }
        }

        const extraAllocated = proposedTotal - currentAllocated;

        //How much we actually used
        if (extraAllocated > 0) {
          allocationsMap.set(id, proposedTotal);
          totalUsedFromRemaining += extraAllocated;
        }
      });

      remaining -= totalUsedFromRemaining;
    }
  }

  // ---- 3) Build final allocations array ---- //

  let allocationsTotal = 0;

  const allocations = activeGoals.map((goal) => {
    const id = goal._id.toString();
    const amount = allocationsMap.get(id) ?? 0;
    allocationsTotal += amount;

    const percentage = (amount / income) * 100;

    return {
      goalId: id,
      goalName: goal.name,
      amount: Math.round(amount),
      percentage: Number(percentage.toFixed(2)),
    };
  });

  const leftover = income - allocationsTotal;

  return {
    incomeAmount: income,
    allocations,
    leftover: Math.round(leftover),
  };
}

module.exports = {
  calculateAllocation,
};