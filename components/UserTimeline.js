import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import Thread from "./Thread";

const UserTimeline = ({ username }) => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        fetchThreads();
    }, [username]);

    const fetchThreads = async () => {
        let { data: users, error } = await supabase
            .from("public_users")
            .select("username, posts ( id, full_text, date, url, word_count )")
            .eq("username", username);

        // this code is 💩. change it soon!
        const user = users[0];

        if (user) {
            const { username } = user;
            const threads = user.posts
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((post) => ({
                    ...post,
                    public_users: { username },
                }));

            if (error) console.log("error", error);
            else {
                setThreads(threads);
            }
        }
    };

    return (
        <div>
            {threads.map((thread) => (
                <Thread key={thread.id} thread={thread} />
            ))}
        </div>
    );
};

export default UserTimeline;
