import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function EventDetails() {
    const { id } = useParams();
    const [, setLocation] = useLocation();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEvent = async () => {
        try {
            const { data } = await axios.get(`/api/events/${id}`);
            setEvent(data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        if (!user) {
            setLocation('/auth');
            return;
        }

        try {
            await axios.post(`/api/events/${id}/register`);
            fetchEvent();
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    const handleCancel = async () => {
        try {
            await axios.delete(`/api/events/${id}/register`);
            fetchEvent();
        } catch (error) {
            alert('Cancellation failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex justify-center items-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold">Event not found</h2>
                </div>
            </div>
        );
    }

    const spotsLeft = event.capacity - event.registeredCount;

    return (
        <div className="min-h-screen bg-[#f8faff]">
            <Navbar />

            {/* Background Header */}
            <div className="relative h-[450px] w-full mt-16 overflow-hidden">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8faff] via-background/40 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10 pb-20">
                <div className="grid lg:grid-cols-[1fr,380px] gap-8 items-start">

                    {/* Left Column: Event Info */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-purple-500/5 border border-white">
                        <Badge className="bg-purple-100 text-purple-600 border-none px-4 py-1.5 rounded-full mb-6 font-semibold hover:bg-purple-200 transition-colors">
                            {event.category}
                        </Badge>

                        <h1 className="text-5xl md:text-6xl font-display font-extrabold text-[#1a1a3a] mb-8 tracking-tight leading-[1.1]">
                            {event.title}
                        </h1>

                        <div className="flex flex-wrap gap-8 mb-12 border-t border-b border-gray-100 py-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm border border-purple-100/50">
                                    <Calendar className="w-7 h-7" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Date & Time</p>
                                    <p className="text-[#1a1a3a] font-bold text-lg">
                                        {format(new Date(event.date), "MMM d, yyyy")} • {event.time || format(new Date(event.date), "h:mm a")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Location</p>
                                    <p className="text-[#1a1a3a] font-bold text-lg leading-tight">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-[#1a1a3a] mb-6 tracking-tight">About this event</h2>
                            <p className="text-gray-500 leading-relaxed text-lg font-medium">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Registration Card */}
                    <div className="lg:sticky lg:top-28 space-y-6">
                        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-purple-500/10 border border-white">
                            <h2 className="text-2xl font-bold text-[#1a1a3a] mb-8 tracking-tight">Registration</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-center justify-between group">
                                    <p className="text-gray-500 font-medium group-hover:text-gray-900 transition-colors">Price</p>
                                    <p className="text-xl font-bold text-[#1a1a3a]">Free</p>
                                </div>

                                <div className="flex items-center justify-between group">
                                    <p className="text-gray-500 font-medium group-hover:text-gray-900 transition-colors">Capacity</p>
                                    <div className="flex items-center gap-2 text-[#1a1a3a] font-bold">
                                        <Users className="w-5 h-5 text-gray-400" />
                                        <span>{event.capacity || 50} seats</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between group">
                                    <p className="text-gray-500 font-medium group-hover:text-gray-900 transition-colors">Remaining</p>
                                    <p className="text-green-500 font-bold">{spotsLeft} spots left</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {event.isRegistered ? (
                                    <Button onClick={handleCancel} variant="destructive" className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-red-500/20">
                                        Cancel Registration
                                    </Button>
                                ) : spotsLeft > 0 ? (
                                    <Button
                                        onClick={handleRegister}
                                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-bold shadow-xl shadow-purple-500/30 transition-all active:scale-[0.98]"
                                    >
                                        Register Now
                                    </Button>
                                ) : (
                                    <Button disabled className="w-full h-16 rounded-2xl text-lg font-bold opacity-50 grayscale">
                                        Event Full
                                    </Button>
                                )}

                                <Button variant="outline" className="w-full h-14 rounded-2xl gap-3 text-gray-600 font-bold border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all">
                                    {/* Use a simple share icon if Lucide's isn't available, but we have Calendar/MapPin/Users... Share2 should be there */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.6" y1="6.51" y2="10.49" /></svg>
                                    Share Event
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
