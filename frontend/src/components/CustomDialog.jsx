/* eslint-disable react/prop-types */

const CustomDialog = ({ isOpen, onClose, title, children, disableClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all sm:max-w-lg sm:w-full">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                </div>
                <div className="p-6">
                    {children}
                </div>
                <div className="flex justify-end p-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ${disableClose ? 'cursor-not-allowed' : ''}`}
                        disabled={disableClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomDialog;
