function PriceTag({ price, label = "per person" }) {
  if (price === undefined || price === null) return null;
  return (
    <p className="price-tag">
      ${price.toLocaleString()} <span className="price-tag-label">{label}</span>
    </p>
  );
}

export default PriceTag;