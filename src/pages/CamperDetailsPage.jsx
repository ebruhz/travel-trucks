import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCamperById } from "../services/campersApi";
import "../index.css";

function CamperDetailsPage() {
    const { id } = useParams();

    const [camper, setCamper] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCamper = async () => {
            try {
                setIsLoading(true);
                setError("");

                const data = await getCamperById(id);
                setCamper(data);
            } catch {
                setError("Unable to load camper details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCamper();
    }, [id]);

    if (isLoading) {
        return (
            <p className="details-message">
                Loading camper details...
            </p>
        );
    }

    if (error) {
        return <p className="details-message">{error}</p>;
    }

    if (!camper) {
        return (
            <p className="details-message">
                Camper not found.
            </p>
        );
    }

    return (
        <main className="camper-details">
            <h1>{camper.name}</h1>

            <div className="details-rating">
                <span>★ {camper.rating}</span>
                <span>
                    {camper.reviews?.length || 0} reviews
                </span>
                <span>{camper.location}</span>
            </div>

            <p className="details-price">
                €{Number(camper.price).toFixed(2)}
            </p>

            <div className="details-gallery">
                {camper.gallery?.map((photo, index) => (
                    <img
                        key={photo.original || photo.thumb || index}
                        src={photo.original || photo.thumb}
                        alt={`${camper.name} - photo ${index + 1}`}
                    />
                ))}
            </div>

            <section className="details-section">
                <h2>Description</h2>
                <p>{camper.description}</p>
            </section>

            <section className="details-section">
                <h2>Features</h2>

                <ul className="details-features">
                    <li>🚐 Vehicle type: {camper.form}</li>
                    <li>⚙️ Transmission: {camper.transmission}</li>
                    <li>⛽ Engine: {camper.engine}</li>
                    {camper.AC && <li>❄️ Air conditioning</li>}
                    {camper.bathroom && <li>🚿 Bathroom</li>}
                    {camper.kitchen && <li>🍳 Kitchen</li>}
                    {camper.TV && <li>📺 TV</li>}
                    {camper.refrigerator && <li>🧊 Refrigerator</li>}
                </ul>
            </section>

            <section className="details-section">
                <h2>Reviews</h2>

                {camper.reviews?.length ? (
                    camper.reviews.map((review, index) => (
                        <article
                            className="review-card"
                            key={`${review.reviewer_name}-${index}`}
                        >
                            <h3>{review.reviewer_name}</h3>

                            <p>
                                {"★".repeat(review.reviewer_rating)}
                                {"☆".repeat(5 - review.reviewer_rating)}
                            </p>

                            <p>{review.comment}</p>
                        </article>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </section>

            <section className="booking-section">
                <h2>Book your camper</h2>
                <p>Start planning your next adventure!</p>

                <BookingForm />
            </section>
        </main>
    );
}

function BookingForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bookingDate: "",
        comment: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setMessage(
            "Your booking request has been submitted successfully!"
        );

        setFormData({
            name: "",
            email: "",
            bookingDate: "",
            comment: "",
        });
    };

    return (
        <form className="booking-form" onSubmit={handleSubmit}>
            <label>
                Full name
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                />
            </label>

            <label>
                Email
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                />
            </label>

            <label>
                Booking date
                <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Comment
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Enter your comment"
                />
            </label>

            <button type="submit">Send booking request</button>

            {message && <p role="status">{message}</p>}
        </form>
    );
}

export default CamperDetailsPage;