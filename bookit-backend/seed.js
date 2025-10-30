const mongoose = require('mongoose');
const Experience = require('./models/Experience');
const Slot = require('./models/Slot');
const Booking = require('./models/Booking');

// --- PASTE YOUR FULL CONNECTION STRING HERE ---
const dbURI = "mongodb+srv://surajgholase41:testing123@cluster0.6jfa66q.mongodb.net/?appName=Cluster0";
const seedData = [
  {
    name: "Kayaking",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    location: "Udupi",
    image_url: "https://images.unsplash.com/photo-1577382216514-aa6124716768?w=500"
  },
  {
    name: "Nandi Hills Sunrise",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 899,
    location: "Bangalore",
    image_url: "https://images.unsplash.com/photo-1580214605490-6746f04172b8?w=500"
  },
  {
    name: "Coffee Trail",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 1299,
    location: "Coorg",
    image_url: "https://images.unsplash.com/photo-1509357805193-a06b21c434f0?w=500"
  },
  {
    name: "Kayaking",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    location: "Udupi, Karnataka",
    image_url: "https://images.unsplash.com/photo-1510252570072-a0d051c1de7e?w=500"
  },
  {
    name: "Nandi Hills Sunrise",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 899,
    location: "Bangalore",
    image_url: "https://images.unsplash.com/photo-1580214605490-6746f04172b8?w=500"
  },
  {
    name: "Boat Cruise",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    location: "Sunderban",
    image_url: "https://images.unsplash.com/photo-1620022718360-6a751070868f?w=500"
  },
  {
    name: "Bunjee Jumping",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    location: "Manali",
    image_url: "https://images.unsplash.com/photo-1501436513145-30f24b19f17b?w=500"
  },
  {
    name: "Coffee Trail",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 1299,
    location: "Coorg",
    image_url: "https://images.unsplash.com/photo-1620602325859-5f34d93d607a?w=500"
  }
];

// Helper function to create a date
const createDate = (day, hour) => {
  const date = new Date('2025-10-01T00:00:00.000+05:30'); // Use IST
  date.setDate(day);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const seedDB = async () => {
  await mongoose.connect(dbURI);
  console.log('Connected to MongoDB for seeding');

  // Clear existing data
  await Experience.deleteMany({});
  await Slot.deleteMany({});
  await Booking.deleteMany({});
  console.log('Cleared old data');

  // Add experiences
  const createdExperiences = await Experience.insertMany(seedData);
  console.log('Experiences seeded');

  // Add slots for the first "Kayaking" experience (to match the design)
  const expId = createdExperiences[0]._id;
  
  const slots = [
    // Oct 22
    { experience_id: expId, start_time: createDate(22, 7), total_capacity: 10, booked_count: 4 },
    { experience_id: expId, start_time: createDate(22, 9), total_capacity: 10, booked_count: 2 },
    { experience_id: expId, start_time: createDate(22, 11), total_capacity: 10, booked_count: 8 },
    { experience_id: expId, start_time: createDate(22, 13), total_capacity: 10, booked_count: 10 }, // Sold out
    // Oct 23
    { experience_id: expId, start_time: createDate(23, 7), total_capacity: 10, booked_count: 1 },
    { experience_id: expId, start_time: createDate(23, 9), total_capacity: 10, booked_count: 0 },
    // Oct 24
    { experience_id: expId, start_time: createDate(24, 9), total_capacity: 10, booked_count: 3 },
    { experience_id: expId, start_time: createDate(24, 11), total_capacity: 10, booked_count: 5 },
    // Oct 25
    { experience_id: expId, start_time: createDate(25, 7), total_capacity: 10, booked_count: 0 },
  ];
  
  await Slot.insertMany(slots);
  console.log('Slots seeded');
  
  await mongoose.connection.close();
  console.log('Seeding complete. DB connection closed.');
};

seedDB().catch(err => {
  console.error('Seeding failed:', err);
  mongoose.connection.close();
});