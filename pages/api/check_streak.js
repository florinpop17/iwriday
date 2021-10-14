require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

// TODO: RUN THE BELOW CODE EVERY DAY AT THE END
export default function handler(req, res) {
    return new Promise((resolve, reject) => {
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        console.log("Updating streak...");

        updateStreak().then((data) => {
            console.log(data);
            res.status(200).json(data);
            resolve();
        });

        async function updateStreak() {
            const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);

            const { data: users, error } = await supabase
                .from("public_users")
                .select("id, last_day_posted");

            // console.log(data);

            for (const user of users) {
                const lastDayPosted = new Date(user.last_day_posted).getTime();
                const { id } = user;

                if (yesterday > lastDayPosted) {
                    await supabase
                        .from("public_users")
                        .update({ streak: 0 })
                        .match({ id });
                }
            }

            return { status: "filiiiiiiiiiiipinooooo" };
        }
    });
}
