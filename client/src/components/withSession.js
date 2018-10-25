import React from 'react';

import { Query } from 'react-apollo';
import { GET_CURRENT_USER } from '../queries';

const withSession = Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({ data, loading, refetch, error }) => {
      if (loading) return null;
      //if (error) return `Error!: ${error}`;
      console.log('*withSession*', data);
      return <Component {...props} refetch={refetch} session={data} />;
    }}
  </Query>
);

export default withSession;
