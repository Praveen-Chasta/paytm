import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { userFriendsState } from '../state/atom/atom';
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
  const userLoadable = useRecoilValueLoadable(userFriendsState);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        {userLoadable.state === 'loading' && <p>Loading user data...</p>}
        {userLoadable.state === 'hasError' && <p>Error loading user data.</p>}
        {userLoadable.state === 'hasValue' && userLoadable.contents && (
          <>
            <Balance value={userLoadable.contents.balance || 0} />
            <Users />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
