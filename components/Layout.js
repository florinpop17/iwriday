import Link from "next/link";
import Head from "next/head";
import Sidebar from "./Sidebar";
import Nav from "./Nav";
import PopupNewsletter from "./PopupNewsletter";

const isBrowser = typeof window !== "undefined";

const Layout = ({ children, showSidebar = true }) => (
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

                    <script
                        async
                        src="https://f.convertkit.com/ckjs/ck.5.js"
                    ></script>
                </>
            )}
        </Head>
        <div className="text-center text-white">
            <Nav />
            <Link href="/">
                <h1 className="cursor-pointer text-5xl font-bold pt-4">
                    ✍ iWriDay
                </h1>
            </Link>
            <p className="text-xl font-semibold my-4">
                Develop a daily writing habit while building your Twitter
                Audience.
            </p>
        </div>
        <div className="flex space-x-4">
            <main className="w-full md:w-3/4 mx-auto">{children}</main>
            {showSidebar && (
                <div className="md:w-1/4 md:block hidden">
                    <Sidebar />
                </div>
            )}
        </div>

        <PopupNewsletter />
    </div>
);

export default Layout;
