import { useState, useEffect } from "react";
import "../styles/Orders.scss";

type OrderItem = {
  id: number;
  name: string;
  name_en?: string;
  name_ru?: string;
  name_pl?: string;
  name_lt?: string;
  image: string;
  quantity: number;
};

type Order = {
  id: number;
  items: OrderItem[];
};

type OrdersProps = {
  language: "ru" | "en" | "pl" | "lt";
};

const translations = {
  ru: {
    history: "История заказов",
    order: "Заказ",
    quantity: "шт.",
    noOrders: "Вы ещё ничего не заказывали.",
  },
  en: {
    history: "Order History",
    order: "Order",
    quantity: "pcs.",
    noOrders: "You haven't ordered anything yet.",
  },
  pl: {
    history: "Historia zamówień",
    order: "Zamówienie",
    quantity: "szt.",
    noOrders: "Nie zamówiłeś jeszcze niczego.",
  },
  lt: {
    history: "Užsakymų istorija",
    order: "Užsakymas",
    quantity: "vnt.",
    noOrders: "Jūs dar nieko neužsisakėte.",
  },
};

const Orders: React.FC<OrdersProps> = ({ language }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  return (
    <div>
      <h1>{translations[language].history} 📜</h1>

      {orders.length > 0 ? (
        <div className="orders">
          {orders.map((order) => (
            <div key={order.id} className="order">
              <h3>
                {translations[language].order} #{order.id}
              </h3>
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.image}
                    alt={
                      item[`name_${language}`] || item.name_en || "Нет данных"
                    }
                  />
                  <p>
                    {item[`name_${language}`] || item.name_en || "Нет данных"} -
                    {item.quantity} {translations[language].quantity}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>{translations[language].noOrders}</p>
      )}
    </div>
  );
};

export default Orders;
