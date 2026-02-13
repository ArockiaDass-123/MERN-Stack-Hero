import { Link } from 'wouter';
import { format } from 'date-fns';
import { MapPin, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function EventCard({
    _id,
    id,
    title,
    category,
    date,
    location,
    imageUrl,
    capacity,
    registeredCount,
    isRegistered
}) {
    const eventId = _id || id;
    const spotsLeft = capacity - registeredCount;

    return (
        <Link href={`/events/${eventId}`}>
            <a className="group block h-full">
                <div className="relative h-full bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        <div className="absolute top-4 left-4 z-20">
                            <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-foreground font-semibold px-3 py-1 shadow-sm">
                                {category}
                            </Badge>
                        </div>

                        {isRegistered && (
                            <div className="absolute top-4 right-4 z-20">
                                <Badge className="bg-green-500/90 hover:bg-green-500 backdrop-blur-md text-white border-0 gap-1 px-3 py-1 shadow-lg shadow-green-500/20">
                                    <CheckCircle2 className="w-3 h-3" /> Registered
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {date ? (
                                (() => {
                                    try {
                                        return format(new Date(date), "MMM d, yyyy • h:mm a");
                                    } catch (e) {
                                        return "Date pending";
                                    }
                                })()
                            ) : "Date pending"}
                        </div>

                        <h3 className="font-display font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {title}
                        </h3>

                        <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[120px]">{location}</span>
                            </div>

                            <div className="flex items-center gap-1.5 font-medium">
                                <Users className="w-3.5 h-3.5" />
                                <span className={spotsLeft < 10 ? "text-amber-600" : ""}>
                                    {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    );
}
