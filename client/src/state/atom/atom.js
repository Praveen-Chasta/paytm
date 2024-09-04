import { atom, selector } from 'recoil';

export const userFriendsState = atom({
  key: 'userFriendsState',
  default: selector({
    key: 'userFriendsStateValues',
    get: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return [];
      }

      try {
        const response = await fetch('https://api.example.com/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          return data.users;
        } else {
          console.error('Failed to fetch user list');
          return [];
        }
      } catch (error) {
        console.error('Error fetching user list:', error);
        return [];
      }
    },
  }),
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Load the state from localStorage on initialization
      const savedValue = localStorage.getItem('userFriendsState');
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      // Subscribe to changes and save to localStorage
      onSet((newValue, _, isReset) => {
        if (isReset) {
          localStorage.removeItem('userFriendsState');
        } else {
          localStorage.setItem('userFriendsState', JSON.stringify(newValue));
        }
      });
    }
  ]
});
