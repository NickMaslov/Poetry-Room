const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllPoems: async (root, args, { Poem }) => {
      const allPoems = await Poem.find().sort({ createdDate: 'desc' });
      return allPoems;
    },
    getPoem: async (root, { _id }, { Poem }) => {
      const recipe = await Poem.findOne({ _id });
      return recipe;
    },
    searchPoems: async (root, { searchTerm }, { Poem }) => {
      if (searchTerm) {
        const searchResults = await Poem.find(
          {
            $text: { $search: searchTerm },
          },
          {
            score: { $meta: 'textScore' },
          }
        ).sort({
          score: { $meta: 'textScore' },
        });
        return searchResults;
      } else {
        const poems = await Poem.find().sort({ likes: 'desc' });
        return poems;
      }
    },

    getUserPoems: async (root, { username }, { Poem }) => {
      const userPoems = await Poem.find({ username }).sort({
        createdDate: 'desc',
      });
      return userPoems;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username,
      }).populate({
        path: 'favorites',
        model: 'Poem',
      });
      return user;
    },
  },
  Mutation: {
    addPoem: async (
      root,
      { title, imageUrl, content, genres, username },
      { Poem }
    ) => {
      const newPoem = await new Poem({
        title,
        imageUrl,
        content,
        genres,
        username,
      }).save();
      return newPoem;
    },
    likePoem: async (root, { _id, username }, { Poem, User }) => {
      const poem = await Poem.findOneAndUpdate(
        { _id },
        {
          $inc: {
            likes: 1,
          },
        }
      );
      const user = await User.findOneAndUpdate(
        { username },
        {
          $addToSet: {
            favorites: _id,
          },
        }
      );
      return poem;
    },
    unlikePoem: async (root, { _id, username }, { Poem, User }) => {
      const poem = await Poem.findOneAndUpdate(
        { _id },
        {
          $inc: {
            likes: -1,
          },
        }
      );
      const user = await User.findOneAndUpdate(
        { username },
        {
          $pull: {
            favorites: _id,
          },
        }
      );
      return poem;
    },
    deleteUserPoem: async (root, { _id }, { Poem }) => {
      const poem = await Poem.findOneAndRemove({ _id });
      return poem;
    },

    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error('Invalid password');
      return { token: createToken(user, process.env.SECRET, '1hr') };
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) throw new Error('User already exists');
      const newUser = await new User({
        username,
        email,
        password,
      }).save();
      return { token: createToken(newUser, process.env.SECRET, '1hr') };
    },
  },
};
