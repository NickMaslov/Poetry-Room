import React from 'react';
import { Link } from 'react-router-dom';
import posed from 'react-pose';

const PoemItem = posed.li({
  shown: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
});

export default ({ _id, imageUrl, name, category, username }) => {
  return (
    <PoemItem
      style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}
      className="card"
    >
      <span className={category}>BY {username.toUpperCase()}</span>
      <div className="card-text">
        <Link to={`/recipes/${_id}`}>
          <h4>{name}</h4>
        </Link>
      </div>
    </PoemItem>
  );
};
