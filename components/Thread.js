import Link from "next/link";
import { useState } from "react";
import { timeSince } from "../lib/timeSince";

const Thread = ({
    thread: { full_text, word_count, date, url, public_users },
}) => {
    const [showFull, setShowFull] = useState(full_text.length < 500);
    const formatedDate = new Date(date);
    // not sure why - getTimezoneOffset works. Might break for someone else
    const timestamp = formatedDate.getTime();

    const { username } = public_users;

    const excerpt = showFull ? full_text : full_text.slice(0, 500) + "...";

    const handleShowFullText = () => {
        setShowFull(!showFull);
    };

    return (
        <div
            className="bg-purple-800 relative text-white my-4 p-4 rounded-lg shadow-lg"
            href={url}
            target="_blank"
        >
            <span className="bg-purple-700 text-xs text-purple-200 font-medium rounded-lg py-1 px-2 absolute top-4 right-12">
                {word_count} {word_count < 2 ? "word" : "words"}
            </span>
            <small className="text-purple-300">
                By{" "}
                <Link href={`/${username}`}>
                    <a className="font-semibold text-purple-200">@{username}</a>
                </Link>{" "}
                · {timeSince(timestamp)}
            </small>
            <div
                className="text-lg my-2"
                dangerouslySetInnerHTML={{
                    __html: `<p class="bg-purple-900 shadow-sm rounded p-3">${excerpt
                        // taking care of stupid stuff
                        .replace(/<[^>]*>/g, "")
                        // replaces return char with a paragraph
                        .replace(
                            /\n\n/g,
                            "</p><p class='mt-1 bg-purple-900 shadow-sm rounded p-3'>"
                        )}</p>`,
                }}
            />
            {!showFull ? (
                <button onClick={handleShowFullText}>Show more</button>
            ) : null}
            <a
                className="absolute top-4 right-4 text-purple-400"
                href={url}
                target="_blank"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-brand-twitter"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z" />
                </svg>
            </a>
        </div>
    );
};

export default Thread;
