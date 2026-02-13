import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

export default function Auth() {
    const [, setLocation] = useLocation();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                await login(formData.username, formData.password);
            } else {
                await register(formData.name, formData.email, formData.username, formData.password);
            }
            setLocation('/');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 font-display font-bold text-2xl text-primary mb-2">
                        <Calendar className="w-8 h-8" />
                        EventHub
                    </div>
                    <h2 className="text-3xl font-bold font-display">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
                    </p>
                </div>

                <div className="bg-card p-8 rounded-2xl border border-border shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Name</label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Email</label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Username</label>
                            <Input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Password</label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full">
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary hover:underline"
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
