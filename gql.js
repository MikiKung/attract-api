// apollo express
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const db = require("./db/mongo")
db

const User = require("./models/user")
const Post = require("./models/post")
const Comment = require("./models/comment")
const Category = require("./models/category")
const Mark = require("./models/mark")

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    users: [User]
    searchPostByText(text: String): [Post]
  }

  type User {
    _id: ID
    firstname: String
    surename: String
    username: String
    email: String
    bio: String
    gender: String
    postId: [Post]
    img: String
    bgImg: String
  }

  type Post {
    _id: ID
    ownUserId: User
    postText: String
    timePost: String
    commentId: [Comment]
    markId: [Mark]
    categoryId: [Category]
  }

  type Comment {
    _id: ID
    commentText: String
    ownUserId: User
    postId: Post
  }

  type Mark {
    _id: ID
    userId: User
    postId: Post
  }

  type Category {
      _id: ID
      name: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    users: async () => {
        return await User.find()
    },
    searchPostByText: async (_, {text}) => {
        return await Post.find({
            postText: {
                $regex: new RegExp(text, "gi")
            }
        })
    }
  },
  User: {
      postId: async (parent) => {
        return await Post.find({ownUserId: parent._id})
      }
  },
  Post: {
    commentId: async (parent) => {
        return await Comment.find({postId: parent._id})
    },
    ownUserId: async (parent) => {
        return await User.findById(parent.ownUserId)
    },
    categoryId: async (parent) => {
        return await Category.find({_id: {$in: parent.categoryId}})
    },
    markId: async (parent) => {
        return await Mark.find({postId: parent._id})
    }
  },
  Comment: {
    ownUserId: async (parent) => {
        return await User.findById(parent.ownUserId)
      },
    postId: async (parent) => {
        return await Post.findById(parent.postId)
    }
  },
  Mark: {
    userId: async (parent) => {
        return await User.findById(parent.userId)
    },
    postId: async (parent) => {
        return await Post.findById(parent.postId)
    }
  }
};

const startServer =async  () => {

    const server = new ApolloServer({ typeDefs, resolvers });
    
    const app = express();
    await server.start()
    server.applyMiddleware({ app });
    app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
}

startServer()