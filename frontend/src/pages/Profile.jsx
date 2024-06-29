import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import VideoCard from '../components/VideoCard';
import VideoUpload from '../components/VideoUpload';
import api from '../services/api';
import { storage } from '../services/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { FaEdit, FaPlus } from 'react-icons/fa';
import CustomDialog from '../components/CustomDialog';

const Profile = () => {
    const { user, setUser, loading, videos, setVideos, bio, profilePicture, setProfilePicture, setBio, uploadingVideo } = useAuth();
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isVideoUploadDialogOpen, setIsVideoUploadDialogOpen] = useState(false);
    const [disableClose, setDisableClose] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('');

    const fileInputRef = useRef(null);

    const handleBioSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/users/${user._id}`, { bio });
            setUser(res.data.data);
            setIsEditingBio(false);
        } catch (error) {
            console.error("Failed to update bio:", error);
        }
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const storageRef = ref(storage, `profile_pictures/${user._id}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await api.put(`/users/${user._id}`, { profilePicture: downloadURL });
                setProfilePicture(downloadURL);
                setUploadProgress(0);
                setUploadMessage('Profile picture uploaded successfully!');
                setTimeout(() => setUploadMessage(''), 2000);
            }
        );
    };

    const fetchVideos = async () => {
        try {
            const response = await api.get(`/videos/user/${user._id}`);
            setVideos(response.data.data);
        } catch (error) {
            console.error("Failed to fetch videos:", error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [uploadingVideo]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="mb-6 flex items-center">
                <div
                    className="w-32 h-32 rounded-full bg-gray-200 mr-4 overflow-hidden cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                >
                    {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            Upload Picture
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    accept="image/*"
                />
                <div>
                    <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.phoneNumber}</p>
                </div>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4 text-blue-500">
                    Uploading: {uploadProgress.toFixed(2)}%
                </div>
            )}
            {uploadMessage && (
                <div className="mb-4 text-green-500">
                    {uploadMessage}
                </div>
            )}
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold mr-2">Bio</h3>
                    <button onClick={() => setIsEditingBio(true)} className="text-blue-600">
                        <FaEdit />
                    </button>
                </div>
                <p className="text-gray-700">{bio || 'No bio added yet.'}</p>
            </div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                    <FaPlus className="inline mr-2 cursor-pointer" onClick={() => setIsVideoUploadDialogOpen(true)} />
                    <span onClick={() => setIsVideoUploadDialogOpen(true)} className="cursor-pointer">
                        Upload Video
                    </span>
                </h3>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Your Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            </div>

            <CustomDialog isOpen={isEditingBio} onClose={() => setIsEditingBio(false)} title="Edit Bio">
                <form onSubmit={handleBioSubmit}>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={500}
                        rows={4}
                        className="w-full px-3 py-2 mb-3 border rounded-md"
                        placeholder="Write your bio here (max 500 characters)"
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setIsEditingBio(false)}
                            className="mr-2 px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </CustomDialog>

            <CustomDialog isOpen={isVideoUploadDialogOpen} onClose={() => setIsVideoUploadDialogOpen(false)} title="Upload Video" disableClose={disableClose}>
                <VideoUpload onClose={() => setIsVideoUploadDialogOpen(false)} fetchVideos={fetchVideos} setDisableClose={setDisableClose} />
            </CustomDialog>
        </div>
    );
};

export default Profile;
