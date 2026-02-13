import { useState } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function CreateEvent() {
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Conference',
        capacity: '100',
        date: '',
        location: '',
        imageUrl: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/events', {
                ...formData,
                capacity: parseInt(formData.capacity),
                type: 'upcoming',
                status: 'Registered'
            });
            setLocation('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faff]">
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#1a1a3a] mb-4">
                            Host an Event
                        </h1>
                        <p className="text-gray-500 font-medium">
                            Share your passion with the community.
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-purple-500/5 border border-white">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1a1a3a] ml-1">Event Title</label>
                                <Input
                                    required
                                    placeholder="e.g. React Summit 2024"
                                    className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-lg"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#1a1a3a] ml-1">Category</label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={val => setFormData({ ...formData, category: val })}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-lg">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Conference">Conference</SelectItem>
                                            <SelectItem value="Workshop">Workshop</SelectItem>
                                            <SelectItem value="Meetup">Meetup</SelectItem>
                                            <SelectItem value="Concert">Concert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#1a1a3a] ml-1">Capacity</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            required
                                            placeholder="100"
                                            className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-lg pl-4"
                                            value={formData.capacity}
                                            onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#1a1a3a] ml-1">Date & Time</label>
                                    <div className="relative">
                                        <Input
                                            type="datetime-local"
                                            required
                                            className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-lg"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#1a1a3a] ml-1">Location</label>
                                    <Input
                                        required
                                        placeholder="City, State or Online URL"
                                        className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-lg"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1a1a3a] ml-1">Cover Image URL</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                    <Input
                                        required
                                        placeholder="https://images.unsplash.com/..."
                                        className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-lg pl-12"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 ml-1">Use an Unsplash URL for best results.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1a1a3a] ml-1">Description</label>
                                <Textarea
                                    required
                                    placeholder="Tell people what this event is about..."
                                    className="min-h-[150px] rounded-[1.5rem] bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-lg p-5"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xl font-bold shadow-xl shadow-purple-500/30 transition-all active:scale-[0.98] mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    'Create Event'
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
