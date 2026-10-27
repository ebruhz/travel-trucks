import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampers, clearCampers } from "../redux/campersSlice";
import CamperCard from "../components/CamperCard";

function CatalogPage() {
    const dispatch = useDispatch();

    const {
        items,
        total,
        page,
        isLoading,
        isLoadingMore,
        error,
    } = useSelector((state) => state.campers);

    const [location, setLocation] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [equipment, setEquipment] = useState([]);

    const limit = 4;
    const getFilterParams = (pageNumber = 1) => {
        const params = {
            page: pageNumber,
            limit,
        };

        if (location.trim()) {
            params.location = location.trim();
        }

        if (vehicleType) {
            params.form = vehicleType;
        }

        equipment.forEach((item) => {
            params[item] = "true";
        });

        return params;
    };

    useEffect(() => {
        dispatch(
            fetchCampers({
                page: 1,
                limit,
            })
        );
    }, [dispatch]);

    const handleEquipmentChange = (event) => {
        const { value, checked } = event.target;

        setEquipment((previousEquipment) =>
            checked
                ? [...previousEquipment, value]
                : previousEquipment.filter((item) => item !== value)
        );
    };

    const handleSearch = () => {
        dispatch(clearCampers());
        dispatch(fetchCampers(getFilterParams(1)));
    };

    const handleLoadMore = () => {
        dispatch(fetchCampers(getFilterParams(page + 1)));
    };
    const hasMore = items.length < total;

    if (isLoading && items.length === 0) {
        return <p>Loading campers...</p>;
    }

    if (error && items.length === 0) {
        return <p>{error}</p>;
    }

    return (
        <main className="catalog-page">
            <aside className="filters">
                <label htmlFor="location">Location</label>

                <input
                    id="location"
                    type="text"
                    placeholder="City"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                />

                <h3>Vehicle type</h3>

                <label>
                    <input
                        type="radio"
                        name="vehicleType"
                        value="panelTruck"
                        checked={vehicleType === "panelTruck"}
                        onChange={(event) => setVehicleType(event.target.value)}
                    />
                    Van
                </label>

                <label>
                    <input
                        type="radio"
                        name="vehicleType"
                        value="fullyIntegrated"
                        checked={vehicleType === "fullyIntegrated"}
                        onChange={(event) => setVehicleType(event.target.value)}
                    />
                    Fully Integrated
                </label>

                <label>
                    <input
                        type="radio"
                        name="vehicleType"
                        value="alcove"
                        checked={vehicleType === "alcove"}
                        onChange={(event) => setVehicleType(event.target.value)}
                    />
                    Alcove
                </label>

                <h3>Vehicle equipment</h3>

                {[
                    { label: "AC", value: "AC" },
                    { label: "Bathroom", value: "bathroom" },
                    { label: "Kitchen", value: "kitchen" },
                    { label: "TV", value: "TV" },
                    { label: "Refrigerator", value: "refrigerator" },
                ].map((item) => (
                    <label key={item.value}>
                        <input
                            type="checkbox"
                            value={item.value}
                            checked={equipment.includes(item.value)}
                            onChange={handleEquipmentChange}
                        />
                        {item.label}
                    </label>
                ))}

                <button type="button" onClick={handleSearch}>
                    Search
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setLocation("");
                        setVehicleType("");
                        setEquipment([]);
                        dispatch(clearCampers());
                        dispatch(fetchCampers({ page: 1, limit }));
                    }}
                >
                    Reset filters
                </button>
            </aside>

            <section className="catalog-results">
                <h1>Campers</h1>

                {items.length === 0 && !isLoading ? (
                    <p>No campers found. Try changing your filters.</p>
                ) : (
                    <div className="camper-list">
                        {items.map((camper) => (
                            <CamperCard key={camper.id} camper={camper} />
                        ))}
                    </div>
                )}

                {error && <p role="alert">{error}</p>}

                {hasMore && items.length > 0 && (
                    <button
                        className="load-more-button"
                        type="button"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? "Loading..." : "Load More"}
                    </button>
                )}
            </section>
        </main>
    );
}

export default CatalogPage;