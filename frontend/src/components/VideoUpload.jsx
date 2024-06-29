/* eslint-disable react/prop-types */
import { useState } from 'react';
import { storage } from '../services/firebase';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import Loader from './Loader';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const VideoUpload = ({ onClose, fetchVideos, setDisableClose }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { user, setUploadingVideo } = useAuth();

    const validateFile = (file) => {
        if (file.type !== 'video/mp4') {
            setError('Only MP4 files are allowed');
            return false;
        }
        if (file.size > 6 * 1024 * 1024) {
            setError('File size must be less than 6MB');
            return false;
        }
        return true;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && validateFile(selectedFile)) {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setDisableClose(true);
        setError('');

        try {
            const thumbnailBlob = await generateThumbnail(file);

            const videoStorageRef = ref(storage, `videos/${user._id}/${file.name}`);
            const videoMetadata = {
                contentType: 'video/mp4',
            };
            await uploadBytes(videoStorageRef, file, videoMetadata);
            const videoDownloadURL = await getDownloadURL(videoStorageRef);

            const thumbnailStorageRef = ref(storage, `thumbnails/${user._id}/${file.name.replace('.mp4', '_thumb.jpg')}`);
            const thumbnailMetadata = {
                contentType: 'image/jpeg',
            };
            await uploadBytes(thumbnailStorageRef, thumbnailBlob, thumbnailMetadata);
            const thumbnailDownloadURL = await getDownloadURL(thumbnailStorageRef);

            await api.post('/videos', {
                title,
                description,
                url: videoDownloadURL,
                thumbnail: thumbnailDownloadURL
            });

            setUploading(false);
            setDisableClose(false);
            setUploadingVideo(true);
            setFile(null);
            setTitle('');
            setDescription('');
            setMessage('Video uploaded successfully!');
            setTimeout(() => {
                setMessage('');
                onClose();
                fetchVideos(); 
            }, 2000);
        } catch (error) {
            console.error("Upload failed:", error);
            setError('Upload failed. Please try again.');
            setUploading(false);
            setDisableClose(false);
        }
        setFile(null);
    };

    const generateThumbnail = (file) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            let retries = 5;

            const generateCanvas = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(
                    (blob) => {
                        resolve(blob);
                    },
                    'image/jpeg',
                    0.9
                );
            };

            video.onloadedmetadata = () => {
                video.currentTime = 2;
            };

            video.onseeked = () => {
                if (video.currentTime < video.duration && retries > 0) {
                    generateCanvas();
                } else if (retries > 0) {
                    video.currentTime += 1;
                    retries -= 1;
                } else {
                    reject(new Error('Failed to generate thumbnail.'));
                }
            };

            video.onerror = reject;
            video.src = URL.createObjectURL(file);
        });
    };

    return (
        <form onSubmit={handleUpload} className="space-y-4">
            <input
                type="file"
                accept="video/mp4"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
            />
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (max 30 characters)"
                maxLength={30}
                className="w-full px-3 py-2 border rounded-md"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (max 120 characters)"
                maxLength={120}
                className="w-full px-3 py-2 border rounded-md"
            />
            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={uploading || !file || !title || !description}
            >
                {uploading ? <Loader /> : 'Upload Video'}
            </button>
            {message && <p className="text-green-500">{message}</p>}
        </form>
    );
};

export default VideoUpload;
