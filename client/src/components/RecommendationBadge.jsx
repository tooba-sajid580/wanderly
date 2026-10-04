function RecommendationBadge({ recommendation }) {
  const items = recommendation?.items || [];
  const tip = recommendation?.text;

  if (items.length === 0 && !tip) {
    return null;
  }

  return (
    <div className="recommendation-badge">
      {items.length > 0 && (
        <>
          <p className="recommendation-title">What to pack for this weather</p>
          <ul className="recommendation-list">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {tip && <p className="recommendation-tip">{tip}</p>}
    </div>
  );
}

export default RecommendationBadge;