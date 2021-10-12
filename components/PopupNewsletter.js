import { useState } from "react";

const PopupNewsletter = () => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="fixed bottom-0 right-0 m-4">
            {showPopup ? (
                <div className="bg-purple-800 flex flex-col p-8 rounded shadow space-y-4 relative">
                    <p className="text-white text-4xl font-bold text-center mb-2">
                        Get notified
                        <span className="block text-2xl lowercase font-light">
                            of upcoming features
                        </span>
                    </p>
                    <input
                        className="text-purple-800 rounded px-4 py-3 font-semibold text-lg"
                        type="text"
                        placeholder="Email"
                    />
                    <button className="bg-purple-600 text-white rounded px-4 py-3 font-semibold text-lg">
                        Keep me updated
                    </button>
                    <button
                        onClick={() => setShowPopup(false)}
                        className="bg-purple-800 rounded p-1 absolute -top-10 right-0"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="#ffffff"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            ) : (
                <button
                    className="bg-purple-800 text-white rounded-full px-8 py-4 font-semibold text-lg"
                    onClick={() => setShowPopup(true)}
                >
                    Stay updated
                </button>
            )}
        </div>
    );
};

export default PopupNewsletter;
