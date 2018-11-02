import React from 'react';
import { Link } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';
import { genresList } from '../Poem/AddPoem';

import { Query, Mutation } from 'react-apollo';
import {
  GET_USER_POEMS,
  DELETE_USER_POEM,
  GET_ALL_POEMS,
  GET_CURRENT_USER,
} from '../../queries';
import Spinner from '../Spinner';

class UserPoems extends React.Component {
  state = {
    title: '',
    content: '',
    imageUrl: '',
    genres: '',
    modal: false,
  };

  handleDelete = deleteUserPoem => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this poem?'
    );
    if (confirmDelete) {
      deleteUserPoem();
    }
  };
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };
  handleEditorChange = event => {
    const newContent = event.editor.getData();
    this.setState({ content: newContent });
  };
  render() {
    const { username } = this.props;
    const { modal } = this.state;
    return (
      <Query query={GET_USER_POEMS} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error</div>;
          return (
            <ul>
              {modal && (
                <EditPoemModal
                  handleChange={this.handleChange}
                  handleEditorChange={this.handleEditorChange}
                  content={this.state.content}
                  closeModal={this.closeModal}
                />
              )}
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
                          <button
                            className="button-primary"
                            onClick={() => this.setState({ modal: true })}
                          >
                            Update
                          </button>
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

const EditPoemModal = ({
  handleChange,
  handleEditorChange,
  content,
  closeModal,
}) => (
  <div className="modal modal-open">
    <div className="modal-inner">
      <div className="modal-content">
        <form className="modal-content-inner">
          <h4>Edit Recipe</h4>
          <input
            type="text"
            name="title"
            placeholder="Poem Title"
            onChange={handleChange}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Poem Image"
            onChange={handleChange}
          />
          <label htmlFor="genres">Add Genres</label>
          <select name="genres" id="" onChange={handleChange}>
            {genresList.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <label htmlFor="content">Add Content</label>
          <CKEditor
            name="content"
            content={content}
            events={{ change: handleEditorChange }}
          />
          <hr />
          <div className="modal-buttons">
            <div type="submit" className="button-primary">
              Update
            </div>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default UserPoems;
