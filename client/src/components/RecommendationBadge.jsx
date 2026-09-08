// components/RecommendationBadge.jsx
function RecommendationBadge({ recommendation }) {
  if (!recommendation || !recommendation.text) {
    return null;
  }

  return <p className="recommendation-badge">{recommendation.text}</p>;
}

export default RecommendationBadge;