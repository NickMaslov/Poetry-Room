import React from 'react';
import { Link } from 'react-router-dom';

const SearchItem = ({ _id, title, likes }) => (
  <li>
    <Link to={`/poems/${_id}`}>
      <h4>{title}</h4>
    </Link>
    <p>Likes: {likes}</p>
  </li>
);
export default SearchItem;
