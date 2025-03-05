import React, { useState, useEffect } from "react";
import {
  Clock,
  Tag,
  ShoppingCart,
  Box,
  Calendar,
  Repeat,
  Snowflake,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Category icons mapping
const categoryIcons = {
  "Perishable Goods": Box,
  "Event-based Products": Calendar,
  "Subscription Services": Repeat,
  "Seasonal Products": Snowflake,
};

const initialProducts = [
  {
    id: 1,
    name: "Fresh Milk",
    category: "Perishable Goods",
    originalPrice: 4.99,
    currentPrice: 2.99,
    discountPercentage: 40,
    expiryDate: new Date("2025-03-10"),
    image: "/api/placeholder/300/200",
  },
  {
    id: 2,
    name: "Organic Apples",
    category: "Perishable Goods",
    originalPrice: 5.99,
    currentPrice: 3.49,
    discountPercentage: 42,
    expiryDate: new Date("2025-03-08"),
    image: "/api/placeholder/300/200",
  },
  {
    id: 3,
    name: "Vitamin C Serum",
    category: "Subscription Services",
    originalPrice: 29.99,
    currentPrice: 14.99,
    discountPercentage: 50,
    expiryDate: new Date("2025-06-15"),
    image: "/api/placeholder/300/200",
  },
  {
    id: 4,
    name: "Pain Relief Tablets",
    category: "Event-based Products",
    originalPrice: 12.99,
    currentPrice: 6.99,
    discountPercentage: 46,
    expiryDate: new Date("2025-12-20"),
    image: "/api/placeholder/300/200",
  },
  {
    id: 5,
    name: "Winter Gloves",
    category: "Seasonal Products",
    originalPrice: 15.99,
    currentPrice: 7.99,
    discountPercentage: 50,
    expiryDate: new Date("2025-01-15"),
    image: "/api/placeholder/300/200",
  },
];

const LandingPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Generate categories array from products
  const categories = [
    ...Array.from(new Set(products.map((product) => product.category))).map(
      (category) => ({
        name: category,
        icon: categoryIcons[category] || Box,
      })
    ),
  ];

  // Synchronize search query with URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchQuery(queryParams.get("search") || ""); // Sync the query params with the state
  }, [location.search]);

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`?search=${searchQuery}`);
    } else {
      navigate("/");
    }
  };

  const calculateDaysToExpiry = (expiryDate) => {
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-center text-blue-900">
          Dynamic Discounts Marketplace
        </h1>
        <p className="text-center text-gray-600 mt-4 text-lg">
          Discover amazing deals on products across various categories
        </p>
      </header>

      {/* Category Selection */}
      <div className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`cursor-pointer rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  selectedCategory === category.name
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-900 hover:bg-blue-100"
                }`}
              >
                <CategoryIcon
                  className={`mx-auto mb-4 ${
                    selectedCategory === category.name
                      ? "text-white"
                      : "text-blue-600"
                  }`}
                  size={48}
                />
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => {
          const daysToExpiry = calculateDaysToExpiry(product.expiryDate);
          const urgencyLevel =
            daysToExpiry <= 7
              ? "text-red-600 font-bold"
              : daysToExpiry <= 14
              ? "text-orange-500"
              : "text-green-600";

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-bold mb-3 text-blue-900">
                  {product.name}
                </h2>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="line-through text-gray-500 mr-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-green-600 font-bold text-xl">
                      ${product.currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-1 text-blue-500" size={20} />
                    <span className="text-blue-600 font-semibold">
                      {product.discountPercentage}% OFF
                    </span>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <Clock className="mr-2 text-gray-600" size={20} />
                  <span className={`${urgencyLevel}`}>
                    {daysToExpiry} days until expiry
                  </span>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
                  <ShoppingCart className="mr-2" size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discount Explanation */}
      <div className="mt-16 bg-blue-50 p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          How Our Discounts Work
        </h2>
        <p className="text-center text-gray-700 text-lg max-w-2xl mx-auto">
          Our unique discount strategy focuses on helping you save money while
          reducing product waste. As products approach their expiry date, we
          offer increasingly attractive discounts.
        </p>
        <p className="text-center text-gray-500 mt-4 italic">
          Smart shopping meets sustainability
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
