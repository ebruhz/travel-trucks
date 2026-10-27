import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice";
import { Link } from "react-router-dom";

function CamperCard({ camper }) {
    const dispatch = useDispatch();

    const favorites = useSelector((state) => state.favorites.items);
    const isFavorite = favorites.includes(camper.id);

    const image = camper.gallery?.[0]?.thumb;

    return (
        <article className="camper-card">
            <img
                className="camper-card__image"
                src={image}
                alt={camper.name}
            />

            <div className="camper-card__content">
                <div className="camper-card__header">
                    <h2>{camper.name}</h2>

                    <div className="camper-card__price">
                        <span>€{Number(camper.price).toFixed(2)}</span>

                        <button
                            type="button"
                            className="favorite-button"
                            onClick={() => dispatch(toggleFavorite(camper.id))}
                            aria-label={
                                isFavorite ? "Remove from favorites" : "Add to favorites"
                            }
                        >
                            {isFavorite ? "♥" : "♡"}
                        </button>
                    </div>
                </div>

                <p>
                    ★ {camper.rating} ({camper.reviews?.length || 0} reviews)
                </p>

                <p>{camper.location}</p>

                <p className="camper-card__description">
                    {camper.description}
                </p>

                <Link
                    className="show-more-button"
                    to={`/catalog/${camper.id}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Show more
                </Link>
            </div>
        </article>
    );
}

export default CamperCard;