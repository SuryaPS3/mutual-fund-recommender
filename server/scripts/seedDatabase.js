import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';
import UserProfile from '../src/models/UserProfile.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding database...');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (!existingUser) {
      const user = await User.create({
        email: 'test@example.com',
        password_hash: hashedPassword,
        full_name: 'Test User'
      });

      // Create user profile
      await UserProfile.create({
        user_id: user._id,
        risk_profile: 'Balanced',
        investment_horizon: 36,
        budget_type: 'SIP',
        budget_amount: 5000,
        expense_ratio_limit: 2.0,
        dividend_preference: false,
        investment_goal: 'Wealth Creation'
      });

      console.log('✅ Test user created:');
      console.log('   Email: test@example.com');
      console.log('   Password: password123');
    } else {
      console.log('⚠️  Test user already exists');
    }

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();