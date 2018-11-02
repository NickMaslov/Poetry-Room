import React from 'react';
import { withRouter } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';

import { Mutation } from 'react-apollo';
import { ADD_POEM, GET_ALL_POEMS, GET_USER_POEMS } from '../../queries';
import Error from '../Error';
import withAuth from '../withAuth';

export const genresList = [
  'Tragedy',
  'Science fiction',
  'Fantasy',
  'Mythology',
  'Adventure',
  'Mystery',
  'Drama',
  'Romance',
  'Action / Adventure',
  'Satire',
  'Horror',
  'Tragic comedy',
  'Young adult fiction',
  'Dystopia',
  'Action thriller',
];

const initialState = {
  title: '',
  imageUrl: '',
  content: '',
  genres: '',
  username: '',
};

class AddPoem extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username,
    });
  }

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

  handleSubmit = (event, addPoem) => {
    event.preventDefault();
    addPoem().then(({ data }) => {
      this.clearState();
      this.props.history.push('/');
    });
  };

  validateForm = () => {
    const { title, imageUrl, content, genres } = this.state;
    const isInvalid = !title || !imageUrl || !content || !genres;
    return isInvalid;
  };

  updateCache = (cache, { data: { addPoem } }) => {
    const { getAllPoems } = cache.readQuery({ query: GET_ALL_POEMS });
    cache.writeQuery({
      query: GET_ALL_POEMS,
      data: {
        getAllPoems: [addPoem, ...getAllPoems],
      },
    });
  };

  render() {
    const { title, imageUrl, content, genres, username } = this.state;
    return (
      <div className="App">
        <h2 className="App">Add Poem</h2>
        <Mutation
          mutation={ADD_POEM}
          variables={{
            title,
            imageUrl,
            content,
            genres,
            username,
          }}
          refetchQueries={() => [
            { query: GET_USER_POEMS, variables: { username } },
          ]}
          update={this.updateCache}
        >
          {(addPoem, { data, loading, error }) => (
            <form
              className="form"
              onSubmit={event => this.handleSubmit(event, addPoem)}
            >
              <input
                type="text"
                name="title"
                value={title}
                placeholder="Poem Title"
                onChange={this.handleChange}
              />
              <input
                type="text"
                name="imageUrl"
                value={imageUrl}
                placeholder="Poem Image"
                onChange={this.handleChange}
              />
              <label htmlFor="genres">Add Genres</label>
              <select
                name="genres"
                id=""
                onChange={this.handleChange}
                value={genres}
              >
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
                events={{ change: this.handleEditorChange }}
              />
              {/* <textarea
                name="instructions"
                value={instructions}
                id=""
                cols="30"
                rows="10"
                placeholder="Add Instructions"
                onChange={this.handleChange}
              /> */}
              <button
                type="submit"
                className="button-primary"
                disabled={loading || this.validateForm()}
              >
                Submit
              </button>
              {error && <Error error={error} />}
            </form>
          )}
        </Mutation>
      </div>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddPoem)
);
