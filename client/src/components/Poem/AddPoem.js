import React from 'react';
import { withRouter } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';

import { Mutation } from 'react-apollo';
import { ADD_POEM, GET_ALL_POEMS, GET_USER_POEMS } from '../../queries';
import Error from '../Error';
import withAuth from '../withAuth';

const initialState = {
  title: '',
  imageUrl: '',
  content: '',
  genres: 'Breakfast',
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
    this.setState({ instructions: newContent });
  };

  handleSubmit = (event, addPoem) => {
    event.preventDefault();
    addPoem().then(({ data }) => {
      this.clearState();
      this.props.history.push('/');
    });
  };

  validateForm = () => {
    const { name, imageUrl, category, description, instructions } = this.state;
    const isInvalid =
      !name || !imageUrl || !category || !description || !instructions;
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
    const {
      name,
      imageUrl,
      category,
      description,
      instructions,
      username,
    } = this.state;
    return (
      <div className="App">
        <h2 className="App">Add Poem</h2>
        <Mutation
          mutation={ADD_POEM}
          variables={{
            name,
            imageUrl,
            category,
            description,
            instructions,
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
                name="name"
                value={name}
                placeholder="Poem Name"
                onChange={this.handleChange}
              />
              <input
                type="text"
                name="imageUrl"
                value={imageUrl}
                placeholder="Poem Image"
                onChange={this.handleChange}
              />
              <select
                name="category"
                id=""
                onChange={this.handleChange}
                value={category}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
              <input
                type="text"
                name="description"
                value={description}
                placeholder="Add Description"
                onChange={this.handleChange}
              />
              <label htmlFor="instructions">Add Instructions</label>
              <CKEditor
                name="instructions"
                content={instructions}
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
