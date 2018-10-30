import React from 'react';
import { Link } from 'react-router-dom';

import { Query, Mutation } from 'react-apollo';
import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER,
} from '../../queries';
import Spinner from '../Spinner';

class UserRecipes extends React.Component {
  handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this recipe?'
    );
    if (confirmDelete) {
      deleteUserRecipe();
    }
  };
  render() {
    const { username } = this.props;
    return (
      <Query query={GET_USER_RECIPES} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error</div>;
          return (
            <ul>
              <h3>Your Poems:</h3>
              {!data.getUserRecipes.length && (
                <p>
                  <strong>You have not added any poems yet</strong>
                </p>
              )}
              {data.getUserRecipes.map(recipe => (
                <li key={recipe._id}>
                  <Link to={`/recipes/${recipe._id}`}>
                    <p>{recipe.name}</p>
                  </Link>
                  <p style={{ marginBottom: '0' }}>{recipe.likes}</p>
                  <Mutation
                    mutation={DELETE_USER_RECIPE}
                    variables={{ _id: recipe._id }}
                    refetchQueries={() => [
                      { query: GET_ALL_RECIPES },
                      { query: GET_CURRENT_USER },
                    ]}
                    update={(cache, { data: { deleteUserRecipe } }) => {
                      const { getUserRecipes } = cache.readQuery({
                        query: GET_USER_RECIPES,
                        variables: { username },
                      });
                      cache.writeQuery({
                        query: GET_USER_RECIPES,
                        variables: { username },
                        data: {
                          getUserRecipes: getUserRecipes.filter(
                            recipe => recipe._id !== deleteUserRecipe._id
                          ),
                        },
                      });
                    }}
                  >
                    {(deleteUserRecipe, attrs = {}) => {
                      return (
                        <div>
                          <button className="button-primary">Update</button>
                          <p
                            className="delete-button"
                            onClick={() => this.handleDelete(deleteUserRecipe)}
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

export default UserRecipes;
