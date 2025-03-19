import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.scss";

type Product = {
  id: number;
  name: string;
  name_en?: string;
  name_ru?: string;
  name_pl?: string;
  name_lt?: string;
  image: string;
  price: number;
  category_en: string;
};

type HomeProps = {
  addToCart: (product: Product & { quantity: number }) => void;
  cart: Product[];
  language: "ru" | "en" | "pl" | "lt";
};

const translations = {
  ru: {
    welcome: "Добро пожаловать в Foodie Market",
    chooseCategory: "Выберите категорию и заказывайте вкусную еду!",
    quantity: "Количество",
    price: "Цена",
    addToCart: "Добавить",
    added: "✅ Добавлено",
    cartItems: "Товаров в корзине",
    details: "Подробнее",
    categories: {
      all: "Все",
      pizza: "Пицца",
      sushi: "Суши",
      burgers: "Бургеры",
      desserts: "Десерты",
      drinks: "Напитки",
    },
  },
  en: {
    welcome: "Welcome to Foodie Market",
    chooseCategory: "Choose a category and order delicious food!",
    quantity: "Quantity",
    price: "Price",
    addToCart: "Add to Cart",
    added: "✅ Added",
    cartItems: "Items in cart",
    details: "Details",
    categories: {
      all: "All",
      pizza: "Pizza",
      sushi: "Sushi",
      burgers: "Burgers",
      desserts: "Desserts",
      drinks: "Drinks",
    },
  },
  pl: {
    welcome: "Witamy w Foodie Market",
    chooseCategory: "Wybierz kategorię i zamów pyszne jedzenie!",
    quantity: "Ilość",
    price: "Cena",
    addToCart: "Dodaj do koszyka",
    added: "✅ Dodano",
    cartItems: "Produkty w koszyku",
    details: "Szczegóły",
    categories: {
      all: "Wszystko",
      pizza: "Pizza",
      sushi: "Sushi",
      burgers: "Burgery",
      desserts: "Desery",
      drinks: "Napoje",
    },
  },
  lt: {
    welcome: "Sveiki atvykę į Foodie Market",
    chooseCategory: "Pasirinkite kategoriją ir užsisakykite skanaus maisto!",
    quantity: "Kiekis",
    price: "Kaina",
    addToCart: "Pridėti į krepšelį",
    added: "✅ Pridėta",
    cartItems: "Prekės krepšelyje",
    details: "Išsami informacija",
    categories: {
      all: "Visi",
      pizza: "Pica",
      sushi: "Sušiai",
      burgers: "Mėsainiai",
      desserts: "Desertai",
      drinks: "Gėrimai",
    },
  },
};

const Home: React.FC<HomeProps> = ({ addToCart, cart, language }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [selectedQuantity, setSelectedQuantity] = useState<{
    [key: number]: number;
  }>({});
  const [buttonState, setButtonState] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => console.error("Ошибка загрузки:", error));
  }, []);

  const handleFilter = (selectedCategory: string) => {
    setCategory(selectedCategory);
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category_en.toLowerCase() === selectedCategory)
      );
    }
  };

  const handleQuantityChange = (id: number, value: string) => {
    setSelectedQuantity((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = selectedQuantity[product.id] || 1;
    addToCart({ ...product, quantity });

    setButtonState((prev) => ({ ...prev, [product.id]: true }));

    setTimeout(() => {
      setButtonState((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  type TranslationsType = typeof translations;

  return (
    <div>
      <h1>{translations[language]?.welcome || "Welcome!"}</h1>
      <h2>
        {translations[language]?.cartItems || "Items in cart"}: {cart.length}
      </h2>
      <p>{translations[language]?.chooseCategory || "Choose a category"}</p>

      <div className="filters">
        {Object.keys(translations[language]?.categories || {}).map((key) => (
          <button
            key={key}
            onClick={() => handleFilter(key)}
            className={category === key ? "active" : ""}
          >
            {
              translations[language as keyof TranslationsType]?.categories[
                key as keyof TranslationsType["ru"]["categories"]
              ]
            }
          </button>
        ))}
      </div>

      <div className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isButtonAdded = buttonState[product.id];

            return (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product[`name_${language}`] || product.name_en}</h3>
                <p>
                  {translations[language]?.price || "Price"}: ${product.price}
                </p>

                <Link to={`/product/${product.id}`}>
                  <button>
                    {translations[language]?.details || "Details"}
                  </button>
                </Link>

                <div className="quantity-selector">
                  <label>
                    {translations[language]?.quantity || "Quantity"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={selectedQuantity[product.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                  />
                </div>

                <button
                  className={`add-to-cart ${isButtonAdded ? "added" : ""}`}
                  onClick={() => handleAddToCart(product)}
                >
                  {isButtonAdded
                    ? translations[language]?.added || "✅ Added"
                    : translations[language]?.addToCart || "Add to Cart"}
                </button>
              </div>
            );
          })
        ) : (
          <p>Нет доступных продуктов.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
