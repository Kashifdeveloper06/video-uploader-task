/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [uploadingVideo]);

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data.data);

            const userDetailsResponse = await api.get(`/users/${response.data.data._id}`);
            setBio(userDetailsResponse.data.data.bio || '');
            setProfilePicture(userDetailsResponse?.data.data.profilePicture || null);

            const videos = await api.get(`/videos/user/${response.data.data._id}`);
            setVideos(videos.data.data);

        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (firstName, password) => {
        const response = await api.post('/auth/login', { firstName, password });
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        setUser,
        loading,
        login,
        logout,
        videos,
        setUploadingVideo,
        bio,
        setBio,
        profilePicture,
        setProfilePicture,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};