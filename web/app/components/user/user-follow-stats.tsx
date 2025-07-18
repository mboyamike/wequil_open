/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useMemo, type JSX } from 'react';
import type { User } from '~/lib/types/user';
import { NumberStats } from '../tweet/number-stats';
import { Link } from 'react-router';

type UserFollowStatsProps = Pick<User, 'following' | 'followers'>;
type Stats = [string, string, number, number];

export function UserFollowStats({
  following,
  followers
}: UserFollowStatsProps): JSX.Element {
  const totalFollowing = following.length;
  const totalFollowers = followers.length;

  const [{ currentFollowers, currentFollowing }, setCurrentStats] = useState({
    currentFollowing: totalFollowing,
    currentFollowers: totalFollowers
  });

  useEffect(() => {
    setCurrentStats({
      currentFollowing: totalFollowing,
      currentFollowers: totalFollowers
    });
  }, [totalFollowing, totalFollowers]);

  const followingMove = useMemo(
    () => (totalFollowing > currentFollowing ? -25 : 25),
    [totalFollowing]
  );

  const followersMove = useMemo(
    () => (totalFollowers > currentFollowers ? -25 : 25),
    [totalFollowers]
  );

  const {
    query: { id }
  } = useRouter();

  const userPath = `/user/${id as string}`;

  const allStats: Readonly<Stats[]> = [
    ['Following', `${userPath}/following`, followingMove, currentFollowing],
    ['Follower', `${userPath}/followers`, followersMove, currentFollowers]
  ];

  return (
    <div
      className='flex gap-4 text-light-secondary dark:text-dark-secondary
                 [&>a>div]:font-bold [&>a>div]:text-light-primary 
                 dark:[&>a>div]:text-dark-primary'
    >
      {allStats.map(([title, link, move, stats], index) => (
        <Link
          to={link}
          key={title}
          className='hover-animation mt-0.5 mb-[3px] flex h-4 items-center gap-1 border-b 
                     border-b-transparent outline-none hover:border-b-light-primary 
                     focus-visible:border-b-light-primary dark:hover:border-b-dark-primary
                     dark:focus-visible:border-b-dark-primary'
        >
          <NumberStats move={move} stats={stats} alwaysShowStats />
          <p>{index === 1 && stats > 1 ? `${title}s` : title}</p>
        </Link>
      ))}
    </div>
  );
}
function useRouter(): { query: { id: any; }; } {
  throw new Error('Function not implemented.');
}

