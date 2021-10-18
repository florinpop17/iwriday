import { useState } from "react";

const PopupNewsletter = () => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="fixed bottom-0 right-0 m-2">
            {showPopup ? (
                <div className="bg-purple-800 flex flex-col p-8 rounded shadow space-y-4 relative">
                    <p className="text-white text-4xl font-bold text-center mb-2">
                        Get notified
                        <span className="block text-2xl lowercase font-light">
                            of upcoming features
                        </span>
                    </p>
                    <form
                        className="flex flex-col space-y-4"
                        action="https://app.convertkit.com/forms/2695618/subscriptions"
                        method="post"
                        data-sv-form="2695618"
                        data-uid="485a881341"
                        data-format="inline"
                        data-version="5"
                        data-options='{"settings":{"after_subscribe":{"action":"message","success_message":"Success! Now check your email to confirm your subscription.","redirect_url":""},"analytics":{"google":null,"facebook":null,"segment":null,"pinterest":null,"sparkloop":null,"googletagmanager":null},"modal":{"trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"powered_by":{"show":true,"url":"https://convertkit.com?utm_source=dynamic&amp;utm_medium=referral&amp;utm_campaign=poweredby&amp;utm_content=form"},"recaptcha":{"enabled":true},"return_visitor":{"action":"show","custom_content":""},"slide_in":{"display_in":"bottom_right","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"sticky_bar":{"display_in":"top","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15}},"version":"5"}'
                    >
                        <input
                            className="text-purple-800 rounded px-4 py-3 font-semibold text-lg"
                            type="email"
                            name="email_address"
                            aria-label="Your email address"
                            placeholder="Email"
                        />
                        <button className="bg-purple-600 text-white rounded px-4 py-3 font-semibold text-lg">
                            Keep me updated
                        </button>
                    </form>

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
                    className=" bg-purple-700 text-white rounded-full px-4 md:px-8 py-4 font-semibold text-lg shadow-lg"
                    onClick={() => setShowPopup(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="block md:hidden"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#ffffff"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <polyline points="3 7 12 13 21 7" />
                    </svg>
                    <span className="hidden md:block">Stay updated</span>
                </button>
            )}
        </div>
    );
};

export default PopupNewsletter;
