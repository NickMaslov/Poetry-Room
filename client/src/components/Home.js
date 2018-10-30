import React from 'react';
import './App.css';
import posed from 'react-pose';

import { Query } from 'react-apollo';
import { GET_ALL_POEMS } from '../queries';
import PoemItem from './Poem/PoemItem';
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

class Home extends React.Component {
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
          Find Poems You <strong>Love</strong>
        </h1>
        <Query query={GET_ALL_POEMS}>
          {({ data, loading, error }) => {
            if (loading) return <Spinner />;
            if (error) return <div>Error</div>;
            //console.log(data);
            const { on } = this.state;
            return (
              <PoemList pose={on ? 'shown' : 'hidden'} className="cards">
                {data.getAllPoems.map(poem => (
                  <PoemItem {...poem} key={poem._id} />
                ))}
              </PoemList>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Home;
