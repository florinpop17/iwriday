require("dotenv").config();

const sanitizeHtml = require("sanitize-html");
const Twit = require("twit");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const T = new Twit({
    consumer_key: process.env.APPLICATION_CONSUMER_KEY_HERE,
    consumer_secret: process.env.APPLICATION_CONSUMER_SECRET_HERE,
    access_token: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const keyword = "add";
const username = "@iWriDay";
const query = `${username} ${keyword}`;

const threads = {};

console.log("Stream started! Go on!!!");

T.get(
    "search/tweets",
    { q: `"${query}"`, count: 50 },
    function (err, data, response) {
        const { statuses } = data;

        if (statuses) {
            statuses.forEach((status) => {
                // TODO: Reply to this tweet
                const text = sanitizeHtml(status.text);

                if (text === query) {
                    const user = status.user.screen_name;
                    const isReply = !!status.in_reply_to_status_id_str;
                    const id = status.id_str;
                    const date = status.created_at;

                    const tweet = {
                        id,
                        user,
                        text,
                        isReply,
                        date,
                    };

                    if (isReply) {
                        const parentId = status.in_reply_to_status_id_str;
                        const referenceId = id;
                        getParentTweets(parentId, referenceId);
                        threads[referenceId] = [tweet];
                    }
                }
            });
        }

        if (err) {
            console.log(err);
        }
    }
);

function getParentTweets(parentId, referenceId) {
    T.get(
        `statuses/show`,
        { id: parentId, tweet_mode: "extended" },
        async function (err, status, response) {
            const user = status.user.screen_name;
            const text = sanitizeHtml(status.full_text + "\n\n");
            const isReply = !!status.in_reply_to_status_id_str;
            const id = status.id_str;
            const date = status.created_at;

            // don't save the thread if the @add command is not added in the same day as the thread was written
            if (
                !isSameDay(
                    new Date(date),
                    new Date(threads[referenceId][0].date)
                )
            ) {
                return;
            }

            const tweet = {
                id,
                user,
                text,
                isReply,
            };

            if (isReply) {
                const parentId = status.in_reply_to_status_id_str;
                getParentTweets(parentId, referenceId);
                threads[referenceId].push(tweet);
            } else {
                threads[referenceId].push(tweet);

                // save to the DB
                const username = tweet.user;
                const url = `https://twitter.com/${username}/status/${id}`;
                const date = threads[referenceId][0].date;
                const full_text = threads[referenceId]
                    .reverse()
                    .slice(0, -1)
                    .reduce((acc, tweet) => (acc += tweet.text), "")
                    // remove the last 2 \n
                    .slice(0, -2);
                const word_count = full_text
                    .replace(/\s\s+/g, " ")
                    .trim()
                    .split(" ").length;

                const { data, error } = await supabase
                    .from("public_users")
                    .select("id, streak, last_day_posted")
                    .eq("username", username);

                console.log(data);

                if (data.length > 0) {
                    console.log("user exist");
                    const { id: user_id, streak, last_day_posted } = data[0];
                    // we have a user, use it
                    // create the post with the data
                    const { data: post, error: postError } = await supabase
                        .from("posts")
                        .insert([
                            {
                                id,
                                full_text,
                                date,
                                word_count,
                                url,
                                user_id,
                            },
                        ]);

                    console.log(post);

                    if (!postError) {
                        const sameDay = isSameDay(
                            new Date(last_day_posted),
                            new Date(date)
                        );
                        const newStreak = sameDay ? streak : streak + 1;

                        const { data: user, error: userError } = await supabase
                            .from("public_users")
                            .update({
                                streak: newStreak,
                                last_day_posted: date,
                            })
                            .match({ id: user_id });

                        console.log(user);
                    }
                } else {
                    // create the user
                    const { data: user, error: userError } = await supabase
                        .from("public_users")
                        .insert([
                            {
                                streak: 1,
                                last_day_posted: date, // figure out if this is ok
                                username,
                            },
                        ]);

                    const user_id = user[0].id;
                    console.log(user);

                    if (!userError) {
                        const { data: post, error: postError } = await supabase
                            .from("posts")
                            .insert([
                                {
                                    id,
                                    full_text,
                                    date,
                                    word_count,
                                    url,
                                    user_id,
                                },
                            ]);

                        console.log(post, postError);
                    }
                }

                // supabase
                //     .from("posts")
                //     .insert([
                //         { id, username, full_text, date, word_count, url, user_id },
                //     ])
                //     .then((data) => {
                //         console.log(data);
                //     })
                //     .catch((error) => console.error(error));

                // supabase
                //     .from("threads")
                //     .delete()
                //     .eq("id", id)
                //     .then((data) => {
                //         console.log(data);
                //     })
                //     .catch((error) => console.error(error));

                delete threads[referenceId];
            }
        }
    );
}

function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}
