import NotFound from "~/components/NotFound";

const Home = () => {
  return <NotFound />;
};

export function meta() {
  return [
    { title: "Home - Spread" },
    { name: "description", content: "Welcome to Spread - Your social media management platform" },
  ];
}

export default Home;    