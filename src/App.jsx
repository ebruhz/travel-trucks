import { BrowserRouter, Routes, Route, NavLink, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CamperDetailsPage from "./pages/CamperDetailsPage";

function SiteLayout() {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink className="brand" to="/" aria-label="TravelTrucks home">
            Travel<span>Trucks</span>
          </NavLink>
          <nav className="site-nav" aria-label="Main navigation">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/catalog">Catalog</NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:id" element={<CamperDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
