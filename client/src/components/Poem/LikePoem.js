import React from 'react';

import { Mutation } from 'react-apollo';
import { LIKE_POEM, GET_POEM, UNLIKE_POEM } from '../../queries';
import withSession from '../withSession';

class LikePoem extends React.Component {
  state = {
    liked: false,
    username: '',
  };

  componentDidMount() {
    if (this.props.session.getCurrentUser) {
      const { username, favorites } = this.props.session.getCurrentUser;
      const { _id } = this.props;
      const prevLiked =
        favorites.findIndex(favorite => favorite._id === _id) > -1;
      this.setState({
        liked: prevLiked,
        username,
      });
    }
  }

  handleClick = (likePoem, unlikePoem) => {
    this.setState(
      prevState => ({
        liked: !prevState.liked,
      }),
      () => this.handleLike(likePoem, unlikePoem)
    );
  };

  handleLike = (likePoem, unlikePoem) => {
    if (this.state.liked) {
      likePoem().then(async ({ data }) => {
        await this.props.refetch();
      });
    } else {
      unlikePoem().then(async ({ data }) => {
        await this.props.refetch();
      });
    }
  };

  updateLike = (cache, { data: { likePoem } }) => {
    const { _id } = this.props;
    const { getPoem } = cache.readQuery({
      query: GET_POEM,
      variables: { _id },
    });
    cache.writeQuery({
      query: GET_POEM,
      variables: { _id },
      data: {
        getPoem: { ...getPoem, likes: likePoem.likes + 1 },
      },
    });
  };

  updateUnlike = (cache, { data: { unlikePoem } }) => {
    const { _id } = this.props;
    const { getPoem } = cache.readQuery({
      query: GET_POEM,
      variables: { _id },
    });
    cache.writeQuery({
      query: GET_POEM,
      variables: { _id },
      data: {
        getPoem: { ...getPoem, likes: unlikePoem.likes - 1 },
      },
    });
  };

  render() {
    const { liked, username } = this.state;
    const { _id } = this.props;
    return (
      <Mutation
        mutation={UNLIKE_POEM}
        variables={{ _id, username }}
        update={this.updateUnlike}
      >
        {unlikePoem => (
          <Mutation
            mutation={LIKE_POEM}
            variables={{ _id, username }}
            update={this.updateLike}
          >
            {likePoem =>
              username && (
                <button
                  className="like-button"
                  onClick={() => this.handleClick(likePoem, unlikePoem)}
                >
                  {liked ? 'Unlike' : 'Like'}
                </button>
              )
            }
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default withSession(LikePoem);
