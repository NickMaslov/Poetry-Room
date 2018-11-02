import React from 'react';
import { withRouter } from 'react-router-dom';

import { Query } from 'react-apollo';
import { GET_POEM } from '../../queries';
import LikePoem from './LikePoem';
import Spinner from '../Spinner';

const PoemPage = ({ match }) => {
  const { _id } = match.params;
  return (
    <Query query={GET_POEM} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <div>Error</div>;
        const {
          title,
          imageUrl,
          content,
          genres,
          username,
          likes,
        } = data.getPoem;
        return (
          <div className="App">
            <div
              style={{
                background: `url(${imageUrl}) center center / cover no-repeat`,
              }}
              className="recipe-image"
            />
            <div className="recipe">
              <div className="recipe-header">
                <h2>
                  <strong>{title}</strong>
                </h2>
                <h5>
                  <em>{genres}</em>
                </h5>
                <p>Created by {username}</p>
                <p>
                  <span role="img" aria-label="heart">
                    ❤️
                    {likes}
                  </span>
                </p>
              </div>
              <blockquote className="recipe-description">
                <div
                  className="recipe-instructions"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </blockquote>
            </div>

            <LikePoem _id={_id} />
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(PoemPage);
