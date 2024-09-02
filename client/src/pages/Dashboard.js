import React from 'react';
import { useRecoilValue } from 'recoil';
import { userFriendsState } from '../state/atom/atom';
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
  const user = useRecoilValue(userFriendsState); // Use Recoil state directly

  return (
    <div>
      <Appbar />
      <div className="m-8">
        {user ? (
          <>
            <Balance value={user.balance} /> {/* Display user's balance */}
            <Users />
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
