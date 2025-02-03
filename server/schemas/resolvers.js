// Start of JS file
// Resolvers for establishing Query and Mutation.
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw AuthenticationError;
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw AuthenticationError;
            }
      
            const token = signToken(user);
      
            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { authors, description, title, bookId, image, link }, context) => {
            if (context.user) {
                // Directly update the user's savedBooks array
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } },
                    { new: true, runValidators: true }
                );
                return updatedUser; // Return the user with updated books
            }
            throw AuthenticationError;
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                // Remove the book from the user's savedBooks array
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { 'savedBooks': { bookId: bookId } } },
                    { new: true }
                );
                return updatedUser; // Return updated user
            }
            throw AuthenticationError;
        },
    },
};

module.exports = resolvers;
// End of JS file