import Link from "next/link";
import Head from "next/head";
import Sidebar from "./Sidebar";

const isBrowser = typeof window !== "undefined";

const Layout = ({ children }) => (
    <div className="max-w-5xl mx-auto px-4">
        <Head>
            {isBrowser && (
                <>
                    <script
                        async
                        defer
                        data-domain="iwriday.com"
                        src="https://plausible.io/js/plausible.outbound-links.js"
                    ></script>
                </>
            )}
        </Head>
        <div className="text-center text-white relative">
            <Link href="/how-it-works">
                <button
                    className="
                    absolute
                    top-0
                    right-0
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
            <Link href="/">
                <h1 className="cursor-pointer text-5xl font-bold pt-4">
                    ✍ iWriDay
                </h1>
            </Link>
            <p className="text-xl font-semibold my-4">
                Form a daily writing habit while building your Twitter Audience
            </p>
        </div>
        <div className="flex space-x-4">
            <main className="md:w-3/4">{children}</main>
            <div className="md:w-1/4 md:block hidden">
                <Sidebar />
            </div>
        </div>
    </div>
);

export default Layout;
