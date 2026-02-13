require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const User = require('../models/User');
const Event = require('../models/Event');

const seedEvents = [
    {
        title: "AI & Future Tech Conference",
        description: "Explore the latest in Artificial Intelligence and Machine Learning.",
        category: "Conference",
        date: new Date("2026-03-25T10:00:00Z"),
        time: "10:00 AM - 4:00 PM",
        location: "Bangalore, India",
        status: "Registered",
        type: "upcoming",
        imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789"
    },
    {
        title: "Full Stack MERN Workshop",
        description: "Hands-on workshop to learn modern React patterns and hooks.",
        category: "Workshop",
        date: new Date("2026-04-02T11:00:00Z"),
        time: "11:00 AM – 3:00 PM",
        location: "Online",
        status: "Registered",
        type: "upcoming",
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    },
    {
        title: "Startup & Entrepreneurship Meetup",
        description: "Networking event for local developers and entrepreneurs.",
        category: "Meetup",
        date: new Date("2026-04-10T18:00:00Z"),
        time: "6:00 PM – 8:30 PM",
        location: "Chennai, India",
        status: "Registered",
        type: "upcoming",
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df"
    },
    {
        title: "UI/UX Design Bootcamp",
        description: "Intensive bootcamp focusing on user-centric design principles.",
        category: "Workshop",
        date: new Date("2026-04-18T09:30:00Z"),
        time: "9:30 AM – 1:30 PM",
        location: "Hyderabad, India",
        status: "Registered",
        type: "upcoming",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
    },
    {
        title: "Cloud Computing & DevOps Summit",
        description: "Deep dive into modern web security and cloud infrastructure.",
        category: "Conference",
        date: new Date("2026-04-28T10:00:00Z"),
        time: "10:00 AM – 5:00 PM",
        location: "Online",
        status: "Registered",
        type: "upcoming",
        imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        let organizer = await User.findOne({ username: 'organizer' });
        if (!organizer) {
            organizer = await User.create({
                name: 'Event Organizer',
                email: 'organizer@example.com',
                username: 'organizer',
                password: 'password123'
            });
            console.log('Created default organizer');
        }

        await Event.deleteMany({});
        console.log('Cleared existing events');

        const eventsWithOrganizer = seedEvents.map(event => ({
            ...event,
            organizerId: organizer._id
        }));

        await Event.insertMany(eventsWithOrganizer);
        console.log('Seeded events successfully');

        process.exit();
    } catch (error) {
        const errorDetails = {
            message: error.message,
            stack: error.stack,
            errors: error.errors
        };
        fs.writeFileSync('seed_error.json', JSON.stringify(errorDetails, null, 2));
        console.error('Seeding error written to seed_error.json');
        process.exit(1);
    }
};

seedDB();
