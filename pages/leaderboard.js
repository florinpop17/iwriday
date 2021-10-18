import { Layout, Leaderboard } from "../components/";

const LeaderboardPage = () => {
    return (
        <Layout showSidebar={false}>
            <div className="mt-10">
                <Leaderboard />
            </div>
        </Layout>
    );
};

export default LeaderboardPage;
