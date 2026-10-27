
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCamperById } from "../services/campersApi";

function CamperDetailsPage() {
  const { id } = useParams();

  const [camper, setCamper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    let isActive = true;

    const fetchCamper = async () => {
      try {
        setIsLoading(true);
        setError("");
        setCamper(null);

        const data = await getCamperById(id);

        if (isActive) {
          setCamper(data);
          setSelectedPhotoIndex(0);
        }
      } catch {
        if (isActive) {
          setError("Unable to load camper details.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchCamper();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <p className="details-message" role="status">
        Loading camper details...
      </p>
    );
  }

  if (error) {
    return (
      <p className="details-message" role="alert">
        {error}
      </p>
    );
  }

  if (!camper) {
    return (
      <p className="details-message" role="status">
        Camper not found.
      </p>
    );
  }

  const gallery = Array.isArray(camper.gallery) ? camper.gallery : [];

  const features = [
    [camper.transmission, camper.transmission],
    [camper.AC, "AC"],
    [camper.engine, camper.engine],
    [camper.kitchen, "Kitchen"],
    [camper.bathroom, "Bathroom"],
    [camper.TV, "TV"],
    [camper.radio, "Radio"],
    [camper.refrigerator, "Refrigerator"],
    [camper.microwave, "Microwave"],
    [camper.gas, "Gas"],
    [camper.water, "Water"],
    [
      camper.form,
      camper.form === "panelTruck" ? "Panel van" : camper.form,
    ],
  ].filter(([enabled, label]) => {
    return (
      enabled !== undefined &&
      enabled !== null &&
      enabled !== false &&
      enabled !== "" &&
      label
    );
  });


  const attributes = [
    [
      "Form",
      camper.form === "panelTruck"
        ? "Panel truck"
        : camper.form,
    ],
    ["Length", camper.length],
    ["Width", camper.width],
    ["Height", camper.height],
    ["Tank", camper.tank],
    ["Consumption", camper.consumption],
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");

  const price = Number(camper.price);

  return (
    <main className="camper-details">
      <div className="details-overview">
        <div className="details-gallery">
          {gallery.length > 0 && (
            <>
              <div className="details-gallery__main">
                <img
                  src={
                    gallery[selectedPhotoIndex]?.original ||
                    gallery[selectedPhotoIndex]?.thumb
                  }
                  alt={`${camper.name} — photo ${selectedPhotoIndex + 1} `}
                />
              </div>

              <div
                className="details-gallery__thumbs"
                aria-label="Camper photos"
              >
                {gallery.slice(0, 4).map((photo, index) => (
                  <button
                    className={`details - gallery__thumb${index === selectedPhotoIndex ? " is-selected" : ""
                      } `}
                    type="button"
                    key={photo.original || photo.thumb || index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    aria-label={`Show photo ${index + 1} `}
                    aria-pressed={index === selectedPhotoIndex}
                  >
                    <img
                      src={photo.thumb || photo.original}
                      alt=""
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {gallery.length === 0 && (
            <p className="details-message">
              No photos available.
            </p>
          )}
        </div>

        <div className="details-overview__side">
          <section className="details-panel details-description">
            <h1>{camper.name}</h1>

            <div className="details-rating">
              <span className="rating">
                <b aria-hidden="true">★</b> {camper.rating} (
                {camper.reviews?.length || 0} Reviews)
              </span>

              <span className="location-meta">
                <b aria-hidden="true">⌖</b> {camper.location}
              </span>
            </div>

            <p className="details-price">
              €
              {Number.isFinite(price)
                ? price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: false,
                })
                : "Price unavailable"}
            </p>

            <p>{camper.description}</p>
          </section>

          <section className="details-panel vehicle-details">
            <h2>Vehicle details</h2>

            <div className="details-features">
              {features.map(([, label], index) => (
                <span key={`${label}-${index}`}>
                  {label === "AC"
                    ? "❄️ AC"
                    : label === "TV"
                      ? "📺 TV"
                      : label === "Radio"
                        ? "📻 Radio"
                        : label === "Kitchen"
                          ? "🍳 Kitchen"
                          : label === "Bathroom"
                            ? "🚿 Bathroom"
                            : label === "Refrigerator"
                              ? "🧊 Refrigerator"
                              : label === "Microwave"
                                ? "♨️ Microwave"
                                : label === "Gas"
                                  ? "🔥 Gas"
                                  : label === "Water"
                                    ? "💧 Water"
                                    : label}
                </span>
              ))}
            </div>



            <dl>
              {attributes.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <div className="details-lower">
        <section className="reviews-section">
          <h2>Reviews</h2>

          {camper.reviews?.length ? (
            camper.reviews.map((review, index) => {
              const rating = Math.min(
                5,
                Math.max(0, Number(review.reviewer_rating) || 0)
              );

              return (
                <article
                  className="review-card"
                  key={`${review.reviewer_name || "review"} -${index} `}
                >
                  <div className="review-card__heading">
                    <span className="review-avatar" aria-hidden="true">
                      {review.reviewer_name?.[0] || "A"}
                    </span>

                    <div>
                      <h3>{review.reviewer_name || "Anonymous"}</h3>

                      <p
                        className="review-stars"
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {"★".repeat(rating)}
                        <span>{"☆".repeat(5 - rating)}</span>
                      </p>
                    </div>
                  </div>

                  <p>{review.comment}</p>
                </article>
              );
            })
          ) : (
            <p>No reviews yet.</p>
          )}
        </section>

        <section className="booking-section">
          <h2>Book your camper now</h2>
          <p>Stay connected! We are always ready to help you.</p>
          <BookingForm />
        </section>
      </div>
    </main>
  );
}

function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [message, setMessage] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    formData.email.trim()
  );

  const nameError = showErrors && !formData.name.trim();
  const emailError = showErrors && !isEmailValid;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowErrors(true);

    if (!formData.name.trim() || !isEmailValid) {
      setMessage("");
      return;
    }

    setMessage("Your booking request has been submitted successfully!");

    setFormData({
      name: "",
      email: "",
    });

    setShowErrors(false);
  };

  return (
    <form
      className="booking-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <label
        className={`booking - field${nameError ? " has-error" : ""} `}
      >
        <span className="booking-field__label">Name*</span>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name*"
          required
          aria-invalid={nameError}
          aria-describedby={nameError ? "name-error" : undefined}
        />

        {nameError && (
          <>
            <span className="field-error-icon" aria-hidden="true">
              !
            </span>
            <span className="field-error" id="name-error">
              Please enter your name.
            </span>
          </>
        )}
      </label>

      <label
        className={`booking - field${emailError ? " has-error" : ""} `}
      >
        <span className="booking-field__label">Email*</span>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email*"
          required
          aria-invalid={emailError}
          aria-describedby={emailError ? "email-error" : undefined}
        />

        {emailError && (
          <>
            <span className="field-error-icon" aria-hidden="true">
              !
            </span>
            <span className="field-error" id="email-error">
              Please enter a valid email address.
            </span>
          </>
        )}
      </label>

      <button type="submit">Send</button>

      {message && (
        <p role="status">
          {message}
        </p>
      )}
    </form>
  );
}

export default CamperDetailsPage;

