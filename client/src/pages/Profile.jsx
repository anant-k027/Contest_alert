import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const Profile = () => {
  const { user, updateHandles, syncStats, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [handles, setHandles] = useState({
    codeforces: '',
    leetcode: '',
    codechef: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.platformHandles) {
      setHandles({
        codeforces: user.platformHandles.codeforces || '',
        leetcode: user.platformHandles.leetcode || '',
        codechef: user.platformHandles.codechef || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHandles(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveHandles = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      await updateHandles(handles);
      setMessage({ type: 'success', text: 'Handles saved successfully!' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to save handles. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncStats = async () => {
    setIsSyncing(true);
    setMessage('');
    try {
      await syncStats();
      setMessage({ type: 'success', text: 'Stats synced successfully!' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to sync stats. Please check your handles.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSynced = (dateString) => {
    if (!dateString) return 'Never synced';
    try {
      const userTimezone = user?.timezone || 'UTC';
      return dayjs(dateString).tz(userTimezone).format('MMM D, YYYY h:mm A');
    } catch (e) {
      return dayjs(dateString).format('MMM D, YYYY h:mm A');
    }
  };

  const stats = user?.platformStats || {};

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-teal-100 animate-fade-in">
      {/* Navbar / Header */}
      <header className="bg-[#F5F2EA] border-b border-[#EBE6DD] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/dashboard')}
          >
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
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/preferences')}
              className="text-sm font-medium text-stone-500 hover:text-teal-700 transition-colors"
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
      <main className="max-w-5xl mx-auto px-6 py-10 animate-slide-up">
        
        <div className="flex justify-between items-end mb-8 border-b border-[#EBE6DD] pb-4">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight mb-2">Your Profile</h2>
            <p className="text-stone-500">Link your handles and track your competitive programming stats.</p>
          </div>
          <button
            onClick={handleSyncStats}
            disabled={isSyncing}
            className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSyncing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Syncing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Now
              </>
            )}
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Handles Form */}
          <div className="lg:col-span-1">
            <section className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm h-full">
              <h3 className="text-lg font-bold text-stone-800 mb-6">Platform Handles</h3>
              <form onSubmit={handleSaveHandles} className="space-y-5">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">Codeforces</label>
                  <input
                    type="text"
                    name="codeforces"
                    value={handles.codeforces}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                    placeholder="e.g. tourist"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">LeetCode</label>
                  <input
                    type="text"
                    name="leetcode"
                    value={handles.leetcode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                    placeholder="e.g. neetcode"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">CodeChef</label>
                  <input
                    type="text"
                    name="codechef"
                    value={handles.codechef}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                    placeholder="e.g. genady"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-stone-800 text-white px-4 py-2.5 mt-2 rounded-xl font-medium shadow-sm hover:bg-stone-900 focus:outline-none focus:ring-4 focus:ring-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving ? 'Saving...' : 'Save Handles'}
                </button>
              </form>
            </section>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Codeforces Stats */}
            <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600 text-lg">CF</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg">Codeforces</h3>
                    {user?.platformHandles?.codeforces ? (
                      <span className="text-sm text-stone-500">@{user.platformHandles.codeforces}</span>
                    ) : (
                      <span className="text-sm text-orange-500">Not linked</span>
                    )}
                  </div>
                </div>
                {stats.codeforces && (
                  <div className="text-right">
                    <span className="block text-xs text-stone-400 font-medium">Last Synced</span>
                    <span className="block text-xs text-stone-500">{formatLastSynced(stats.codeforces.lastSyncedAt)}</span>
                  </div>
                )}
              </div>

              {stats.codeforces?.error ? (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
                  {stats.codeforces.error}
                </div>
              ) : stats.codeforces ? (
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#EBE6DD]">
                    <span className="block text-xs text-stone-500 font-medium mb-1">Current Rating</span>
                    <span className="block text-xl font-bold text-stone-800">{stats.codeforces.rating}</span>
                  </div>
                  <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#EBE6DD]">
                    <span className="block text-xs text-stone-500 font-medium mb-1">Rank</span>
                    <span className="block text-xl font-bold text-stone-800 capitalize">{stats.codeforces.rank}</span>
                  </div>
                  <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#EBE6DD]">
                    <span className="block text-xs text-stone-500 font-medium mb-1">Problems Solved</span>
                    <span className="block text-xl font-bold text-stone-800">{stats.codeforces.solved}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-stone-400 text-sm">
                  {user?.platformHandles?.codeforces ? 'Click "Sync Now" to fetch stats' : 'Link your handle to see stats'}
                </div>
              )}
            </div>

            {/* LeetCode Stats */}
            <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="font-bold text-orange-600 text-lg">LC</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg">LeetCode</h3>
                    {user?.platformHandles?.leetcode ? (
                      <span className="text-sm text-stone-500">@{user.platformHandles.leetcode}</span>
                    ) : (
                      <span className="text-sm text-orange-500">Not linked</span>
                    )}
                  </div>
                </div>
                {stats.leetcode && (
                  <div className="text-right">
                    <span className="block text-xs text-stone-400 font-medium">Last Synced</span>
                    <span className="block text-xs text-stone-500">{formatLastSynced(stats.leetcode.lastSyncedAt)}</span>
                  </div>
                )}
              </div>

              {stats.leetcode?.error ? (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
                  {stats.leetcode.error}
                </div>
              ) : stats.leetcode ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#EBE6DD] md:col-span-1">
                    <span className="block text-xs text-stone-500 font-medium mb-1">Contest Rating</span>
                    <span className="block text-xl font-bold text-stone-800">{stats.leetcode.rating}</span>
                  </div>
                  <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#EBE6DD] md:col-span-3 flex justify-around items-center">
                    <div className="text-center">
                      <span className="block text-xs text-stone-500 font-medium mb-1">Total Solved</span>
                      <span className="block text-xl font-bold text-stone-800">{stats.leetcode.solved}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs text-teal-600 font-medium mb-1">Easy</span>
                      <span className="block text-lg font-bold text-stone-800">{stats.leetcode.easy}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs text-orange-500 font-medium mb-1">Medium</span>
                      <span className="block text-lg font-bold text-stone-800">{stats.leetcode.medium}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs text-red-500 font-medium mb-1">Hard</span>
                      <span className="block text-lg font-bold text-stone-800">{stats.leetcode.hard}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-stone-400 text-sm">
                  {user?.platformHandles?.leetcode ? 'Click "Sync Now" to fetch stats' : 'Link your handle to see stats'}
                </div>
              )}
            </div>

            {/* CodeChef Stats */}
            <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm flex flex-col justify-between opacity-75">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
                    <span className="font-bold text-stone-600 text-lg">CC</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg">CodeChef</h3>
                    {user?.platformHandles?.codechef ? (
                      <span className="text-sm text-stone-500">@{user.platformHandles.codechef}</span>
                    ) : (
                      <span className="text-sm text-stone-400">Not linked</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 text-stone-500 text-sm p-4 rounded-xl border border-[#EBE6DD]">
                {stats.codechef?.error ? stats.codechef.error : 'CodeChef sync is coming soon.'}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
