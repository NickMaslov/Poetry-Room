import { gql } from 'apollo-boost';
import { poemFragments } from './fragments';

/** Recipes Queries */
export const GET_ALL_POEMS = gql`
  query {
    getAllPoems {
      ...CompletePoem
    }
  }
  ${poemFragments.poem}
`;

export const GET_POEM = gql`
  query($_id: ID!) {
    getPoem(_id: $_id) {
      ...CompletePoem
    }
  }
  ${poemFragments.poem}
`;

export const SEARCH_POEMS = gql`
  query($searchTerm: String) {
    searchPoems(searchTerm: $searchTerm) {
      _id
      title
      likes
    }
  }
`;

/** Recepies Mutations */

export const ADD_POEM = gql`
  mutation(
    $title: String!
    $imageUrl: String!
    $content: String!
    $genres: String!
    $username: String
  ) {
    addPoem(
      title: $title
      imageUrl: $imageUrl
      content: $content
      genres: $genres
      username: $username
    ) {
      ...CompletePoem
    }
  }
  ${poemFragments.poem}
`;

export const LIKE_POEM = gql`
  mutation($_id: ID!, $username: String!) {
    likePoem(_id: $_id, username: $username) {
      ...LikePoem
    }
  }
  ${poemFragments.like}
`;

export const UNLIKE_POEM = gql`
  mutation($_id: ID!, $username: String!) {
    unlikeRecipe(_id: $_id, username: $username) {
      ...LikeRecipe
    }
  }
  ${poemFragments.like}
`;

export const DELETE_USER_POEM = gql`
  mutation($_id: ID!) {
    deleteUserPoem(_id: $_id) {
      _id
    }
  }
`;

export const UPDATE_USER_POEM = gql`
  mutation(
    $_id: ID!
    $title: String!
    $imageUrl: String!
    $content: String!
    $genres: String!
  ) {
    updateUserPoem(
      _id: $_id
      title: $title
      imageUrl: $imageUrl
      content: $content
      genres: $genres
    ) {
      _id
      title
      imageUrl
      content
      genres
    }
  }
`;

/** User Queries */

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
      joinDate
      email
      favorites {
        _id
        title
      }
    }
  }
`;

export const GET_USER_POEMS = gql`
  query($username: String!) {
    getUserPoems(username: $username) {
      _id
      title
      imageUrl
      content
      genres
      likes
    }
  }
`;

/** User Mutations */

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

export const SIGNIN_USER = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: $email, password: $password) {
      token
    }
  }
`;
