import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard.jsx';
import api from '../services/api.js';

const Home = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('/videos');
                setVideos(response.data);
            } catch (error) {
                console.error("Failed to fetch videos:", error);
            }
        };
        fetchVideos();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos ? videos.map(video => (
                <VideoCard key={video._id} video={video} />
            )): (
                <h3>No Video Found</h3>
            )}
        </div>
    );
};

export default Home;