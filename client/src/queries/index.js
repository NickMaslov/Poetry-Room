import { gql } from 'apollo-boost';

export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      _id
      name
      category
      description
      instructions
      likes
      createdDate
    }
  }
`;
