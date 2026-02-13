require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

const fs = require('fs');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const output = [];

        const u1 = await User.findOne({ email: 'arockiadassj5@gmail.com' });
        output.push(`User arockiadassj5: ${u1 ? `${u1._id} (${u1.username})` : 'NOT FOUND'}`);

        const u2 = await User.findOne({ username: 'organizer' });
        output.push(`User organizer: ${u2 ? `${u2._id} (${u2.email})` : 'NOT FOUND'}`);

        const totalEvents = await Event.countDocuments({});
        output.push(`Total Events: ${totalEvents}`);

        const pastEvents = await Event.find({ type: 'past' });
        output.push(`Past Events count: ${pastEvents.length}`);

        if (u1) {
            const regs1 = await Registration.find({ userId: u1._id });
            output.push(`Registrations for arockiadassj5: ${regs1.length}`);
        }

        if (u2) {
            const regs2 = await Registration.find({ userId: u2._id });
            output.push(`Registrations for organizer: ${regs2.length}`);
        }

        fs.writeFileSync('debug_output.txt', output.join('\n'));
        console.log('Written to debug_output.txt');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
