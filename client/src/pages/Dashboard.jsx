import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';
import { Loader2, Ticket, CalendarClock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [, setLocation] = useLocation();
    const { user, isLoading: authLoading } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            setLocation('/auth');
            return;
        }

        if (user) {
            const fetchMyEvents = async () => {
                try {
                    const { data } = await axios.get('/api/events/user/mine');
                    setEvents(data);
                } catch (error) {
                    console.error('Error fetching events:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMyEvents();
        }
    }, [user, authLoading, setLocation]);

    const safeDate = (d) => {
        const parsed = new Date(d);
        return isNaN(parsed.getTime()) ? new Date(0) : parsed;
    };

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const upcoming = events
        .filter(e => {
            try { return safeDate(e.date) >= startOfToday; }
            catch { return false; }
        })
        .sort((a, b) => safeDate(a.date) - safeDate(b.date));

    const past = events
        .filter(e => {
            try { return safeDate(e.date) < startOfToday; }
            catch { return false; }
        })
        .sort((a, b) => safeDate(b.date) - safeDate(a.date));

    if (loading || authLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="font-display font-bold text-3xl md:text-4xl text-[#1a1a3a]">My Dashboard</h1>
                        <p className="text-gray-500 mt-2">Manage your registrations and upcoming events.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-xl flex items-center gap-2">
                            <Ticket className="w-5 h-5" />
                            <span className="font-bold text-lg">{upcoming.length}</span>
                            <span className="text-sm font-medium opacity-80">Upcoming</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <CalendarClock className="w-6 h-6 text-purple-600" />
                        <h2 className="text-2xl font-bold font-display text-[#1a1a3a]">Upcoming Events</h2>
                    </div>

                    {upcoming.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {upcoming.map((event) => (
                                <motion.div
                                    key={event._id || event.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <EventCard
                                        {...event}
                                        isRegistered={true}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50/50 rounded-3xl p-10 text-center border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">You don't have any upcoming events.</p>
                            <a href="/" className="text-purple-600 font-semibold hover:underline">Browse events to join</a>
                        </div>
                    )}
                </section>

                {/* Past Section */}
                {past.length > 0 && (
                    <section className="opacity-75">
                        <h2 className="text-xl font-bold font-display mb-6 text-gray-400">Past Events</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 grayscale-[0.8] hover:grayscale-0 transition-all duration-500">
                            {past.map((event) => (
                                <EventCard
                                    key={event._id || event.id}
                                    {...event}
                                    isRegistered={true}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
