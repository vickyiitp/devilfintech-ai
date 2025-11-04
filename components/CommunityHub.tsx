// components/CommunityHub.tsx
import React, { useEffect, useState, memo } from 'react';
import { analyticsService } from '../services/analyticsService';
import { UserProfile } from '../types';
import { UserAvatar } from './avatars';
import { TrophyIcon } from './icons';

const Leaderboard: React.FC<{ users: UserProfile[] }> = memo(({ users }) => {
    const sortedUsers = [...users].sort((a, b) => b.score - a.score).slice(0, 5);

    return (
        <div className="leaderboard">
             <h3 className="text-center text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider flex items-center justify-center gap-2">
                <TrophyIcon className="w-5 h-5 text-yellow-400" />
                Top 5 Users
            </h3>
            <div className="space-y-2">
                {sortedUsers.map((user, index) => (
                    <div key={user.id} className="leaderboard-entry" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="leaderboard-rank">#{index + 1}</div>
                        <div className="leaderboard-user">
                            <UserAvatar avatarId={user.avatarId} className="avatar" />
                            <span className="font-medium text-white">{user.name}</span>
                        </div>
                        <div className="leaderboard-score">{user.score.toLocaleString()} pts</div>
                    </div>
                ))}
            </div>
        </div>
    );
});

const RecentUsers: React.FC<{ users: UserProfile[] }> = memo(({ users }) => {
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
        .slice(0, 12);

    if (recentUsers.length === 0) return null;

    return (
        <div>
            <h3 className="text-center text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Recently Active</h3>
            <div className="flex flex-wrap justify-center gap-3">
                {recentUsers.map((user, index) => (
                    <div key={user.id} className="user-tag" style={{ animationDelay: `${index * 50}ms` }}>
                        <UserAvatar avatarId={user.avatarId} className="avatar" />
                        <span>{user.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

export const CommunityHub: React.FC = memo(() => {
    const [communityUsers, setCommunityUsers] = useState<UserProfile[]>([]);

    useEffect(() => {
        const data = analyticsService.getCommunityData();
        setCommunityUsers(data.users);
    }, []);

    return (
        <div id="community" className="max-w-6xl 2xl:max-w-7xl mx-auto w-full mt-10 py-10">
            <div className="community-hub">
                <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">Join Our Growing Community</h2>
                <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">Compete for the top spot on the leaderboard by asking smart questions and using the app's powerful features.</p>
                
                <Leaderboard users={communityUsers} />

                {communityUsers.length > 0 && <div className="my-10 border-t border-[var(--border-color)] w-1/4 mx-auto"></div>}

                <RecentUsers users={communityUsers} />
            </div>
        </div>
    );
});
