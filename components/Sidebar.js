import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

const Sidebar = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        let { data: users, error } = await supabase
            .from("public_users")
            .select("id, username, streak")
            .gt("streak", 0)
            .order("streak", { ascending: false });

        if (error) console.log("error", error);
        else {
            setUsers(users);
            // const leaderboard = {};
            // const users = [];

            // threads.forEach(({ username, word_count }) => {
            //     leaderboard[username] = leaderboard[username]
            //         ? leaderboard[username] + word_count
            //         : word_count;
            // });

            // for (let key in leaderboard) {
            //     users.push({
            //         username: key,
            //         total_word_count: leaderboard[key],
            //     });
            // }

            // users.sort((a, b) => b.total_word_count - a.total_word_count);

            // setUsers(users);
        }
    };

    return (
        <div className="my-4 p-3 text-purple-100">
            <h3 className="text-3xl font-semibold mb-4">Leaderboard</h3>
            {users.map(({ id, username, streak }) => (
                <div key={id} className="flex justify-between text-sm">
                    <Link href={`./${username}`}>
                        <p className="cursor-pointer text-lg font-semibold">
                            @{username}
                        </p>
                    </Link>
                    <span>🔥 {streak}</span>
                </div>
            ))}
            <div className="text-purple-200 mt-10 text-center">
                <p>
                    Project built by{" "}
                    <a
                        className="font-bold text-purple-400"
                        href="https://twitter.com/florinpop1705"
                        target="_blank"
                    >
                        Florin Pop
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
