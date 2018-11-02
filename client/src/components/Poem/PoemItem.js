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

export default ({ _id, imageUrl, title, category, content, username }) => {
  return (
    <PoemItem
      style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}
      className="card"
    >
      <span className="writer_tag">BY {username.toUpperCase()}</span>
      <div className="card-text">
        <Link to={`/poems/${_id}`}>
          <h4>{title}</h4>
          <div
            className="first_row"
            dangerouslySetInnerHTML={{
              __html: `${content.slice(0, 30)}...`,
            }}
          />
        </Link>
      </div>
    </PoemItem>
  );
};
