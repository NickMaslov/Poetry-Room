const jwt = require('jsonwebtoken');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (root, args, { Recipe }) =>
      // await Recipe.find(),
      {
        const allRecipes = await Recipe.find();
        return allRecipes;
      },
  },
  Mutation: {
    addRecipe: async (
      root,
      { name, description, category, instructions, username },
      { Recipe }
    ) => {
      const newRecipe = await new Recipe({
        name,
        description,
        category,
        instructions,
        username,
      }).save();
      return newRecipe;
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      console.log('here is something1');
      const user = await User.findOne({ username });
      if (user) throw new Error('User already exists');
      console.log('here is something2');
      const newUser = await new User({
        username,
        email,
        password,
      }).save();
      console.log('here is something3');
      return { token: createToken(newUser, process.env.SECRET, '1hr') };
    },
  },
};
