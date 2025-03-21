import { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProductPage from "./pages/Product";
import "./styles/Global.scss";

type Product = {
  id: number;
  name: string;
  name_en?: string;
  name_ru?: string;
  name_pl?: string;
  name_lt?: string;
  image: string;
  price: number;
  quantity: number;
  category_en: string;
};

type Order = {
  id: number;
  items: Product[];
};

type Language = "ru" | "en" | "pl" | "lt";

type Translation = {
  home: string;
  cart: string;
  orders: string;
  changeLang: string;
  chooseLang: string;
  close: string;
  placeOrder: string;
  emptyCart: string;
  history: string;
  noOrders: string;
  welcome: string;
  chooseCategory: string;
  categories: {
    all: string;
    drinks: string;
    food: string;
  };
};

const translations: Record<Language, Translation> = {
  ru: {
    home: "Главная",
    cart: "Корзина",
    orders: "История заказов",
    changeLang: "Сменить язык",
    chooseLang: "Выберите язык",
    close: "Закрыть",
    placeOrder: "Оформить заказ",
    emptyCart: "Ваша корзина пуста.",
    history: "История заказов",
    noOrders: "Вы ещё ничего не заказывали.",
    welcome: "Добро пожаловать!",
    chooseCategory: "Выберите категорию",
    categories: {
      all: "Все",
      drinks: "Напитки",
      food: "Еда",
    },
  },
  en: {
    home: "Home",
    cart: "Cart",
    orders: "Order History",
    changeLang: "Change Language",
    chooseLang: "Choose a language",
    close: "Close",
    placeOrder: "Place Order",
    emptyCart: "Your cart is empty.",
    history: "Order History",
    noOrders: "You haven't ordered anything yet.",
    welcome: "Welcome!",
    chooseCategory: "Choose a category",
    categories: {
      all: "All",
      drinks: "Drinks",
      food: "Food",
    },
  },
  pl: {
    home: "Strona główna",
    cart: "Koszyk",
    orders: "Historia zamówień",
    changeLang: "Zmień język",
    chooseLang: "Wybierz język",
    close: "Zamknij",
    placeOrder: "Złóż zamówienie",
    emptyCart: "Twój koszyk jest pusty.",
    history: "Historia zamówień",
    noOrders: "Nie zamówiłeś jeszcze niczego.",
    welcome: "Witamy!",
    chooseCategory: "Wybierz kategorię",
    categories: {
      all: "Wszystko",
      drinks: "Napoje",
      food: "Jedzenie",
    },
  },
  lt: {
    home: "Pagrindinis",
    cart: "Krepšelis",
    orders: "Užsakymų istorija",
    changeLang: "Keisti kalbą",
    chooseLang: "Pasirinkite kalbą",
    close: "Uždaryti",
    placeOrder: "Patvirtinti užsakymą",
    emptyCart: "Jūsų krepšelis tuščias.",
    history: "Užsakymų istorija",
    noOrders: "Jūs dar nieko neužsisakėte.",
    welcome: "Sveiki atvykę!",
    chooseCategory: "Pasirinkite kategoriją",
    categories: {
      all: "Visi",
      drinks: "Gėrimai",
      food: "Maistas",
    },
  },
};

function App() {
  const [cart, setCart] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) || "ru";
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const itemExists = prevCart.find((item) => item.id === product.id);
      if (itemExists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevCart, { ...product }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const placeOrder = () => {
    const previousOrders: Order[] = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );
    const newOrder: Order = { id: Date.now(), items: cart };
    localStorage.setItem(
      "orders",
      JSON.stringify([...previousOrders, newOrder])
    );
    setCart([]);
  };

  return (
    <div>
      <nav>
        <NavLink to="/">{translations[language].home}</NavLink>
        <NavLink to="/cart">
          {translations[language].cart} ({cart.length})
        </NavLink>
        <NavLink to="/orders">{translations[language].orders}</NavLink>

        <button onClick={() => setIsModalOpen(true)}>
          🌍 {translations[language].changeLang}
        </button>
      </nav>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{translations[language].chooseLang}</h2>
            {(["ru", "en", "pl", "lt"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setIsModalOpen(false);
                }}
              >
                {translations[lang].chooseLang}
              </button>
            ))}
            <button className="close" onClick={() => setIsModalOpen(false)}>
              ❌ {translations[language].close}
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home addToCart={addToCart} cart={cart} language={language} />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              placeOrder={placeOrder}
              language={language}
            />
          }
        />
        <Route path="/orders" element={<Orders language={language} />} />
        <Route
          path="/product/:id"
          element={<ProductPage language={language} />}
        />
      </Routes>
    </div>
  );
}

export default App;
