document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleSidebar");
  const closeButton = document.getElementById("closeSidebar");
  const filterSidebar = document.getElementById("filterSidebar");
  const productGrid = document.getElementById("productGrid");
  const loader = document.getElementById("loader");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const searchBar = document.getElementById("searchBar");
  const productCount = document.getElementById("productCount");
  const filters = document.querySelectorAll(".filter-checkbox");

  let products = [];
  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  toggleButton.addEventListener("click", () => {
    filterSidebar.classList.add("active");
  });

  closeButton.addEventListener("click", () => {
    filterSidebar.classList.remove("active");
  });

  async function fetchProducts() {
    loader.style.display = "block";
    loadMoreBtn.style.display = "none";
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    loader.style.display = "none";
    products = data;
    filteredProducts = data;
    updateProductList();
  }

  function updateProductList() {
    productGrid.innerHTML = "";
    filteredProducts.forEach((product) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            `;
      productGrid.appendChild(div);
    });
    productCount.textContent = `${filteredProducts.length} Results`;
    if (filteredProducts.length === 0) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  }

  filters.forEach((filter) =>
    filter.addEventListener("change", () => {
      const selectedCategories = Array.from(filters)
        .filter((f) => f.checked)
        .map((f) => f.value);
      filteredProducts = products.filter((product) =>
        selectedCategories.length > 0
          ? selectedCategories.includes(product.category)
          : true
      );
      updateProductList();
    })
  );

  searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    updateProductList();
  });

  function displayProducts() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    const productsToDisplay = products.slice(start, end);

    productsToDisplay.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product");
      productCard.innerHTML = `
          <img src="${product.image}" alt="${product.title}" />
          <h3>${product.title}</h3>
          <p>$${product.price.toFixed(2)}</p>
        `;
      productGrid.appendChild(productCard);
    });

    // Hide Load More button if no more products
    if (end >= products.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  }

  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    displayProducts();
  });

  fetchProducts();
});
