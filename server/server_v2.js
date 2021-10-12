require("dotenv").config();

// IMPORTS
const sanitizeHtml = require("sanitize-html");
const Twit = require("twit");
const { createClient } = require("@supabase/supabase-js");

// SUPABASE
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// TWITTER
const T = new Twit({
    consumer_key: process.env.APPLICATION_CONSUMER_KEY_HERE,
    consumer_secret: process.env.APPLICATION_CONSUMER_SECRET_HERE,
    access_token: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

// CONSTANTS
const keyword = "add";
const username = "@iWriDay";
const query = `${username} ${keyword}`;
const threads = {};

// THE FLOW

// 1. Search all tweets with the query

T.get(
    "search/tweets",
    { q: `"${query}"`, count: 100 },
    async function (err, data) {
        const { statuses } = data;

        console.log("###: Tweets found");

        if (statuses) {
            for (const status of statuses) {
                const tweetId = status.id_str;
                const parentId = status.in_reply_to_status_id_str;
                const username = status.user.screen_name;
                const text = status.text;
                const date = status.created_at;

                // check if the post is already in the DB
                const post = await getPostById(tweetId);

                if (post) {
                    console.log("###: Post already exists");
                    return;
                }

                // check if the user exists. Create it if it doesn't
                let user = await getUserByUsername(username);

                console.log(user);

                if (!user) {
                    // create user
                    console.log("###: Creating user");

                    user = await createUser({
                        username,
                        streak: 1,
                        last_day_posted: date,
                    });

                    console.log(user);
                }

                console.log("###: Creating post");
                // USE THIS YOU DUMMY: user.id;

                // console.log({ tweetId, parentId, username, text });
            }
        }

        if (err) {
            console.error(err);
        }
    }
);
// 2. Check if the tweet is already stored in the database
//     2.a. If it's stored, just return
//     2.b. Else continue
// 3. Check if the user exists
//     3.a. If it doesn't, create it (with streak 0 and last_day_posted to null) and store the user_id
//     3.b. Else if it's already in the db, get the user_id
// 4. Get all the tweets from the thread and store them in an array, one by one
// 5. Once you reach the first tweet in the thread (the one which is not a reply) - store it in the db with the corresponding user_id
// 6. Check the streak
//     6.a If the user haven't tweeted in 24 hours, increase streak
//     6.b Else, keep the streak as it is

function getTweetsByQuery() {}

async function getTweetById(id) {}

async function createPost(post) {}

async function createUser(user) {
    const { data: newUser, error: userError } = await supabase
        .from("public_users")
        .insert(user)
        .single();

    if (userError) {
        console.error(userError);
    }

    return newUser;
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

async function getUserByUsername(username) {
    const { data: user, error: userError } = await supabase
        .from("public_users")
        .select("id")
        .eq("username", username)
        .single();

    if (userError) {
        console.error(userError);
    }

    return user;
}
