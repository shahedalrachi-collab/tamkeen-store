import { useState, useEffect } from "react";
import { Link } from "react-router";
import Accordion from "react-bootstrap/Accordion";
import { Container, Breadcrumb, Form, Pagination } from "react-bootstrap";
import { BsGrid3X3GapFill, BsListUl } from "react-icons/bs";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import PageLayout from "../../layout/PageLayout";
import ProductListCard from "../../props/ProductListCard";
import RecomendedCards from "../../props/RecomendedCards";
import { ProductService } from "../../Services/ProductService";
import Newsletter from "../../Components/Shared/Newsletter";
import {  useSearchParams } from "react-router";

const sortOptions = {
  featured: null,
  "price-asc": { order_by: "price", order: "asc" },
  "price-desc": { order_by: "price", order: "desc" },
  name: { order_by: "name", order: "asc" },
  newest: { order_by: "created_at", order: "desc" },
};

const brands = [
  { id: "samsung", label: "Samsung" },
  { id: "apple", label: "Apple" },
  { id: "huawei", label: "Huawei" },
  { id: "pocco", label: "Pocco" },
  { id: "lenovo", label: "Lenovo" },
];

const features = [
  { id: "metallic", label: "Metallic" },
  { id: "plastic-cover", label: "Plastic cover" },
  { id: "8gb-ram", label: "8GB Ram" },
  { id: "super-power", label: "Super power" },
  { id: "large-memory", label: "Large Memory" },
];

const conditions = [
  { id: "any", label: "Any" },
  { id: "refurbished", label: "Refurbished" },
  { id: "brand-new", label: "Brand new" },
  { id: "old-items", label: "Old items" },
];

const ratingsOptions = [5, 4, 3, 2];

const FilterCheckbox = ({ label, checked, onChange }) => (
  <label className="filter-checkbox d-flex align-items-center gap-2 mb-2">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
);

const FilterRadio = ({ label, name, checked, onChange }) => (
  <label className="filter-radio d-flex align-items-center gap-2 mb-2">
    <input type="radio" name={name} checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
);

const Products = () => {

const [searchParams, setSearchParams] = useSearchParams();
const selectedCategory = searchParams.get("category") ? Number(searchParams.get("category")) : null;
  const [checkedBrands, setCheckedBrands] = useState([]);
  const [checkedFeatures, setCheckedFeatures] = useState([]);
  const [checkedRatings, setCheckedRatings] = useState([]);
  const [condition, setCondition] = useState("any");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [appliedMin, setAppliedMin] = useState("");
  const [appliedMax, setAppliedMax] = useState("");

  const [viewMode, setViewMode] = useState("list");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    ProductService.GetAllCategories()
      .then((allCategories) => {
        setCategories(allCategories);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    ProductService.GetFilteredProducts({
      page: currentPage,
      categoryId: selectedCategory,
      priceFrom: appliedMin,
      priceTo: appliedMax,
      sort: sortOptions[sortBy],
    })
      .then((data) => {
        setProducts(data.data);
        setTotalPages(data.meta.last_page);
        setTotalProducts(data.meta.total);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, selectedCategory, appliedMin, appliedMax, sortBy]);

  const halfCount = Math.ceil(categories.length / 2);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, halfCount);

  const selectedCategoryLabel = categories.find((c) => c.id === selectedCategory)?.name;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const toggleItem = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };
const changeCategory = (id) => {
  setSearchParams(id ? { category: id } : {});
  setCurrentPage(1);
};

  const changeSort = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleApplyPrice = () => {
    setAppliedMin(minPrice);
    setAppliedMax(maxPrice);
    setCurrentPage(1);
  };

  const clearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    setAppliedMin("");
    setAppliedMax("");
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilters = [];

  if (selectedCategory) {
    activeFilters.push({ id: selectedCategory, label: selectedCategoryLabel, group: "category" });
  }

  if (appliedMin || appliedMax) {
    activeFilters.push({
      id: "price",
      label: `Price: ${appliedMin || 0} - ${appliedMax || "any"}`,
      group: "price",
    });
  }

  checkedBrands.forEach((id) => {
    const brand = brands.find((b) => b.id === id);
    activeFilters.push({ id: id, label: brand.label, group: "brand" });
  });

  checkedFeatures.forEach((id) => {
    const feature = features.find((f) => f.id === id);
    activeFilters.push({ id: id, label: feature.label, group: "feature" });
  });

  checkedRatings.forEach((stars) => {
    activeFilters.push({ id: stars, label: `${stars} star`, group: "rating" });
  });

  const removeFilter = (filter) => {
    if (filter.group === "category") changeCategory(null);
    if (filter.group === "price") clearPrice();
    if (filter.group === "brand") toggleItem(filter.id, checkedBrands, setCheckedBrands);
    if (filter.group === "feature") toggleItem(filter.id, checkedFeatures, setCheckedFeatures);
    if (filter.group === "rating") toggleItem(filter.id, checkedRatings, setCheckedRatings);
  };

  const clearAllFilters = () => {
    changeCategory(null);
    clearPrice();
    setCheckedBrands([]);
    setCheckedFeatures([]);
    setCheckedRatings([]);
  };

  return (
    <PageLayout>
      <Container>

                <Breadcrumb className="products-breadcrumb pt-3 px-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>

          {selectedCategory ? (
            <>
              <Breadcrumb.Item as="li" onClick={() => changeCategory(null)} className="breadcrumb-clickable">
                Products
              </Breadcrumb.Item>
              <Breadcrumb.Item active>{selectedCategoryLabel}</Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item active>Products</Breadcrumb.Item>
          )}
        </Breadcrumb>

        <div className="product-page d-flex gap-4">

          <Accordion defaultActiveKey={["0"]} alwaysOpen className="filter-sidebar">

                        <Accordion.Item eventKey="0" className="mb-3">
              <Accordion.Header><h6>Category</h6></Accordion.Header>
              <Accordion.Body>
                <div className="filter-group mb-4 d-flex flex-column">

                  <button
                    className={`category-link ${selectedCategory === null ? "active" : ""}`}
                    onClick={() => changeCategory(null)}
                  >
                    All categories
                  </button>

                  {visibleCategories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`category-link ${selectedCategory === cat.id ? "active" : ""}`}
                      onClick={() => changeCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}

                  {categories.length > halfCount && (
                    <button
                      className="show-more-btn"
                      onClick={() => setShowAllCategories(!showAllCategories)}
                    >
                      {showAllCategories ? "Show less" : "Show more"}
                    </button>
                  )}

                </div>
              </Accordion.Body>
            </Accordion.Item>

                        <Accordion.Item eventKey="1" className="mb-3">
              <Accordion.Header><h6>Brands</h6></Accordion.Header>
              <Accordion.Body>
                <div className="filter-group mb-4">
                  {brands.map((brand) => (
                    <FilterCheckbox
                      key={brand.id}
                      label={brand.label}
                      checked={checkedBrands.includes(brand.id)}
                      onChange={() => toggleItem(brand.id, checkedBrands, setCheckedBrands)}
                    />
                  ))}
                  <a href="#" className="see-all-link">See all</a>
                </div>
              </Accordion.Body>
            </Accordion.Item>

                        <Accordion.Item eventKey="2" className="mb-3">
              <Accordion.Header><h6>Features</h6></Accordion.Header>
              <Accordion.Body>
                <div className="filter-group mb-4">
                  {features.map((feature) => (
                    <FilterCheckbox
                      key={feature.id}
                      label={feature.label}
                      checked={checkedFeatures.includes(feature.id)}
                      onChange={() => toggleItem(feature.id, checkedFeatures, setCheckedFeatures)}
                    />
                  ))}
                  <a href="#" className="see-all-link">See all</a>
                </div>
              </Accordion.Body>
            </Accordion.Item>

                        <Accordion.Item eventKey="3" className="mb-3">
              <Accordion.Header><h6>Price range</h6></Accordion.Header>
              <Accordion.Body>
                <div className="filter-group mb-4">
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="price-input"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="price-input"
                    />
                  </div>
                  <button className="apply-btn" onClick={handleApplyPrice}>
                    Apply
                  </button>
                </div>
              </Accordion.Body>
            </Accordion.Item>

                        <Accordion.Item eventKey="4" className="mb-3">
              <Accordion.Header><h6>Condition</h6></Accordion.Header>
              <Accordion.Body>
                <div className="filter-group mb-4">
                  {conditions.map((cond) => (
                    <FilterRadio
                      key={cond.id}
                      name="condition"
                      label={cond.label}
                      checked={condition === cond.id}
                      onChange={() => setCondition(cond.id)}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

                        <Accordion.Item eventKey="5" className="mb-3">
              <Accordion.Header><h6>Ratings</h6></Accordion.Header>
              <Accordion.Body>
                <div className="filter-group mb-4">
                  {ratingsOptions.map((stars) => (
                    <FilterCheckbox
                      key={stars}
                      label={"⭐".repeat(stars) + "☆".repeat(5 - stars)}
                      checked={checkedRatings.includes(stars)}
                      onChange={() => toggleItem(stars, checkedRatings, setCheckedRatings)}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>

          <div className="d-flex flex-column flex-grow-1">

                        <div className="products-toolbar d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 mb-3 border rounded bg-body">

              <p className="mb-0">
                {totalProducts} items in <strong>{selectedCategoryLabel || "All categories"}</strong>
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">

                <Form.Check
                  type="checkbox"
                  id="verified-only"
                  className="verified-check mb-0"
                  label="Verified only"
                  checked={verifiedOnly}
                  onChange={() => setVerifiedOnly(!verifiedOnly)}
                />

                <Form.Select
                  size="sm"
                  className="w-auto"
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(e) => changeSort(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name</option>
                  <option value="newest">Newest</option>
                </Form.Select>

                <div className="d-flex">
                  <button
                    className={`view-toggle-btn rounded-start ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <BsGrid3X3GapFill />
                  </button>
                  <button
                    className={`view-toggle-btn rounded-end ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <BsListUl />
                  </button>
                </div>

              </div>
            </div>

                        {activeFilters.length > 0 && (
              <div className="active-filters d-flex flex-wrap align-items-center gap-2 mb-3">
                {activeFilters.map((filter) => (
                  <span key={`${filter.group}-${filter.id}`} className="filter-chip">
                    {filter.label}
                    <button
                      className="chip-remove"
                      onClick={() => removeFilter(filter)}
                      aria-label={`Remove ${filter.label}`}
                    >
                      X
                    </button>
                  </span>
                ))}

                <button className="clear-all-link" onClick={clearAllFilters}>
                  Clear all filter
                </button>
              </div>
            )}

            {loading && <p className="text-center my-5">Loading products...</p>}

            {error && <p className="text-center text-danger my-5">{error}</p>}

            {!loading && !error && products.length === 0 && (
              <p className="text-center text-body-secondary my-5">
                No products match these filters. Try another category or a wider price range.
              </p>
            )}

            {!loading && !error && products.length > 0 && viewMode === "list" && (
              <div className="product-list">
                {products.map((pdct) => (
                  <ProductListCard
                    key={pdct.id}
                    id={pdct.id}
                    img={<img className="product-list-img" src={pdct.image} alt={pdct.name} />}
                    title={pdct.name}
                    price={pdct.price}
                    description={pdct.description}
                  />
                ))}
              </div>
            )}

            {!loading && !error && products.length > 0 && viewMode === "grid" && (
              <div className="recommended-grid products-grid">
                {products.map((pdct) => (
                  <div className="recommended-item" key={pdct.id}>
                    <Link to={`/products/${pdct.id}`} className="product-link">
                      <RecomendedCards
                        img={<img className="reco-card-img" src={pdct.image} alt={pdct.name} />}
                        title={pdct.name}
                        price={pdct.price}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            )}

                        <div className="d-flex justify-content-end align-items-center gap-3 my-4">

              <Form.Select
                className="w-auto"
                aria-label="Products per page"
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
              >
                <option value={10}>Show 10</option>
                <option value={15}>Show 15</option>
                <option value={20}>Show 20</option>
              </Form.Select>

              <Pagination className="products-pagination mb-0">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  <FiChevronLeft />
                </Pagination.Prev>

                {pageNumbers.map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}

                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  <FiChevronRight />
                </Pagination.Next>
              </Pagination>

            </div>

          </div>
        </div>

      </Container>
      <Newsletter />
    </PageLayout>
  );
};

export default Products;
