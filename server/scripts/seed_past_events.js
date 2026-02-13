require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const pastEvents = [
    {
        title: "AI Innovation Summit 2025",
        category: "Conference",
        date: "2025-12-12",
        time: "10:00 AM – 4:30 PM",
        location: "Bangalore, India",
        status: "Registered",
        type: "past",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        description: "Exploring the next generation of AI technologies and their impact on global innovation."
    },
    {
        title: "React & Frontend Development Workshop",
        category: "Workshop",
        date: "2025-11-28",
        time: "11:00 AM – 3:00 PM",
        location: "Online",
        status: "Registered",
        type: "past",
        imageUrl: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
        description: "A hands-on workshop dedicated to mastering React.js and modern frontend development practices."
    },
    {
        title: "Data Analytics & Visualization Bootcamp",
        category: "Workshop",
        date: "2025-10-15",
        time: "9:30 AM – 1:30 PM",
        location: "Hyderabad, India",
        status: "Registered",
        type: "past",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        description: "Learn how to transform raw data into actionable insights through powerful visualization techniques."
    },
    {
        title: "Startup Growth & Funding Meetup",
        category: "Meetup",
        date: "2025-09-30",
        time: "6:00 PM – 8:00 PM",
        location: "Chennai, India",
        status: "Registered",
        type: "past",
        imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
        description: "Connect with investors and fellow entrepreneurs to discuss strategies for startup growth and funding."
    },
    {
        title: "Cloud & DevOps Engineering Conference",
        category: "Conference",
        date: "2025-08-05",
        time: "10:00 AM – 5:00 PM",
        location: "Online",
        status: "Registered",
        type: "past",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        description: "Join industry experts to discuss the latest trends and best practices in Cloud Computing and DevOps."
    }
];

const seedPast = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding past events...');

        // Try to find the user from the screenshot first, then fallback to organizer
        let user = await User.findOne({ email: 'arockiadassj5@gmail.com' });
        if (!user) {
            console.log('User arockiadassj5@gmail.com not found. Falling back to default "organizer".');
            user = await User.findOne({ username: 'organizer' });
        }

        if (!user) {
            console.error('Error: No suitable user found to assign these events to.');
            process.exit(1);
        }

        console.log(`Seeding data for user: ${user.name} (${user.email})`);

        // Prepare events with organizerId and specific dates
        const eventsToInsert = pastEvents.map(e => ({
            ...e,
            date: new Date(e.date),
            organizerId: user._id,
            capacity: 100 // Default capacity since it wasn't specified but schema might require logic or just optional
        }));

        // Insert Events
        const insertedEvents = await Event.insertMany(eventsToInsert);
        console.log(`Successfully inserted ${insertedEvents.length} past events.`);

        // Create Registrations for each event
        const registrations = insertedEvents.map(event => ({
            userId: user._id,
            eventId: event._id,
            registeredAt: new Date(event.date) // Backdate the registration to the event date
        }));

        await Registration.insertMany(registrations);
        console.log(`Successfully registered user for ${registrations.length} events.`);

        console.log('Past events seeding complete!');
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedPast();
