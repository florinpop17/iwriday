import { Layout } from "../components/";

const HowPage = () => {
    return (
        <Layout showSidebar={false}>
            <div className="relative" style={{ paddingTop: "56.25%" }}>
                <iframe
                    className="absolute inset-0 w-full h-full"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/mn6OgF70lNY"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </Layout>
    );
};

export default HowPage;
