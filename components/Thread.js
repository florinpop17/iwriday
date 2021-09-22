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
            <span className="bg-purple-700 text-xs text-purple-200 font-medium rounded-lg py-1 px-2 absolute top-0 right-0 m-4">
                {word_count} {word_count < 2 ? "word" : "words"}
            </span>
            <small className="text-purple-300">
                By{" "}
                <Link href={`/${username}`}>
                    <a className="font-semibold">@{username}</a>
                </Link>{" "}
                {timeSince(timestamp)}
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
        </div>
    );
};

export default Thread;
