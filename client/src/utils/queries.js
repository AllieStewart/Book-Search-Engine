// Start of JS file
// Queries file for front-end, GraphQL calls.
import { gql } from '@apollo/client';

export const QUERY_GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                title
                authors
            }
        }
    }
`;
// End of JS file