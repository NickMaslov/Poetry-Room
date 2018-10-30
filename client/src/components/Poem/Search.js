import React from 'react';

import { ApolloConsumer } from 'react-apollo';
import { SEARCH_POEMS } from '../../queries';
import SearchItem from './SearchItem';

class Search extends React.Component {
  state = {
    searchResults: [],
  };

  handleChange = ({ searchPoems }) => {
    this.setState({
      searchResults: searchPoems,
    });
  };
  render() {
    const { searchResults } = this.state;
    return (
      <ApolloConsumer>
        {client => (
          <div className="App">
            <input
              type="search"
              className="search"
              placeholder="Search for Poems"
              onChange={async event => {
                event.persist();
                const { data } = await client.query({
                  query: SEARCH_POEMS,
                  variables: { searchTerm: event.target.value },
                });
                this.handleChange(data);
              }}
            />
            <ul>
              {searchResults.map(poem => (
                <SearchItem {...poem} key={poem._id} />
              ))}
            </ul>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default Search;
