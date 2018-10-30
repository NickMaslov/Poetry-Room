import React from 'react';
import { Link } from 'react-router-dom';

import { Query, Mutation } from 'react-apollo';
import {
  GET_USER_POEMS,
  DELETE_USER_POEM,
  GET_ALL_POEMS,
  GET_CURRENT_USER,
} from '../../queries';
import Spinner from '../Spinner';

class UserPoems extends React.Component {
  handleDelete = deleteUserPoem => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this poem?'
    );
    if (confirmDelete) {
      deleteUserPoem();
    }
  };
  render() {
    const { username } = this.props;
    return (
      <Query query={GET_USER_POEMS} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error</div>;
          return (
            <ul>
              <h3>Your Poems:</h3>
              {!data.getUserPoems.length && (
                <p>
                  <strong>You have not added any poems yet</strong>
                </p>
              )}
              {data.getUserPoems.map(poem => (
                <li key={poem._id}>
                  <Link to={`/poems/${poem._id}`}>
                    <p>{poem.name}</p>
                  </Link>
                  <p style={{ marginBottom: '0' }}>{poem.likes}</p>
                  <Mutation
                    mutation={DELETE_USER_POEM}
                    variables={{ _id: poem._id }}
                    refetchQueries={() => [
                      { query: GET_ALL_POEMS },
                      { query: GET_CURRENT_USER },
                    ]}
                    update={(cache, { data: { deleteUserPoem } }) => {
                      const { getUserPoems } = cache.readQuery({
                        query: GET_USER_POEMS,
                        variables: { username },
                      });
                      cache.writeQuery({
                        query: GET_USER_POEMS,
                        variables: { username },
                        data: {
                          getUserPoems: getUserPoems.filter(
                            poem => poem._id !== deleteUserPoem._id
                          ),
                        },
                      });
                    }}
                  >
                    {(deleteUserPoem, attrs = {}) => {
                      return (
                        <div>
                          <button className="button-primary">Update</button>
                          <p
                            className="delete-button"
                            onClick={() => this.handleDelete(deleteUserPoem)}
                          >
                            {attrs.loading ? 'deleting...' : 'x'}
                          </p>
                        </div>
                      );
                    }}
                  </Mutation>
                </li>
              ))}
            </ul>
          );
        }}
      </Query>
    );
  }
}

export default UserPoems;
