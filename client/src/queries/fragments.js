import { gql } from 'apollo-boost';
export const poemFragments = {
  poem: gql`
    fragment CompletePoem on Poem {
      _id
      title
      content
      imageUrl
      genres
      createdDate
      likes
      username
    }
  `,
  like: gql`
    fragment LikePoem on Poem {
      _id
      likes
    }
  `,
};
