import React from 'react';

function StarRating({ rating, size = 'text-xs' }) {
  let stars = [];
  const fullStars = Math.floor(rating);
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<i key={i} className={`bi bi-star-fill text-amber-400 ${size}`}></i>);
    } else if (i === fullStars && rating % 1 !== 0) {
      stars.push(<i key={i} className={`bi bi-star-half text-amber-400 ${size}`}></i>);
    } else {
      stars.push(<i key={i} className={`bi bi-star text-slate-300 ${size}`}></i>);
    }
  }
  return <div className="flex gap-0.5">{stars}</div>;
}

export default StarRating;
