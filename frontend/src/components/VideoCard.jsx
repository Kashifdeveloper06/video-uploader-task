/* eslint-disable react/prop-types */

const VideoCard = ({ video }) => {

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-600">{video.description}</p>
                <div className="mt-4">
                    <video controls className="w-full">
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
