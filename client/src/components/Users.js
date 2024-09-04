import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userFriendsState } from '../state/atom/atom'; // Import your recoil state
import { useNavigate } from "react-router-dom";

// Debounce function
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup timeout if value or delay changes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    const loggedInUser = useRecoilValue(userFriendsState); // Get logged-in user from Recoil state
    const navigate = useNavigate();

    // Debounced filter value
    const debouncedFilter = useDebounce(filter, 500); // Adjust delay as needed

    useEffect(() => {
        if (loggedInUser && loggedInUser.userId) {
            axios.get(`http://localhost:8000/user/bulk?filter=${debouncedFilter}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // If you're using JWT token
                }
            })
                .then(response => {
                    setUsers(response.data.user)
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }, [debouncedFilter, loggedInUser]);

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input 
                onChange={(e) => setFilter(e.target.value)} 
                type="text" 
                placeholder="Search users..." 
                className="w-full px-2 py-1 border rounded border-slate-200"
            />
        </div>
        <div>
            {users.map(user => <User key={user._id} user={user} />)}
        </div>
    </>
}

function User({user}) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button onClick={() => navigate(`/send?id=${user._id}&name=${user.firstName}`)} label={"Send Money"} />
            </div>
        </div>
    );
}
