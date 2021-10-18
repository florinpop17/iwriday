import Link from "next/link";

const Nav = () => (
    <div className="relative">
        <nav className="flex justify-center md:absolute top-0 right-0 space-x-2">
            <Link href="/how-it-works">
                <button
                    className="
            bg-purple-800
            text-white
            font-semibold
            rounded-b
            px-4
            pt-4
            pb-2
            transform
            transition
            -translate-y-2
            hover:translate-y-0
        "
                >
                    How it works
                </button>
            </Link>

            <Link href="/leaderboard">
                <button
                    className="
                    md:hidden
            bg-purple-800
            text-white
            font-semibold
            rounded-b
            px-4
            pt-4
            pb-2
            transform
            transition
            -translate-y-2
            hover:translate-y-0
        "
                >
                    Leaderboard
                </button>
            </Link>
        </nav>
    </div>
);

export default Nav;
