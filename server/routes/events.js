const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect } = require('../middleware/auth');

// @route   GET /api/events
router.get('/', async (req, res) => {
    const { search, category, location } = req.query;
    let query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;
    if (location && location !== 'All') query.location = { $regex: location, $options: 'i' };

    try {
        const events = await Event.find(query).sort({ date: -1 });

        // Efficiently get registration counts and user registration status
        const eventIds = events.map(e => e._id);
        const registrations = await Registration.find({ eventId: { $in: eventIds } });

        let userRegs = new Set();
        if (req.headers.authorization) {
            // Optional check if user is logged in even for public list
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
                const myRegs = await Registration.find({ userId: decoded.id, eventId: { $in: eventIds } });
                userRegs = new Set(myRegs.map(r => r.eventId.toString()));
            } catch (e) { }
        }

        const enrichedEvents = events.map(event => {
            const regCount = registrations.filter(r => r.eventId.toString() === event._id.toString()).length;
            return {
                ...event.toObject(),
                id: event._id, // match frontend expectation
                registeredCount: regCount,
                isRegistered: userRegs.has(event._id.toString())
            };
        });

        res.json(enrichedEvents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/events/:id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const registeredCount = await Registration.countDocuments({ eventId: event._id });

        let isRegistered = false;
        if (req.headers.authorization) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
                const reg = await Registration.findOne({ userId: decoded.id, eventId: event._id });
                isRegistered = !!reg;
            } catch (e) { }
        }

        res.json({
            ...event.toObject(),
            id: event._id,
            registeredCount,
            isRegistered
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events/:id/register
router.post('/:id/register', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const registeredCount = await Registration.countDocuments({ eventId: event._id });
        if (registeredCount >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        const existing = await Registration.findOne({ userId: req.user._id, eventId: event._id });
        if (existing) {
            return res.status(400).json({ message: 'Already registered' });
        }

        const reg = await Registration.create({
            userId: req.user._id,
            eventId: event._id
        });

        res.status(201).json(reg);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/events/:id/register
router.delete('/:id/register', protect, async (req, res) => {
    try {
        await Registration.findOneAndDelete({ userId: req.user._id, eventId: req.params.id });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/events/user/mine
router.get('/user/mine', protect, async (req, res) => {
    try {
        const registrations = await Registration.find({ userId: req.user._id }).populate('eventId');

        // Filter out registrations where the event might have been deleted (eventId is null)
        const validRegistrations = registrations.filter(r => r.eventId);

        // Get registration counts for these events
        const eventIds = validRegistrations.map(r => r.eventId._id);
        const allRegs = await Registration.find({ eventId: { $in: eventIds } });

        const events = validRegistrations.map(r => {
            const regCount = allRegs.filter(reg => reg.eventId.toString() === r.eventId._id.toString()).length;
            return {
                ...r.eventId.toObject(),
                id: r.eventId._id,
                registeredAt: r.registeredAt,
                registeredCount: regCount,
                isRegistered: true
            };
        });

        res.json(events);
    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, location, date, time, capacity, category, imageUrl, status, type } = req.body;

        const event = await Event.create({
            title,
            description,
            location,
            date,
            time,
            capacity,
            category,
            imageUrl,
            status: status || 'Upcoming',
            type: type || 'upcoming',
            organizerId: req.user._id
        });

        // Auto-register organizer for their own event
        await Registration.create({
            userId: req.user._id,
            eventId: event._id
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
