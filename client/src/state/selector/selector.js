// // src/state/selectors/userListSelector.js
// import { selector } from 'recoil';

// export const userListSelector = selector({
//   key: 'userListSelector',
//   get: async () => {
//     const token = localStorage.getItem('token'); // Get JWT token from localStorage

//     if (!token) {
//       return [];
//     }

//     try {
//       const response = await fetch('https://api.example.com/users', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,  // Send JWT token in Authorization header
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         return data.users;  // Return the user list
//       } else {
//         console.error('Failed to fetch user list');
//         return [];
//       }
//     } catch (error) {
//       console.error('Error fetching user list:', error);
//       return [];
//     }
//   },
// });
