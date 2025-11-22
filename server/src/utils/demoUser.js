const User = require('../models/User');

const DEMO_EMAIL = 'demo@local';

async function getOrCreateDemoUser() {
  let user = await User.findOne({ email: DEMO_EMAIL });

  if (!user) {
    user = await User.create({
      email: DEMO_EMAIL,
      defaultCurrency: 'SEK',
      baseSalary: 0,
    });
  }

  return user;
}

module.exports = {
  DEMO_EMAIL,
  getOrCreateDemoUser,
};
