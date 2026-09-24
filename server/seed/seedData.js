const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Connection = require('../models/Connection');
const Message = require('../models/Message');
const Session = require('../models/Session');
const Review = require('../models/Review');

const usersData = [
  {
    name: 'Aarav Sharma',
    email: 'aarav@skillswap.edu',
    password: 'password123',
    college: 'Stanford Institute of Technology',
    bio: 'Full stack Java & Spring Boot enthusiast. Looking to master modern React and Tailwind CSS for interactive client-side apps!',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    skillsToTeach: [
      { name: 'Java', level: 'Advanced' },
      { name: 'Spring Boot', level: 'Intermediate' },
      { name: 'SQL', level: 'Advanced' },
    ],
    skillsToLearn: [
      { name: 'React', level: 'Intermediate' },
      { name: 'Tailwind CSS', level: 'Beginner' },
    ],
    skillLevel: 'Advanced',
    rating: 4.9,
    reviewCount: 14,
    completedSessionsCount: 18,
    availableTimings: ['Mon-Wed (6:00 PM - 8:30 PM)', 'Saturday (11:00 AM - 3:00 PM)'],
  },
  {
    name: 'Priya Patel',
    email: 'priya@skillswap.edu',
    password: 'password123',
    college: 'MIT College of Engineering',
    bio: 'Frontend developer passionate about UI/UX and React ecosystem. Looking for a Java mentor to prepare for backend technical interviews.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    skillsToTeach: [
      { name: 'React', level: 'Advanced' },
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'Tailwind CSS', level: 'Advanced' },
      { name: 'UI/UX', level: 'Intermediate' },
    ],
    skillsToLearn: [
      { name: 'Java', level: 'Intermediate' },
      { name: 'Spring Boot', level: 'Beginner' },
    ],
    skillLevel: 'Advanced',
    rating: 4.8,
    reviewCount: 12,
    completedSessionsCount: 15,
    availableTimings: ['Tue-Thu (5:00 PM - 7:30 PM)', 'Sunday (2:00 PM - 6:00 PM)'],
  },
  {
    name: 'Rohan Verma',
    email: 'rohan@skillswap.edu',
    password: 'password123',
    college: 'National University of Sciences',
    bio: 'Core Python and Data Structures specialist. Wanting to learn Machine Learning algorithms and PyTorch workflows.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    skillsToTeach: [
      { name: 'Python', level: 'Advanced' },
      { name: 'Data Structures', level: 'Advanced' },
      { name: 'C++', level: 'Intermediate' },
    ],
    skillsToLearn: [
      { name: 'Machine Learning', level: 'Intermediate' },
      { name: 'PyTorch', level: 'Beginner' },
    ],
    skillLevel: 'Advanced',
    rating: 5.0,
    reviewCount: 8,
    completedSessionsCount: 10,
    availableTimings: ['Mon-Fri (7:00 PM - 9:00 PM)', 'Weekends (All Day)'],
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya@skillswap.edu',
    password: 'password123',
    college: 'National University of Sciences',
    bio: 'AI researcher & Kaggle master. Teaching ML models and neural nets in exchange for strengthening low-level Python and C++ performance.',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    skillsToTeach: [
      { name: 'Machine Learning', level: 'Advanced' },
      { name: 'Deep Learning', level: 'Advanced' },
      { name: 'Data Science', level: 'Advanced' },
    ],
    skillsToLearn: [
      { name: 'Python', level: 'Advanced' },
      { name: 'C++', level: 'Intermediate' },
    ],
    skillLevel: 'Advanced',
    rating: 4.95,
    reviewCount: 19,
    completedSessionsCount: 22,
    availableTimings: ['Wed-Fri (4:00 PM - 6:30 PM)', 'Saturday (10:00 AM - 1:00 PM)'],
  },
  {
    name: 'Devon Carter',
    email: 'devon@skillswap.edu',
    password: 'password123',
    college: 'Stanford Institute of Technology',
    bio: 'Graphic designer and Figma wizard. Wanting to pick up HTML, CSS and basic React to bring my UI designs to life in code.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    skillsToTeach: [
      { name: 'Graphic Design', level: 'Advanced' },
      { name: 'UI/UX', level: 'Advanced' },
      { name: 'Figma', level: 'Advanced' },
    ],
    skillsToLearn: [
      { name: 'HTML', level: 'Beginner' },
      { name: 'CSS', level: 'Beginner' },
      { name: 'JavaScript', level: 'Beginner' },
    ],
    skillLevel: 'Intermediate',
    rating: 4.7,
    reviewCount: 9,
    completedSessionsCount: 11,
    availableTimings: ['Weekdays (6:00 PM - 8:00 PM)'],
  },
  {
    name: 'Sneha Roy',
    email: 'sneha@skillswap.edu',
    password: 'password123',
    college: 'MIT College of Engineering',
    bio: 'Node.js backend dev and MongoDB database admin. Excited to improve public speaking and communication skills for tech conferences.',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    skillsToTeach: [
      { name: 'Node.js', level: 'Advanced' },
      { name: 'MongoDB', level: 'Advanced' },
      { name: 'Express.js', level: 'Advanced' },
    ],
    skillsToLearn: [
      { name: 'Public Speaking', level: 'Intermediate' },
      { name: 'Communication Skills', level: 'Intermediate' },
    ],
    skillLevel: 'Advanced',
    rating: 4.85,
    reviewCount: 7,
    completedSessionsCount: 9,
    availableTimings: ['Mon-Thu (7:00 PM - 9:00 PM)'],
  },
];

const seedDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap';
      console.log(`Connecting to MongoDB for seeding: ${mongoURI}`);
      await mongoose.connect(mongoURI);
    }

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Connection.deleteMany({});
    await Message.deleteMany({});
    await Session.deleteMany({});
    await Review.deleteMany({});

    console.log('Creating demo users...');
    const createdUsers = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }

    const [aarav, priya, rohan, ananya, devon, sneha] = createdUsers;

    console.log('Creating sample connections...');
    // Aarav & Priya: Accepted
    const conn1 = await Connection.create({
      sender: aarav._id,
      receiver: priya._id,
      status: 'accepted',
      note: 'Hey Priya! Your React skills look incredible. I would love to teach you Java OOP and Spring Boot!',
    });

    // Rohan & Ananya: Accepted
    await Connection.create({
      sender: rohan._id,
      receiver: ananya._id,
      status: 'accepted',
      note: 'Hi Ananya, mutual ML/Python pair match here! Let us exchange knowledge.',
    });

    // Devon & Aarav: Pending
    await Connection.create({
      sender: devon._id,
      receiver: aarav._id,
      status: 'pending',
      note: 'Hello Aarav! Would love to connect and learn some software fundamentals.',
    });

    // Sneha & Priya: Pending
    await Connection.create({
      sender: sneha._id,
      receiver: priya._id,
      status: 'pending',
      note: 'Hey Priya, love your design portfolio!',
    });

    console.log('Creating sample messages...');
    await Message.create([
      {
        sender: aarav._id,
        receiver: priya._id,
        message: 'Hi Priya! Thanks for connecting. I am looking forward to learning React hooks and state management.',
        read: true,
      },
      {
        sender: priya._id,
        receiver: aarav._id,
        message: 'Awesome Aarav! And I cannot wait to master Java Collections & OOP principles with you. When is good for our first session?',
        read: true,
      },
      {
        sender: aarav._id,
        receiver: priya._id,
        message: 'How does this Saturday at 11:00 AM work for you?',
        read: true,
      },
      {
        sender: priya._id,
        receiver: aarav._id,
        message: 'Saturday 11:00 AM is perfect! I will prepare some React interactive code sandboxes.',
        read: false,
      },
      {
        sender: rohan._id,
        receiver: ananya._id,
        message: 'Hey Ananya! Ready to dive into Neural Networks this week?',
        read: true,
      },
      {
        sender: ananya._id,
        receiver: rohan._id,
        message: 'Yes! Let us review backpropagation and loss functions on Friday.',
        read: true,
      },
    ]);

    console.log('Creating sample sessions...');
    const session1 = await Session.create({
      teacher: priya._id,
      learner: aarav._id,
      skill: 'React',
      date: '2026-10-02',
      time: '11:00 AM',
      duration: 60,
      status: 'accepted',
      notes: 'Mastering React hooks (useState, useEffect) and building reusable components.',
      meetingLink: 'https://meet.jit.si/skillswap-react-mastery',
    });

    const session2 = await Session.create({
      teacher: aarav._id,
      learner: priya._id,
      skill: 'Java',
      date: '2026-09-20',
      time: '06:00 PM',
      duration: 60,
      status: 'completed',
      notes: 'Deep dive into Object Oriented Programming, Polymorphism, and Collections.',
      meetingLink: 'https://meet.jit.si/skillswap-java-foundations',
      reviewed: true,
    });

    const session3 = await Session.create({
      teacher: ananya._id,
      learner: rohan._id,
      skill: 'Machine Learning',
      date: '2026-10-05',
      time: '04:30 PM',
      duration: 90,
      status: 'pending',
      notes: 'Intro to Gradient Descent and PyTorch Tensors.',
      meetingLink: 'https://meet.jit.si/skillswap-ml-intro',
    });

    console.log('Creating sample reviews...');
    await Review.create({
      reviewer: priya._id,
      reviewedUser: aarav._id,
      session: session2._id,
      rating: 5,
      comment: 'Aarav is an outstanding Java mentor! He simplified complex OOP concepts with clear real-world examples. Highly recommended!',
    });

    console.log('Updating calculated rating totals...');
    await Review.calculateAverageRating(aarav._id);

    console.log('==============================================');
    console.log('   SKILLSWAP DATABASE SEEDED SUCCESSFULLY!   ');
    console.log('==============================================');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding error:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;
