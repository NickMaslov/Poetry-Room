import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import './index.css';

import Home from './components/Home';
import Navbar from './components/Navbar';
import withSession from './components/withSession';
import Signin from './components/Auth/Singin';
import Signup from './components/Auth/Singup';
import Search from './components/Poem/Search';
import AddPoem from './components/Poem/AddPoem';
import PoemPage from './components/Poem/PoemPage';
import Profile from './components/Profile/Profile';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: 'https://poetryroom.herokuapp.com/graphql',
  // uri: 'http://localhost:4444/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      // console.log('Network Error', networkError);
      // if (networkError.statusCode === 401) {
      localStorage.setItem('token', '');
      // localStorage.removeItem('token');
      // }
    }
  },
});

const Root = ({ refetch, session }) => (
  <Router>
    <Fragment>
      <div style={{ color: 'red', backgroundColor: 'lightpink' }}>
        **website currently under construction
      </div>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/search" component={Search} />
        <Route path="/poems/:_id" component={PoemPage} />
        <Route path="/profile" render={() => <Profile session={session} />} />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route path="/poem/add" render={() => <AddPoem session={session} />} />
        <Redirect to="/" />
      </Switch>
    </Fragment>
  </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root')
);
