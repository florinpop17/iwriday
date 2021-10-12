require("dotenv").config();

const sanitizeHtml = require("sanitize-html");
const Twit = require("twit");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;
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

// TODO: RUN THE BELOW CODE EVERY 1 MINUTE

T.get(
    "search/tweets",
    { q: `"${query}"`, count: 100 },
    async function (err, data, response) {
        const { statuses } = data;

        if (statuses) {
            for (const status of statuses) {
                const text = status.text;

                if (text.toLowerCase() === query.toLowerCase()) {
                    const id = status.id_str;
                    const isReply = !!status.in_reply_to_status_id_str;

                    // check if the post is already in the DB
                    const post = await getPostById(id);

                    console.log(post);

                    if (post) {
                        console.log("###: Post already exists");
                        continue;
                    } else {
                        console.log("###: NEW POST!");
                    }

                    // check if this is a reply
                    if (isReply) {
                        const date = status.created_at;
                        const username = status.user.screen_name;
                        const parentId = status.in_reply_to_status_id_str;

                        const referenceId = id;

                        getParentTweets(parentId, referenceId);

                        threads[referenceId] = {
                            username,
                            date,
                            tweets: [text],
                        };
                    }
                }
            }
        }

        if (err) {
            // console.log(err);
        }
    }
);

function getParentTweets(parentId, referenceId) {
    T.get(
        `statuses/show`,
        { id: parentId, tweet_mode: "extended" },
        async function (err, status, response) {
            const text = sanitizeHtml(status.full_text + "\n\n\n");
            const isReply = !!status.in_reply_to_status_id_str;
            const date = status.created_at;

            // don't save the thread if the @add command is not added in the same day as the thread was written
            if (
                !isSameDay(new Date(date), new Date(threads[referenceId].date))
            ) {
                return;
            }

            if (isReply) {
                const parentId = status.in_reply_to_status_id_str;
                getParentTweets(parentId, referenceId);

                threads[referenceId].tweets.push(text);
            } else {
                threads[referenceId].tweets.push(text);

                // save to the DB
                const username = threads[referenceId].username;
                const date = threads[referenceId].date;
                const url = `https://twitter.com/${username}/status/${parentId}`;

                const full_text = threads[referenceId].tweets
                    .reverse()
                    .slice(0, -1)
                    .reduce((acc, text) => (acc += text), "")
                    // remove the last 3 \n
                    .slice(0, -3);

                const word_count = full_text
                    .replace(/\s\s+/g, " ")
                    .trim()
                    .split(" ").length;

                // check if there is a user
                const { data: user, error: userError } = await supabase
                    .from("public_users")
                    .select("id, streak, last_day_posted")
                    .eq("username", username)
                    .single();

                if (user) {
                    console.log("user exist", username);

                    const { id: user_id, streak, last_day_posted } = user;
                    // we have a user, use it
                    // create the post with the data
                    const { data: post, error: postError } = await supabase
                        .from("posts")
                        .insert({
                            id: referenceId,
                            full_text,
                            date,
                            word_count,
                            url,
                            user_id,
                        });

                    if (post) {
                        const sameDay = isSameDay(
                            new Date(last_day_posted),
                            new Date(date)
                        );

                        const newStreak = sameDay ? streak : streak + 1;

                        // update the user with the coresponding streak and last_day_posted
                        await supabase
                            .from("public_users")
                            .update({
                                streak: newStreak,
                                last_day_posted: date,
                            })
                            .match({ id: user_id });
                    }
                } else {
                    console.log("NEW user", username);
                    // create the user
                    const { data: user, error: userError } = await supabase
                        .from("public_users")
                        .insert({
                            streak: 1,
                            last_day_posted: date,
                            username,
                        })
                        .single();

                    const user_id = user.id;
                    // console.log(user);

                    if (user) {
                        await supabase
                            .from("posts")
                            .insert({
                                id: referenceId,
                                full_text,
                                date,
                                word_count,
                                url,
                                user_id,
                            })
                            .single();
                    }
                }

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

async function getPostById(id) {
    const { data: post, error: postError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (postError) {
        console.error(postError);
    }

    return post;
}

// async function getUserByUsername(username) {
//     const { data: user, error: userError } = await supabase
//         .from("public_users")
//         .select("id")
//         .eq("username", username)
//         .single();

//     if (userError) {
//         console.error(userError);
//     }

//     return user;
// }
