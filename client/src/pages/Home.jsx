import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (category !== 'All') params.append('category', category);
                if (locationFilter !== 'All') params.append('location', locationFilter);

                const { data } = await axios.get(`/api/events?${params}`);
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [search, category, locationFilter]);

    const locations = events
        ? Array.from(new Set(events.map(e => e.location))).sort()
        : [];

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute top-20 right-0 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10" />

                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Discover Amazing Experiences</span>
                        </div>
                        <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight text-foreground">
                            Find your next <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent">unforgettable event</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        Discover conferences, workshops, and meetups tailored to your interests. Connect with communities that matter to you.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 p-2 bg-white dark:bg-card/50 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 border border-white/20 dark:border-white/10 max-w-3xl mx-auto flex flex-col md:flex-row gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search events..."
                                className="pl-9 bg-transparent border-transparent shadow-none focus-visible:ring-0 text-base h-12"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="h-px md:h-8 w-full md:w-px bg-border my-auto" />
                        <div className="w-full md:w-48">
                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                <SelectTrigger className="border-transparent shadow-none bg-transparent focus:ring-0 h-12">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <SelectValue placeholder="Location" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Locations</SelectItem>
                                    {locations.map(loc => (
                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="h-px md:h-8 w-full md:w-px bg-border my-auto" />
                        <div className="w-full md:w-48">
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="border-transparent shadow-none bg-transparent focus:ring-0 h-12">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Categories</SelectItem>
                                    <SelectItem value="Conference">Conference</SelectItem>
                                    <SelectItem value="Workshop">Workshop</SelectItem>
                                    <SelectItem value="Meetup">Meetup</SelectItem>
                                    <SelectItem value="Concert">Concert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-display">Upcoming Events</h2>
                    <span className="text-sm text-muted-foreground">Showing {events?.length || 0} results</span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : events && events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events.map((event) => (
                            <motion.div
                                key={event._id || event.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <EventCard {...event} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                            <Search className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No events found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
