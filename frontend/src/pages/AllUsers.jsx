import { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import api from '../services/api';

const AllUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">All Users</h2>
            <div className="flex flex-col gap-8">
                {users.map(user => (
                    <UserCard key={user._id} user={user} />
                ))}
            </div>
        </div>
    );
};

export default AllUsers;
