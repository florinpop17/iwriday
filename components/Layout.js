import Link from "next/link";
import Head from "next/head";
import Sidebar from "./Sidebar";

const isBrowser = typeof window !== "undefined";

const Layout = ({ children }) => (
    <div className="max-w-5xl mx-auto">
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
        <div className="text-center text-white">
            <Link href="/">
                <h1 className="cursor-pointer text-5xl font-bold pt-4">
                    ✍ iWriDay
                </h1>
            </Link>
            <p className="text-xl font-semibold my-4">
                Form a daily writing habit while building your Twitter Audience
            </p>
        </div>
        <div className=" flex space-x-4">
            <main className="w-3/4">{children}</main>
            <div className="w-1/4">
                <Sidebar />
            </div>
        </div>
    </div>
);

export default Layout;
