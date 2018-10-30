import React from 'react';
import './App.css';
import posed from 'react-pose';

import { Query } from 'react-apollo';
import { GET_ALL_RECIPES } from '../queries';
import PoemItem from './Recipe/PoemItem';
import Spinner from './Spinner';

const PoemList = posed.ul({
  shown: {
    x: '0%',
    staggerChildren: 100,
  },
  hidden: {
    x: '-100%',
  },
});

class App extends React.Component {
  state = {
    on: false,
  };

  componentDidMount() {
    setTimeout(this.slideIn, 200);
  }

  slideIn = () => {
    this.setState({
      on: !this.state.on,
    });
  };

  render() {
    return (
      <div className="App">
        <h1 className="main-title">
          Find Recipes You <strong>Love</strong>
        </h1>
        <Query query={GET_ALL_RECIPES}>
          {({ data, loading, error }) => {
            if (loading) return <Spinner />;
            if (error) return <div>Error</div>;
            //console.log(data);
            const { on } = this.state;
            return (
              <PoemList pose={on ? 'shown' : 'hidden'} className="cards">
                {data.getAllRecipes.map(recipe => (
                  <PoemItem {...recipe} key={recipe._id} />
                ))}
              </PoemList>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default App;
