import { useRouter } from "next/router";
import { Layout, UserTimeline } from "../components/";

const UserPage = () => {
    const router = useRouter();
    const { user } = router.query;

    return (
        <Layout>
            <UserTimeline username={user} />
        </Layout>
    );
};

export default UserPage;
