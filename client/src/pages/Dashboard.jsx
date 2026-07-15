import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axios';
import ContestCard from '../components/ContestCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const { data: contests = [], isLoading, isError } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const response = await axiosInstance.get('/contests');
      return response.data;
    },
  });

  const followedPlatforms = user?.notificationPreferences?.followedPlatforms || ['codeforces', 'leetcode', 'codechef'];

  const filteredContests = contests.filter((c) => {
    if (filter === 'all') {
      return followedPlatforms.includes(c.platform);
    }
    return c.platform === filter;
  });

  const platforms = [
    { id: 'all', label: 'My Platforms' },
    { id: 'codeforces', label: 'Codeforces' },
    { id: 'leetcode', label: 'LeetCode' },
    { id: 'codechef', label: 'CodeChef' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-teal-100">
      {/* Navbar / Header */}
      <header className="bg-[#F5F2EA] border-b border-[#EBE6DD] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600/90 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              CA
            </div>
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">Contest Alert</h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-stone-500 hidden sm:inline-block">
              {user?.email}
            </span>
            <button 
              onClick={() => navigate('/preferences')}
              className="text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
            >
              Preferences
            </button>
            <button 
              onClick={logout}
              className="text-sm font-medium text-stone-500 hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-stone-800 tracking-tight mb-2">Upcoming Contests</h2>
          <p className="text-stone-500">Your personalized schedule of competitive programming contests.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilter(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === p.id 
                  ? 'bg-stone-700 text-[#FDFBF7] shadow-sm' 
                  : 'bg-white text-stone-500 border border-[#EBE6DD] hover:bg-[#F5F2EA] hover:text-stone-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[#EBE6DD] border-t-teal-500 rounded-full animate-spin"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-500 p-6 rounded-xl border border-red-100 text-center">
            Failed to load contests. Please try again later.
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="bg-white border border-[#EBE6DD] p-12 rounded-2xl text-center shadow-sm">
            <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-stone-800 mb-1">No contests found</h3>
            <p className="text-stone-500">There are no upcoming contests for this platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map(contest => (
              <ContestCard key={contest._id} contest={contest} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
