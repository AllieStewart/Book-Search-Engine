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
        saveBook: async (parent, { authors, description, title, bookId, image, link }) => {
            if (context.user) {
                const book = await User.create({
                    savedBooks:
                    [
                        authors,
                        description,
                        title,
                        bookId,
                        image,
                        link
                    ],
                });

                await User.findOneandUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book._id }}
                );

                return book;
            }
            throw AuthenticationError;
        },
        removeBook: async (parent, { bookId }) => {
            if (context.user){
                const book = User.findOneandDelete({
                    _id: bookId,
                    authors, description, title, image, link,
                });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: book._id } }
                );
                
                return book;
            }
            throw AuthenticationError;
        },
    },
};

module.exports = resolvers;
// End of JS file