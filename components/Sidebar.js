import Leaderboard from "./Leaderboard";

const Sidebar = () => {
    return (
        <div className="my-4 p-3 text-purple-100">
            <Leaderboard />
            <div className="text-purple-200 mt-10 text-center">
                <p>
                    Project built by{" "}
                    <a
                        className="font-bold text-purple-400"
                        href="https://twitter.com/florinpop1705"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Florin Pop
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
