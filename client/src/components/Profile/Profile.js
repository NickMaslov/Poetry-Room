import React from 'react';

import UserInfo from './UserInfo';
import UserPoems from './UserPoems';
import withAuth from '../withAuth';

const Profile = ({ session }) => (
  <div className="App">
    <UserInfo session={session} />
    <UserPoems username={session.getCurrentUser.username} />
  </div>
);

export default withAuth(session => session && session.getCurrentUser)(Profile);
