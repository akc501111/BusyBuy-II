import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import ProductList from "../../components/Product/ProductList/ProductList";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import Loader from "../../components/UI/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/reducers/productsReducer"

function HomePage() {
  const dispatch = useDispatch();

  const { allProducts, loading } = useSelector((state) => state.products);

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState(75000);
  const [categories, setCategories] = useState({
    mensClothing: false,
    womensClothing: false,
    jewelery: false,
    womensClothing: false,
  });

  // Fetch products on app mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Rerender the products if the search or filter parameters change
  useEffect(() => {
    let filtered = allProducts;

    const selectedCategories = Object.keys(categories)
      .filter((key) => categories[key])
      .map((key) =>
        key.toLowerCase().replace(/['"]/g, "").replace(/\s+/g, "")
      );


    if (selectedCategories.length) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(
          product.category
            .toLowerCase()
            .replace(/['"]/g, "")
            .replace(/\s+/g, "")
        )
      );
    }

    filtered = filtered.filter(
      (product) => product.price <= priceRange
    );

    if (query.trim()) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    setProducts(filtered);
  }, [allProducts, query, priceRange, categories]);

  // Display loader while products are fetching using the Loader Component
  if (loading) return <Loader />;

  return (
    <div className={styles.homePageContainer}>
      <FilterSidebar
        setPriceRange={setPriceRange}
        setCategories={setCategories}
        priceRange={priceRange}
      />
      <form className={styles.form}>
        <input
          type="search"
          placeholder="Search By Name"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {products.length ? (
        <ProductList
          products={products}
          style={styles}
          onCart={false}
        />
      ) : null}
    </div>
  );
}

export default HomePage;
