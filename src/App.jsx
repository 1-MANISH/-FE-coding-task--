import React, { useCallback, useEffect, useMemo, useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);


        const debounce = (func, delay) => {
                let timer;
                return (...args) => {
                        if(timer)
                        clearTimeout(timer)
                        timer = setTimeout(() => {
                                        func(...args);
                        }, delay)
                }
        }


        const fetchProducts = useCallback(async (searchText) => {
                if (!searchText.trim()) {
                        setProducts([])
                        return
                }

                setLoading(true);
                try {
                                const res = await fetch(
                                `https://dummyjson.com/products/search?q=${searchText}`
                        )
                        const result = await res.json()
                        console.log(result);
                        
                        setProducts(result.products || [])
                } catch (error) {
                                 console.error("Error fetching products:", error)
                 } finally {
                        setLoading(false)
                }
        }, [])

        // ✅ Create debounced function only once
        const debouncedFetch = useMemo(
                () => debounce(fetchProducts, 2000),
        [fetchProducts])


        useEffect(() => {
                if (query !== "") {
                        setLoading(true)
                        debouncedFetch(query)
                } else {
                        setProducts([])
                }
        }, [query, debouncedFetch])

  return (
    <div style={{ padding: "20px" }}>
        <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products..."
                style={{ padding: "8px", width: "250px" }}
        />

      {loading && <div>Loading...</div>}

         {!loading && products.length === 0 && query && <p>No products found</p>}

        {!loading &&
                products.map((product) => <p key={product.id}>{product.title}</p>)}
    </div>
  );
}

export default App;
