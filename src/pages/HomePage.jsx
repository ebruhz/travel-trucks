import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="home-page">
      <div className="home-page__content">
        <h1>Campers of your dreams</h1>
        <p>You can find everything you want in our catalog</p>
        <Link to="/catalog">View Now</Link>
      </div>
    </main>
  );
}

export default HomePage;
