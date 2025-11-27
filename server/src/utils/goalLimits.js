/**
 * Get min/max amounts and percents based on baseIncome.
 *
 * Inputs:
 *  - baseIncome
 *  - reqMin
 *  - reqMax
 *  - reqMinPercent
 *  - reqMaxPercent
 *
 * Returns:
 *  {
 *    minAmount,
 *    maxAmount,
 *    minPercent,
 *    maxPercent
 *  }
 */

function resMinMax({
  baseIncome,
  reqMin,
  reqMax,
  reqMinPercent,
  reqMaxPercent,
}) {
  const hasMin = reqMin !== undefined;
  const hasMax = reqMax !== undefined;
  const hasMinPer = reqMinPercent !== undefined;
  const hasMaxPer = reqMaxPercent !== undefined;

  let minAmount = hasMin ? Number(reqMin) : undefined;
  let maxAmount = hasMax ? Number(reqMax) : undefined;
  let minPercent = hasMinPer ? Number(reqMinPercent) : undefined;
  let maxPercent = hasMaxPer ? Number(reqMaxPercent) : undefined;

  function checkPositive(amount) {
    if (amount !== undefined && amount < 0) {
      const err = new Error(`${amount} must be above 0`);
      err.statusCode = 400;
      throw err;
    }
  }

  checkPositive(minAmount);
  checkPositive(maxAmount);
  checkPositive(maxPercent);
  checkPositive(minPercent);

  const canUsePercent = Number.isFinite(baseIncome) && baseIncome > 0;

  //Min
  if (!hasMin && hasMinPer && canUsePercent) {
    minAmount = (minPercent / 100) * baseIncome;
  }

  if (hasMin !== undefined && canUsePercent) {
    minPercent = (minAmount / baseIncome) * 100;
  }

  if (!hasMin && hasMinPer && !canUsePercent) {
    const err = new Error(`Cannot set percentage, check base salary`);
    err, (statusCode = 400);
    throw err;
  }
  //Max
  if (!hasMax && hasMaxPer && canUsePercent) {
    maxAmount = (maxPercent / 100) * baseIncome;
  }

  if (hasMax !== undefined && canUsePercent) {
    maxPercent = (maxAmount / baseIncome) * 100;
  }
  if (!hasMax && hasMaxPer && !canUsePercent) {
    const err = new Error(`Cannot set percentage, check base salary`);
    err, (statusCode = 400);
    throw err;
  }
  if (minPercent !== undefined) {
    minPercent = Number(minPercent.toFixed(2));
  }
  if (maxPercent !== undefined && maxPercent !== null) {
    maxPercent = Number(maxPercent.toFixed(2));
  }

  console.log(
    `MinA: ${minAmount} MinP: ${minPercent} MaxA: ${maxAmount} MaxP: ${maxPercent}`
  );
  return {
    minAmount,
    maxAmount,
    minPercent,
    maxPercent,
  };
}

module.exports = {
  resMinMax,
};
