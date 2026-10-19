import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiCheck } from "react-icons/fi";
import { Link, useParams } from "react-router";
import PageLayout from "../../layout/PageLayout";
import ProductInfo from "../../props/Productinfo";
import Maylike from "../../props/Maylike";
import { API_Config } from "../../Config/Api-config";
import Discount from "../../Components/Shared/Discount";

const otherTabs = [
  {
    id: 2,
    title: "Reviews",
    text: "No reviews yet. Be the first to review this product.",
    table: [],
    features: [],
  },
  {
    id: 3,
    title: "Shipping",
    text: "We ship worldwide. Orders are usually delivered within 5-10 business days.",
    table: [],
    features: [],
  },
  {
    id: 4,
    title: "About seller",
    text: "Borcelle is an online store that offers quality products at great prices.",
    table: [],
    features: [],
  },
];

const ProductDetails = () => {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError("");
    setActiveTab(1);
    window.scrollTo({ top: 0 });

    fetch(`${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCT_DETAILS(id)}?with_avatar=1`, {
      headers: { Accept: "application/json" },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status === 404 ? "This product doesn't exist." : "Something went wrong!");
        }
        return res.json();
      })
      .then(data => {
        setProduct(data.data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const productsUrl = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCTS}`;
    const categoryId = product.category?.id;
    const url = categoryId ? `${productsUrl}?category_id=${categoryId}` : productsUrl;

    fetch(url, {
      headers: { Accept: "application/json" },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Could not load related products");
        }
        return res.json();
      })
      .then(data => {

        const sameCategory = data.data.filter((pdct) => pdct.id !== product.id);

        if (sameCategory.length >= 6) {
          setRelatedProducts(sameCategory);
          return;
        }

        return fetch(productsUrl, {
          headers: { Accept: "application/json" },
        })
          .then(res => res.json())
          .then(allData => {
            const extra = allData.data.filter((pdct) =>
              pdct.id !== product.id &&
              !sameCategory.some((same) => same.id === pdct.id)
            );
            setRelatedProducts([...sameCategory, ...extra]);
          });
      })
      .catch(() => {
        setRelatedProducts([]);
      });
  }, [product]);

  if (loading) {
    return (
      <PageLayout>
        <Container className="py-5">
          <p className="text-center">Loading product...</p>
        </Container>
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout>
        <Container className="py-5 text-center">
          <p className="text-danger">{error || "Something went wrong!"}</p>
          <Link to="/products" className="discount-btn d-inline-block">Back to products</Link>
        </Container>
      </PageLayout>
    );
  }

  const images = [product.image, ...(product.images || [])].filter(Boolean);

  const colorNames = (product.colors || []).map((color) => color.name).join(", ");

  const priceTiers = [
    { id: 1, price: product.price, min_qty: 1, max_qty: null },
  ];

  const specGroups = [
    {
      id: 1,
      specs: [{ id: 1, label: "Price", value: `$${product.price}` }],
    },
    {
      id: 2,
      specs: [
        { id: 2, label: "Category", value: product.category?.name || "—" },
        { id: 3, label: "SKU", value: product.sku || "—" },
        { id: 4, label: "Colors", value: colorNames || "—" },
      ],
    },
  ];

  const tabsData = [
    {
      id: 1,
      title: "Description",
      text: product.description || "No description for this product yet.",
      table: [
        { id: 1, label: "Model", value: product.sku || "—" },
        { id: 2, label: "Category", value: product.category?.name || "—" },
        { id: 3, label: "Price", value: `$${product.price}` },
        { id: 4, label: "Colors", value: colorNames || "—" },
      ],
      features: (product.colors || []).map((color) => ({
        id: color.id,
        text: `Available in ${color.name}`,
      })),
    },
    ...otherTabs,
  ];

  const currentTab = tabsData.find((tab) => tab.id === activeTab);

  const suggestions = relatedProducts.slice(0, 5);
  const related = relatedProducts.slice(0, 6);

  return (
    <PageLayout>
      <Container className="py-4">

              <ProductInfo
                id={product.id}
                key={product.id}
                name={product.name}
                in_stock={true}
                images={images}
                price_tiers={priceTiers}
                spec_groups={specGroups}
        />
                <Row className="g-4 mt-2">

          <Col lg={suggestions.length > 0 ? 9 : 12}>
            <div className="details-box">
                            <div className="details-tabs">
                {tabsData.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`details-tab ${activeTab === tab.id ? "details-tab-active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

                            <div className="details-content">
                <p className="details-text">{currentTab.text}</p>

                {currentTab.table.length > 0 && (
                  <table className="details-table">
                    <tbody>
                      {currentTab.table.map((row) => (
                        <tr key={row.id}>
                          <th>{row.label}</th>
                          <td>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {currentTab.features.length > 0 && (
                  <ul className="details-features">
                    {currentTab.features.map((feature) => (
                      <li key={feature.id}>
                        <FiCheck /> {feature.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Col>

          {suggestions.length > 0 && (
            <Col lg={3}>
              <div className="details-box suggest-box">
                <h2 className="suggest-title">You may like</h2>
                {suggestions.map((item) => (
                  <Link key={item.id} to={`/products/${item.id}`} className="product-link">
                    <Maylike
                      image={item.image}
                      name={item.name}
                      price={`$${item.price}`}
                    />
                  </Link>
                ))}
              </div>
            </Col>
          )}
        </Row>

        {related.length > 0 && (
          <div className="details-box p-3 mt-4">
            <h2 className="suggest-title">Related products</h2>

            <Row xs={2} sm={3} lg={6} className="g-3">
              {related.map((item) => (
                <Col key={item.id}>
                  <Link to={`/products/${item.id}`} className="product-link related-card">
                    <div className="related-img-wrap">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <p className="related-name">{item.name}</p>
                    <p className="related-price">${item.price}</p>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <Discount />
      </Container>
    </PageLayout>
  );
};

export default ProductDetails;