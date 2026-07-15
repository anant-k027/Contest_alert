import React from 'react';
import dayjs from 'dayjs';

const platformColors = {
  codeforces: 'bg-red-50 text-red-700 border-red-200',
  leetcode: 'bg-amber-50 text-amber-700 border-amber-200',
  codechef: 'bg-stone-50 text-stone-700 border-stone-200',
  other: 'bg-slate-50 text-slate-700 border-slate-200',
};

const ContestCard = ({ contest }) => {
  const { name, platform, startTime, duration, url } = contest;

  // Convert UTC startTime to local timezone formatting
  const localStartTime = dayjs(startTime).tz();
  const dateFormatted = localStartTime.format('MMM D, YYYY');
  const timeFormatted = localStartTime.format('h:mm A');
  const timeZoneAbbr = dayjs.tz.guess().split('/')[1]?.replace('_', ' ') || 'Local Time';

  const badgeColor = platformColors[platform] || platformColors.other;

  // Format duration (which is in minutes) to Hours and Minutes
  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${badgeColor} capitalize`}>
          {platform}
        </span>
        <span className="text-slate-400 text-sm flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-4 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
        {name}
      </h3>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{dateFormatted} &middot; {timeFormatted}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatDuration(duration)}</span>
          </div>
          <span className="text-xs text-slate-400">{timeZoneAbbr}</span>
        </div>
      </div>
    </a>
  );
};

export default ContestCard;
