import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FiCheck, FiMessageSquare } from "react-icons/fi";
import { FaStar, FaRegStar, FaShoppingCart } from "react-icons/fa";
import { PiBasket } from "react-icons/pi";

import { useCart } from "../Context/CartContext";
import FavoriteButton from "./Favoritebutton";

import { Carousel } from "@fancyapps/ui/dist/carousel/";
import "@fancyapps/ui/dist/carousel/carousel.css";
import { Lazyload } from "@fancyapps/ui/dist/carousel/carousel.lazyload.js";
import { Thumbs } from "@fancyapps/ui/dist/carousel/carousel.thumbs.js";
import "@fancyapps/ui/dist/carousel/carousel.thumbs.css";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const ProductInfo = ({
  id,
  name,
  in_stock,
  rating,
  reviews_count,
  sold_count,
  images,
  price_tiers,
  spec_groups,
}) => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    const container = carouselRef.current;

    const carousel = Carousel(
      container,
      { Thumbs: { type: "classic" } },
      { Lazyload, Thumbs }
    ).init();

    Fancybox.bind(container, "[data-fancybox]", { theme: "light" });

    return () => {
      Fancybox.unbind(container);
      Fancybox.close();
      carousel.destroy();
    };
  }, []);

  const handleAddToCart = () => {

    if (!localStorage.getItem("auth_token")) {
      navigate("/login");
      return;
    }

    if (id === undefined) {
      setCartError("Missing product id: add id={product.id} to <ProductInfo> in ProductDetails.jsx");
      return;
    }

    setCartError("");

    addToCart(id, quantity)
      .then(() => {
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      })
      .catch((err) => setCartError(err.message));
  };

  return (
    <Row className="my-4 g-4" style={{ background: "var(--surface)" }}>

      <Col lg={5}>
        <div className="product-gallery">
          <div className="f-carousel" ref={carouselRef}>
            {images.map((src) => (
              <div
                key={src}
                className="f-carousel__slide"
                data-fancybox="gallery"
                data-src={src}
                data-thumb-src={src}
              >
                <img data-lazy-src={src} alt={name} />
              </div>
            ))}
          </div>
        </div>
      </Col>

      <Col lg={7}>
        {in_stock ? (
          <p className="product-stock">
            <FiCheck /> In stock
          </p>
        ) : (
          <p className="product-stock product-out">Out of stock</p>
        )}

                <div className="d-flex justify-content-between align-items-start gap-2">
          <h1 className="product-name">{name}</h1>
          <FavoriteButton productId={id} />
        </div>

        <div className="product-meta">
          <span className="product-stars">
            {[1, 2, 3, 4, 5].map((star) =>
              star <= rating / 2 ? <FaStar key={star} /> : <FaRegStar key={star} />
            )}
          </span>
          <span className="product-rating">{rating}</span>
          <span className="product-dot">•</span>
          <span className="product-meta-item">
            <FiMessageSquare /> {reviews_count} reviews
          </span>
          <span className="product-dot">•</span>
          <span className="product-meta-item">
            <PiBasket /> {sold_count} sold
          </span>
        </div>

        <div className="product-prices">
          {price_tiers.map((tier) => (
            <div key={tier.id} className="product-price">

              <span className="product-price-value">${tier.price.toFixed(2)}</span>

              <span className="product-price-range">
                {tier.max_qty
                  ? `${tier.min_qty}-${tier.max_qty} pcs`
                  : `${tier.min_qty}+ pcs`}
              </span>
            </div>
          ))}
        </div>

        {spec_groups.map((group) => (
          <div key={group.id} className="product-group">
            {group.specs.map((spec) => (
              <div key={spec.id} className="product-spec">
                <span className="product-spec-label">{spec.label}:</span>
                <span className="product-spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="d-flex align-items-center gap-3 mt-4">
          <select
            className="form-select"
            style={{ width: 110 }}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            aria-label="Quantity"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((q) => (
              <option key={q} value={q}>
                Qty: {q}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn text-white d-flex align-items-center justify-content-center gap-2 flex-grow-1 py-2 fw-semibold"
            style={{ backgroundColor: "#f0345d" }}
            onClick={handleAddToCart}
            disabled={!in_stock}
          >
            <FaShoppingCart /> {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>

        {cartError && <div className="text-danger small mt-2">{cartError}</div>}
      </Col>
    </Row>
  );
};

export default ProductInfo;