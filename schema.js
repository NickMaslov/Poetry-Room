exports.typeDefs = `

type Recipe {
    _id: ID
    name: String!
    imageUrl: String!
    category: String!
    description: String!
    instructions: String!
    createdDate: String
    likes: Int
    username: String
}

type Poem {
    _id: ID
    title: String!
    content: String!
    imageUrl: String!
    genres: String!
    createdDate: String
    likes: Int
    username: String
}

type User {
    _id: ID
    username: String! @unique
    password: String! 
    email: String!
    joinDate: String
    favorites: [Poem]
}

type Query {
    getAllPoems: [Poem]
    getPoem(_id: ID!): Poem
    searchPoems(searchTerm: String): [Poem]

    getCurrentUser: User
    getUserPoems(username: String!): [Poem]
}

type Token {
    token: String!
}

type Mutation {
    addPoem( 
        title: String!,
        imageUrl: String!,
        content: String!,
        genres: String!,
        username: String
    ): Poem
    deleteUserPoem(_id: ID!): Poem
    updateUserPoem(
        _id: ID!, 
        title: String!,
        imageUrl: String!,
        content: String!,
        genres: String!
    ): Poem
    likePoem(_id: ID!,username: String!): Poem
    unlikePoem(_id: ID!,username: String!): Poem

    signinUser(
        email: String!,
        password: String!
    ): Token

    signupUser(
        username: String!,
        password: String!,  
        email: String!
    ): Token
}
`;
