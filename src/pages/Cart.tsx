import React from "react";
import "../styles/Cart.scss";

type CartItem = {
  id: number;
  name: string;
  name_en?: string;
  name_ru?: string;
  name_pl?: string;
  name_lt?: string;
  image: string;
  price: number;
  quantity: number;
};

type CartProps = {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  placeOrder: () => void;
  language: "ru" | "en" | "pl" | "lt";
};

const translations = {
  ru: {
    cart: "Корзина",
    price: "Цена",
    quantity: "Количество",
    total: "Итого",
    remove: "❌ Удалить",
    emptyCart: "Ваша корзина пуста.",
    placeOrder: "Оформить заказ ✅",
  },
  en: {
    cart: "Cart",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    remove: "❌ Remove",
    emptyCart: "Your cart is empty.",
    placeOrder: "Place Order ✅",
  },
  pl: {
    cart: "Koszyk",
    price: "Cena",
    quantity: "Ilość",
    total: "Ogólny",
    remove: "❌ Usunąć",
    emptyCart: "Twój koszyk jest pusty.",
    placeOrder: "Złóż zamówienie ✅",
  },
  lt: {
    cart: "Krepšelis",
    price: "Kaina",
    quantity: "Kiekis",
    total: "Iš viso",
    remove: "❌ Pašalinti",
    emptyCart: "Jūsų krepšelis tuščias.",
    placeOrder: "Pateikite užsakymą ✅",
  },
};

const Cart: React.FC<CartProps> = ({
  cart,
  removeFromCart,
  placeOrder,
  language,
}) => {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1>{translations[language]?.cart || "Cart"}</h1>

      {cart.length > 0 ? (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item[`name_${language}`] || item.name_en || item.name}</h3>
                <p>
                  {translations[language]?.price || "Price"}: ${item.price}
                </p>
                <p>
                  {translations[language]?.quantity || "Quantity"}:{" "}
                  {item.quantity}
                </p>
                <button
                  className="remove-from-cart"
                  onClick={() => removeFromCart(item.id)}
                >
                  {translations[language]?.remove}
                </button>
              </div>
            </div>
          ))}
          <h2>
            {translations[language]?.total}: ${totalPrice.toFixed(2)}
          </h2>
          <button className="place-order" onClick={placeOrder}>
            {translations[language]?.placeOrder}
          </button>
        </div>
      ) : (
        <p>{translations[language]?.emptyCart}</p>
      )}
    </div>
  );
};

export default Cart;
