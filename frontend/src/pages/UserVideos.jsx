import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const UserVideos = () => {
    const { id } = useParams();
    const [videos, setVideos] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserVideos = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/videos/user/${id}`);
                setVideos(response.data.data);
            } catch (error) {
                console.error("Failed to fetch user videos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserVideos();
    }, [id]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const userDetailsResponse = await api.get(`/users/${id}`);
                setUser(userDetailsResponse.data.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className='flex flex-col'>
            <div className="mb-6 flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden cursor-pointer">
                    <img src={user.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR81iX4Mo49Z3oCPSx-GtgiMAkdDop2uVmVvw&s'} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}&apos;s Videos</h3>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                    <div key={user._id} className="bg-white shadow-md rounded-lg overflow-hidden gap-4">
                        <a href={video.url} target="_blank" rel="noopener noreferrer" className='no-underline text-inherit cursor-pointer'>
                        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                            <p className="text-gray-600">{video.description}</p>
                        </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserVideos;