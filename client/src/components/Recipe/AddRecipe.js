import React from 'react';

class AddRecipe extends React.Component {
  state = {
    name: '',
    instructions: '',
    category: 'Breakfast',
    description: '',
    username: '',
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

  render() {
    const { name, category, description, instructions } = this.state;
    console.log(this.props);
    return (
      <div className="App">
        <h2 className="App">Add Recipe</h2>
        <form className="form">
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Recipe Name"
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
          <textarea
            name="instructions"
            value={instructions}
            id=""
            cols="30"
            rows="10"
            placeholder="Add Instructions"
            onChange={this.handleChange}
          />
          <button type="submit" className="button-primary">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default AddRecipe;
