import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice";
import { Link } from "react-router-dom";

function CamperCard({ camper }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);
  const isFavorite = favorites.includes(camper.id);
  const image = camper.gallery?.[0]?.thumb || camper.gallery?.[0]?.original;

  return (
    <article className="camper-card">
      <img className="camper-card__image" src={image} alt={camper.name} loading="lazy" />
      <div className="camper-card__content">
        <div className="camper-card__header">
          <h2>{camper.name}</h2>
          <div className="camper-card__price">
            <span>€{Number(camper.price).toLocaleString("en-US")}</span>
            <button type="button" className={`favorite-button${isFavorite ? " is-favorite" : ""}`} onClick={() => dispatch(toggleFavorite(camper.id))} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={isFavorite}>
              {isFavorite ? "♥" : "♡"}
            </button>
          </div>
        </div>
        <div className="camper-card__meta">
          <span className="rating"><b aria-hidden="true">★</b> {camper.rating} ({camper.reviews?.length || 0} Reviews)</span>
          <span className="location-meta"><b aria-hidden="true">⌖</b> {camper.location}</span>
        </div>
        <p className="camper-card__description">{camper.description}</p>
        <div className="camper-card__tags" aria-label="Camper features">
          {camper.transmission && <span>♧ {camper.transmission}</span>}
          {camper.engine && <span>⚙ {camper.engine}</span>}
          {camper.form && <span>▣ {camper.form === "panelTruck" ? "Panel van" : camper.form}</span>}
        </div>
        <Link className="show-more-button" to={`/catalog/${camper.id}`}>Show more</Link>
      </div>
    </article>
  );
}

export default CamperCard;
