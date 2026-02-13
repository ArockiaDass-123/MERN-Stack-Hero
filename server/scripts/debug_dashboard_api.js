require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const fs = require('fs');

const debugDashboard = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const output = [];

        const user = await User.findOne({ email: 'arockiadassj5@gmail.com' });
        output.push(`User: ${user._id}`);

        const registrations = await Registration.find({ userId: user._id }).populate('eventId');
        output.push(`Total Registrations found: ${registrations.length}`);

        const validRegistrations = registrations.filter(r => r.eventId);
        output.push(`Valid Registrations (with populated event): ${validRegistrations.length}`);

        validRegistrations.forEach((r, i) => {
            output.push(`Event ${i + 1}: ${r.eventId.title} | Date: ${r.eventId.date} | Type: ${r.eventId.type}`);
        });

        // Simulate Dashboard filtering
        const events = validRegistrations.map(r => r.eventId);
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const upcoming = events.filter(e => new Date(e.date) >= startOfToday);
        const past = events.filter(e => new Date(e.date) < startOfToday);

        output.push(`--- Dashboard Simulation ---`);
        output.push(`Current Date: ${startOfToday}`);
        output.push(`Upcoming Count: ${upcoming.length}`);
        output.push(`Past Count: ${past.length}`);

        past.forEach(e => output.push(`Past Event: ${e.title} (${e.date})`));

        fs.writeFileSync('debug_dashboard.txt', output.join('\n'));
        console.log('Written to debug_dashboard.txt');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugDashboard();
