import { Link } from 'react-router';
import FavoriteButton from './Favoritebutton';

const ProductListCard = ({ id, img, title, price, oldPrice, rating, reviews, shipping, description }) => {
  return (
    <div className="product-list-card d-flex gap-3 py-3 border-bottom">
      <Link to={`/products/${id}`}>{img}</Link>

      <div className="product-list-body flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <h6 className="product-list-title mb-1">
            <Link to={`/products/${id}`} className="title-link">{title}</Link>
          </h6>
          <FavoriteButton productId={id} />
        </div>

        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="price">${price}</span>
          {oldPrice && <span className="old-price">${oldPrice}</span>}
        </div>

        <div className="d-flex align-items-center gap-2 mb-2 product-meta">
          {rating && <span className="rating">⭐ {rating}</span>}
          {reviews && <span className="reviews">{reviews} orders</span>}
          {shipping && <span className="shipping">{shipping}</span>}
        </div>

        <p className="product-description mb-1">{description}</p>
        <Link to={`/products/${id}`} className="view-details">View details</Link>
      </div>
    </div>
  );
};

export default ProductListCard;