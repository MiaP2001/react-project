import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Product.scss";

export type iLanguage = "en" | "ru" | "pl" | "lt";

interface Product {
  id: number;
  name: string;
  name_ru: string;
  name_pl: string;
  name_lt: string;
  name_en: string;
  price: number;
  image: string;
  description: string;
  details: string;
}

interface TranslationWorld {
  details: string;
  price: string;
  addToCart: string;
}

const translations: Record<iLanguage, TranslationWorld> = {
  en: {
    details: "Product details",
    price: "Price",
    addToCart: "Add to cart",
  },
  ru: {
    details: "Детали продукта",
    price: "Цена",
    addToCart: "Добавить в корзину",
  },
  pl: {
    details: "Szczegóły produktu",
    price: "Cena",
    addToCart: "Dodaj do koszyka",
  },
  lt: { details: "Išsamiau", price: "Kaina", addToCart: "Pridėti į krepšelį" },
};

interface ProductProps {
  language: iLanguage;
}

const Product: React.FC<ProductProps> = ({ language }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error(error));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  let productName;
  switch (language) {
    case "ru":
      productName = product.name_ru;
      break;
    case "pl":
      productName = product.name_pl;
      break;
    case "lt":
      productName = product.name_lt;
      break;
    default:
      productName = product.name_en;
  }

  return (
    <div>
      <img src={product.image} alt={product[`name_${language}`]} />
      <h1>{translations[language].details}</h1>
      <p>{productName}</p>
      <p>
        {translations[language].price}: ${product.price}
      </p>
    </div>
  );
};

export default Product;
