import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Preferences = () => {
  const { user, updatePreferences, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [platforms, setPlatforms] = useState({
    codeforces: true,
    leetcode: true,
    codechef: true,
  });

  const [reminderTimes, setReminderTimes] = useState([]);
  const [channels, setChannels] = useState(['email']);
  const [timezone, setTimezone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Available options
  const timeOptions = [
    { value: 60, label: '1 Hour Before' },
    { value: 180, label: '3 Hours Before' },
    { value: 1440, label: '1 Day Before' },
  ];

  useEffect(() => {
    if (user?.notificationPreferences) {
      const prefs = user.notificationPreferences;
      
      setPlatforms({
        codeforces: prefs.followedPlatforms?.includes('codeforces') ?? true,
        leetcode: prefs.followedPlatforms?.includes('leetcode') ?? true,
        codechef: prefs.followedPlatforms?.includes('codechef') ?? true,
      });

      setReminderTimes(prefs.reminderTimes || [60]);
      setChannels(prefs.channels || ['email']);
      
      // Auto-detect timezone if not set
      if (!user.timezone || user.timezone === 'UTC') {
        try {
          setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        } catch (e) {
          setTimezone('UTC');
        }
      } else {
        setTimezone(user.timezone);
      }
    }
  }, [user]);

  const handlePlatformChange = (platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleReminderChange = (value) => {
    setReminderTimes(prev => {
      if (prev.includes(value)) {
        return prev.filter(t => t !== value);
      } else {
        return [...prev, value].sort((a, b) => a - b);
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const followedPlatforms = Object.keys(platforms).filter(key => platforms[key]);

    try {
      await updatePreferences({
        followedPlatforms,
        reminderTimes,
        channels,
        timezone
      });
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to save preferences. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-teal-100">
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
              onClick={logout}
              className="text-sm font-medium text-stone-500 hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-stone-800 tracking-tight mb-2">Notification Preferences</h2>
          <p className="text-stone-500">Customize what contests you see and how you're reminded.</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Platforms */}
          <section className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-4">Platforms to Follow</h3>
            <div className="space-y-3">
              {[
                { id: 'codeforces', label: 'Codeforces' },
                { id: 'leetcode', label: 'LeetCode' },
                { id: 'codechef', label: 'CodeChef' },
              ].map(platform => (
                <label key={platform.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border-2 border-stone-300 rounded cursor-pointer checked:bg-teal-600 checked:border-teal-600 transition-colors"
                      checked={platforms[platform.id]}
                      onChange={() => handlePlatformChange(platform.id)}
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-stone-700 font-medium group-hover:text-stone-900 transition-colors">{platform.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Reminders */}
          <section className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-1">Reminder Timings</h3>
            <p className="text-sm text-stone-500 mb-4">Select multiple if you'd like to be reminded more than once.</p>
            <div className="space-y-3">
              {timeOptions.map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border-2 border-stone-300 rounded cursor-pointer checked:bg-teal-600 checked:border-teal-600 transition-colors"
                      checked={reminderTimes.includes(opt.value)}
                      onChange={() => handleReminderChange(opt.value)}
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-stone-700 font-medium group-hover:text-stone-900 transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Channels & Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-4">Notification Channel</h3>
              <label className="flex items-center gap-3 cursor-not-allowed opacity-80">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox"
                    className="appearance-none w-5 h-5 border-2 border-teal-600 bg-teal-600 rounded cursor-not-allowed"
                    checked={true}
                    readOnly
                    disabled
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="block text-stone-700 font-medium">Email</span>
                  <span className="block text-xs text-stone-500">Sent to {user?.email}</span>
                </div>
              </label>
            </section>

            <section className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-4">Timezone</h3>
              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700">Your Local Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2 bg-[#FDFBF7] border border-[#EBE6DD] rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                  placeholder="e.g. America/New_York"
                />
                <p className="text-xs text-stone-500 mt-1">Usually auto-detected correctly.</p>
              </div>
            </section>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving || Object.values(platforms).every(v => !v) || reminderTimes.length === 0}
              className="bg-stone-800 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:bg-stone-900 focus:outline-none focus:ring-4 focus:ring-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
          
        </form>
      </main>
    </div>
  );
};

export default Preferences;
