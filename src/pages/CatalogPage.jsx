import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampers, clearCampers } from "../redux/campersSlice";
import CamperCard from "../components/CamperCard";

const vehicleForms = [
  { label: "Alcove", value: "alcove" },
  { label: "Panel Van", value: "panelTruck" },
  { label: "Integrated", value: "fullyIntegrated" },
  { label: "Semi Integrated", value: "semiIntegrated" },
];
const engines = ["Diesel", "Petrol", "Hybrid", "Electric"];
const transmissions = ["Automatic", "Manual"];

function ChoiceGroup({ title, name, options, value, onChange }) {
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {options.map((option) => {
        const item = typeof option === "string" ? { label: option, value: option.toLowerCase() } : option;
        return (
          <label className="filter-choice" key={`${name}-${item.label}`}>
            <input
              type="radio"
              name={name}
              value={item.value}
              checked={value === item.value}
              onChange={(event) => onChange(event.target.value)}
            />
            <span>{item.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function EmptyStateIllustration() {
  return <img className="empty-illustration" src="/empty-campers.png" alt="Camper parked beneath mountains" />;
}
function CatalogPage() {
  const dispatch = useDispatch();
  const { items, total, page, isLoading, isLoadingMore, error } = useSelector((state) => state.campers);
  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [engine, setEngine] = useState("");
  const [transmission, setTransmission] = useState("");
  const limit = 4;

  const getFilterParams = (pageNumber = 1) => {
    const params = { page: pageNumber, limit };
    if (location.trim()) params.location = location.trim();
    if (vehicleType) params.form = vehicleType;
    if (engine) params.engine = engine;
    if (transmission) params.transmission = transmission;
    return params;
  };

  useEffect(() => {
    dispatch(fetchCampers({ page: 1, limit }));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(clearCampers());
    dispatch(fetchCampers(getFilterParams(1)));
  };

  const handleReset = () => {
    setLocation("");
    setVehicleType("");
    setEngine("");
    setTransmission("");
    dispatch(clearCampers());
    dispatch(fetchCampers({ page: 1, limit }));
  };

  const hasMore = items.length < total;

  return (
    <main className="catalog-page">
      <aside className="filters" aria-label="Camper filters">
        <label className="location-label" htmlFor="location">Location</label>
        <div className="location-field">
          <span aria-hidden="true">⌖</span>
          <input
            id="location"
            type="text"
            placeholder="City, Ukraine"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>
        <h2 className="filters-title">Filters</h2>
        <ChoiceGroup title="Vehicle form" name="vehicleType" options={vehicleForms} value={vehicleType} onChange={setVehicleType} />
        <ChoiceGroup title="Engine" name="engine" options={engines} value={engine} onChange={setEngine} />
        <ChoiceGroup title="Transmission" name="transmission" options={transmissions} value={transmission} onChange={setTransmission} />
        <button className="filter-search" type="button" onClick={handleSearch}>Search</button>
        <button className="filter-reset" type="button" onClick={handleReset}><span aria-hidden="true">×</span> Clear filters</button>
      </aside>

      <section className="catalog-results" aria-label="Available campers">
        {isLoading && items.length === 0 ? (
          <div className="catalog-state" role="status"><span className="loading-spinner" />Loading campers...</div>
        ) : error && items.length === 0 ? (
          <p className="catalog-state" role="alert">{error}</p>
        ) : items.length === 0 ? (
          <div className="catalog-empty">
            <EmptyStateIllustration />
            <h1>No campers found</h1>
            <p>We couldn’t find any campers that match your filters.<br />Try adjusting your search or clearing some filters.</p>
            <div className="catalog-empty__actions">
              <button type="button" className="filter-reset" onClick={handleReset}><span aria-hidden="true">×</span> Clear filters</button>
              <button type="button" className="view-all-button" onClick={handleReset}>View all campers</button>
            </div>
          </div>
        ) : (
          <>
            <div className="camper-list">
              {items.map((camper) => <CamperCard key={camper.id} camper={camper} />)}
            </div>
            {error && <p role="alert">{error}</p>}
            {hasMore && (
              <button className="load-more-button" type="button" onClick={() => dispatch(fetchCampers(getFilterParams(page + 1)))} disabled={isLoadingMore}>
                {isLoadingMore ? "Loading..." : "Load more"}
              </button>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default CatalogPage;



