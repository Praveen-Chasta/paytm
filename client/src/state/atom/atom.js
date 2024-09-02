import { atom } from 'recoil'

export const userFriendsState = atom({
      key: 'userFriendsState', 
      default: 
      {
        balance: 0, 
        username: '' 
      },
  });