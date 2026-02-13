import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, User } from 'lucide-react';

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/">
                        <a className="flex items-center gap-2 font-display font-bold text-xl text-foreground hover:opacity-90 transition-opacity">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                                <Calendar className="w-6 h-6" />
                            </div>
                            EventFlow
                        </a>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link href="/">
                            <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Browse Events
                            </a>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/create-event">
                                    <a>
                                        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-purple-500/20 gap-2">
                                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                <span className="text-xs font-bold font-sans">+</span>
                                            </div>
                                            Create Event
                                        </Button>
                                    </a>
                                </Link>

                                <div className="relative group">
                                    <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:border-purple-200 hover:bg-purple-50 transition-all">
                                        <User className="w-5 h-5" />
                                    </button>

                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-purple-500/10 border border-gray-100 p-2 hidden group-hover:block transition-all transform origin-top-right z-50">
                                        <div className="px-4 py-3 border-b border-gray-100 mb-2">
                                            <p className="text-sm font-bold text-[#1a1a3a]">{user.name || 'User'}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>

                                        <Link href="/dashboard">
                                            <a className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-[#1a1a3a] hover:bg-gray-50 transition-colors mb-1">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                                                </div>
                                                Dashboard
                                            </a>
                                        </Link>

                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 ml-2" />
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/auth">
                                <a>
                                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl">Sign In</Button>
                                </a>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
