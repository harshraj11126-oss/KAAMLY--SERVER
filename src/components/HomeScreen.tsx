import React from 'react';
import {
  Search,
  PlusCircle,
  MapPin,
  Star,
  ShieldCheck,
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  BrickWall,
  Sparkles,
  Snowflake,
  Cpu,
  Flame,
  Users,
  ChevronRight,
  Phone,
  MessageSquare,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Navigation as NavigationIcon
} from 'lucide-react';
import { User, WorkerProfile, Job, UserLocation } from '../types';
import { POPULAR_CATEGORIES } from '../db/kaamlyStore';

interface HomeScreenProps {
  currentUser: User | null;
  currentLocation: UserLocation;
  workers: WorkerProfile[];
  jobs: Job[];
  onSelectCategory: (categoryName: string) => void;
  onSelectWorker: (worker: WorkerProfile) => void;
  onSelectJob: (job: Job) => void;
  onPostWorkClick: () => void;
  onSearchClick: () => void;
  onOpenLocationPicker: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-blue-400" />,
  Wrench: <Wrench className="w-6 h-6 text-emerald-400" />,
  Hammer: <Hammer className="w-6 h-6 text-amber-400" />,
  Paintbrush: <Paintbrush className="w-6 h-6 text-violet-400" />,
  BrickWall: <BrickWall className="w-6 h-6 text-orange-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-pink-400" />,
  Snowflake: <Snowflake className="w-6 h-6 text-cyan-400" />,
  Cpu: <Cpu className="w-6 h-6 text-rose-400" />,
  Flame: <Flame className="w-6 h-6 text-red-400" />,
  Users: <Users className="w-6 h-6 text-teal-400" />
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  currentLocation,
  workers,
  jobs,
  onSelectCategory,
  onSelectWorker,
  onSelectJob,
  onPostWorkClick,
  onSearchClick,
  onOpenLocationPicker
}) => {
  // Workers in current city
  const cityWorkers = workers.filter(
    (w) =>
      w.city.toLowerCase() === currentLocation.city.toLowerCase() ||
      w.state.toLowerCase() === currentLocation.state.toLowerCase()
  );
  const displayWorkers = cityWorkers.length > 0 ? cityWorkers : workers;

  // Open jobs in current city
  const cityJobs = jobs.filter(
    (j) =>
      j.status === 'open' &&
      (j.city.toLowerCase() === currentLocation.city.toLowerCase() ||
        j.state.toLowerCase() === currentLocation.state.toLowerCase())
  );
  const displayJobs = cityJobs.length > 0 ? cityJobs : jobs.filter((j) => j.status === 'open');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Location Awareness */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 pt-6 pb-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          {/* Location Badge */}
          <button
            onClick={onOpenLocationPicker}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 hover:border-amber-500/50 hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <NavigationIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Serving: </span>
            <span className="font-bold text-white">
              {currentLocation.city}, {currentLocation.district || currentLocation.state}
            </span>
            <span className="text-amber-400 font-semibold text-[11px] underline ml-1">Change</span>
          </button>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Local Work. <span className="text-amber-400">Trusted People.</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Direct connection between local Indian employers and skilled mistris, electricians, plumbers, carpenters, painters and daily helpers. 0% platform commission.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onPostWorkClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Post a Job for Free</span>
            </button>

            <button
              onClick={onSearchClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search Skilled Workers</span>
            </button>
          </div>

          {/* 3 Pillars of Trust */}
          <div className="grid grid-cols-3 gap-2 max-w-xl mx-auto pt-6 text-[11px] text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Phone Verified</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Direct Call & Chat</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Zero Middlemen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Popular Service Categories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Popular Work Categories</h2>
              <p className="text-xs text-slate-400">Choose a trade to find nearby available workers</p>
            </div>
            <button
              onClick={onSearchClick}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {POPULAR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-2xl text-left transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
                    {CATEGORY_ICONS[cat.icon] || <Wrench className="w-5 h-5 text-amber-400" />}
                  </div>
                  <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-amber-400">
                  {cat.averageRate}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Top Rated Workers Nearby */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Skilled Workers in {currentLocation.city}
              </h2>
              <p className="text-xs text-slate-400">
                Direct phone & chat contact with reviewed local professionals
              </p>
            </div>
            <button
              onClick={onSearchClick}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Search All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {displayWorkers.length === 0 ? (
            <div className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-300">No workers currently listed in this specific city.</p>
              <button
                onClick={onSearchClick}
                className="text-xs text-amber-400 font-bold hover:underline"
              >
                Search all regions across {currentLocation.state}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayWorkers.slice(0, 6).map((worker) => (
                <div
                  key={worker.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3.5">
                      <img
                        src={worker.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'}
                        alt={worker.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-amber-500/20 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white text-sm truncate">{worker.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{worker.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-amber-400 block mt-0.5">
                          {worker.category}
                        </span>

                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{worker.locality || worker.city}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                      {worker.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {worker.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Rate</span>
                      <span className="text-xs font-bold text-white">
                        ₹{worker.dailyRate || worker.hourlyRate || 300}
                        <span className="text-[10px] text-slate-400 font-normal">
                          {worker.dailyRate ? ' / day' : ' / hr'}
                        </span>
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectWorker(worker)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <span>View & Hire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Open Jobs in Current City */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Urgent Work Required in {currentLocation.city}
              </h2>
              <p className="text-xs text-slate-400">
                Jobs posted by local homeowners and businesses looking for workers
              </p>
            </div>
            <button
              onClick={onPostWorkClick}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              + Post a Job
            </button>
          </div>

          {displayJobs.length === 0 ? (
            <div className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 text-center space-y-3">
              <p className="text-sm text-slate-300">
                No active jobs currently posted in {currentLocation.city}.
              </p>
              <button
                onClick={onPostWorkClick}
                className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400"
              >
                Be the first to post work in {currentLocation.city}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayJobs.slice(0, 6).map((job) => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-semibold border border-amber-500/20">
                        {job.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {job.applicationsCount || 0} applied
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors line-clamp-2">
                      {job.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{job.locality}, {job.city}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Budget</span>
                      <span className="text-sm font-bold text-emerald-400">₹{job.budget}</span>
                    </div>

                    <span className="text-xs text-amber-400 font-bold group-hover:underline flex items-center gap-1">
                      View Details & Apply <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
