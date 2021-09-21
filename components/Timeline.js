import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import Thread from "./Thread";

const Timeline = () => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        let { data: threads, error } = await supabase
            .from("posts")
            .select(
                "id, full_text, date, url, word_count, public_users ( username ) "
            )
            .order("date", { ascending: false });

        if (error) console.log("error", error);
        else {
            setThreads(threads);
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

export default Timeline;
