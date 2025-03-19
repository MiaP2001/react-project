import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Product.scss";

interface Product {
  id: number;
  name: string;
  name_ru: string;
  name_en: string;
  name_pl: string;
  name_lt: string;
  price: number;
  image: string;
  description: string;
}

const translations = {
  ru: { details: "Подробнее", price: "Цена", addToCart: "Добавить в корзину" },
  en: { details: "Details", price: "Price", addToCart: "Add to Cart" },
  pl: { details: "Szczegóły", price: "Cena", addToCart: "Dodaj do koszyka" },
  lt: { details: "Išsamiau", price: "Kaina", addToCart: "Pridėti į krepšelį" },
};

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [language] = useState<"ru" | "en" | "pl" | "lt">("ru");

  useEffect(() => {
    console.log("ID:", id);
    fetch(`http://localhost:3001/products?id=${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data[0]))
      .catch((error) =>
        console.error("Ошибка загрузки данных о продукте:", error)
      );
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="product-page">
      <img src={product.image} alt={product[`name_${language}`]} />
      <h1>{product[`name_${language}` as keyof Product] || product.name_en}</h1>
      <p>
        {translations[language].price}: ${product.price}
      </p>
      <p>{product.description}</p>
      <button>{translations[language].addToCart}</button>
    </div>
  );
}

export default Product;
