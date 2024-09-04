import React from 'react';
import { useRecoilValue } from 'recoil';
import { userFriendsState } from '../state/atom/atom';

export const Appbar = () => {
  const user = useRecoilValue(userFriendsState);

  // Extract the first letter of the username
  const firstLetter = user?.username?.charAt(0).toUpperCase() || 'P'; 

  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">
        PayTM App
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">
          {user ? `Hello, ${user.username}` : 'Hello'}
        </div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {firstLetter}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
