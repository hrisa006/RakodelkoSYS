import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import type { Item, Media, Review } from "../../types/types";
import "./ItemDetailPage.css";
import { useShop } from "../../contexts/ShopContext";
import { useAuth } from "../../contexts/AuthContext";
import { fetchItem } from "../../api/items";
import { fetchMedia } from "../../api/media";
import { fetchReviews, addReview } from "../../api/reviews";

interface ReviewForm {
  rating: number;
  content: string;
}

const ItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addToCart } = useShop();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!item) return;
    if (!user) {
      alert("Моля, влезте в профила си, за да добавите в количката.");
      navigate("/login");
      return;
    }
    addToCart(item.id, 1);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [itm, media, rev] = await Promise.all([
          fetchItem(Number(id)),
          fetchMedia(Number(id)),
          fetchReviews(Number(id)),
        ]);
        setItem(itm);
        setMediaList(media);
        setReviews(rev);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (data: ReviewForm) => {
    if (!id) return;
    try {
      const newRev = await addReview(Number(id), data);
      setReviews((prev) => [newRev, ...prev]);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  const avgRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  if (loading) return <p>Зареждане...</p>;
  if (!item) return <p>Няма такова изделие</p>;

  return (
    <div className="item-detail-container">
      <Carousel showThumbs={false} dynamicHeight={false}>
        {mediaList.length > 0
          ? mediaList.map((m) => (
              <div key={m.id}>
                <img
                  src={`http://localhost:8080${m.url}`}
                  alt={m.altText || item.title}
                />
              </div>
            ))
          : [
              <div>
                <img
                  src={`http://localhost:8080${item.imageUrl}`}
                  alt={item.title}
                />
              </div>,
            ]}
      </Carousel>

      <div className="item-info">
        <h2 className="item-title">{item.title}</h2>
        <p className="item-price">{item.price} лв.</p>
        <p className="item-description">{item.description}</p>
        <p className="item-seller">
          Автор: {item.seller?.username || "неизвестен"}
        </p>

        <div className="item-actions">
          {item.quantity > 0 ? (
            <button onClick={handleAddToCart}>Добави в количката</button>
          ) : (
            <p>Изчерпано</p>
          )}
        </div>
      </div>

      <section className="reviews">
        <h3>
          Ревюта ({reviews.length}) – Среден рейтинг: {avgRating.toFixed(1)}★
        </h3>

        {reviews.length === 0 && <p>Няма ревюта.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="review">
            <strong>{r.user?.username || "Анонимен"}</strong>{" "}
            <span>★ {r.rating}</span>
            <p>{r.comment}</p>
          </div>
        ))}

        <form className="review-form" onSubmit={handleSubmit(onSubmit)}>
          <h4>Добави ревю</h4>
          <label>
            Рейтинг (1‒5):
            <input
              type="number"
              step="1"
              min="1"
              max="5"
              {...register("rating", { required: true, min: 1, max: 5 })}
            />
          </label>
          {errors.rating && <span className="err">*</span>}
          <label>
            Отзив:
            <textarea {...register("content", { required: true })} />
          </label>
          {errors.content && <span className="err">*</span>}
          <button type="submit">Изпрати</button>
        </form>
      </section>
    </div>
  );
};

export default ItemDetailsPage;
