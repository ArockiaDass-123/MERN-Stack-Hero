require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const fixRegistrations = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const user = await User.findOne({ email: 'arockiadassj5@gmail.com' });
        if (!user) {
            console.error('User arockiadassj5 not found!');
            process.exit(1);
        }
        console.log(`Found user: ${user.email} (${user._id})`);

        // Find all "past" events
        const pastEvents = await Event.find({ type: 'past' });
        console.log(`Found ${pastEvents.length} past events.`);

        let newRegs = 0;
        for (const event of pastEvents) {
            // Check if already registered
            const existing = await Registration.findOne({ userId: user._id, eventId: event._id });
            if (!existing) {
                await Registration.create({
                    userId: user._id,
                    eventId: event._id,
                    registeredAt: event.date
                });
                console.log(`Registered for: ${event.title}`);
                newRegs++;
            } else {
                console.log(`Already registered for: ${event.title}`);
            }
        }

        console.log(`Fixed registrations. Added ${newRegs} new registrations.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixRegistrations();
