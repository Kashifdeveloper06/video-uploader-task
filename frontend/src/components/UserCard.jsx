/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

const UserCard = ({ user }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserVideos = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/videos/user/${user._id}`);
                setVideos(response.data.data);
            } catch (error) {
                console.error("Failed to fetch user videos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserVideos();
    }, [user._id]);

    return (
        <div className='flex flex-col items-center p-4 bg-white shadow rounded-lg'>
            <div className="mb-6 flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden cursor-pointer">
                    <img src={user.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR81iX4Mo49Z3oCPSx-GtgiMAkdDop2uVmVvw&s'} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                </div>
            </div>
            {loading ? (
                <p>Loading videos...</p>
            ) : (
                <>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                        {videos.slice(0, 5).map(video => (
                            <div key={video._id} className='flex flex-col items-center'>
                                <a href={video.url} target="_blank" rel="noopener noreferrer" className='no-underline text-inherit cursor-pointer'>
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover mb-2 rounded-lg" />
                                    <h3 className="text-lg font-semibold">{video.title}</h3>
                                </a>
                            </div>
                        ))}
                    </div>
                    {videos.length > 5 && (
                        <div className="mt-4">
                            <Link to={`/user/${user._id}`} className="text-blue-500 hover:underline">View All</Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserCard;
