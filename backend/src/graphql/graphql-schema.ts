import gql from 'graphql-tag';

/**
 * Define the GraphQL schema. To be used in GraphQL Options.
 */
export const GRAPHQ_SCHEMA = gql`
  type Query {
    # Get blog with page and user filters
    blog(filter: BlogFilter): Blog

    # Get the list of users WITHOUT stats data.
    # This gives similar result to query { blog { authors {...} }}, but works faster
    # thanks to avoiding unnecessary calculation.
    users: [User!]!
  }

  # Collection of posts and post authors
  type Blog {
    # Equivalent to posts.length. This is needed when only size is request, but the post items are not needed.
    size: Int!

    # The blog posts
    posts: [Post!]!

    # The list of post authors
    authors: [User!]!

    # The original post count BEFORE pagination.
    # This number is needed to calculate the page number.
    totalPostCount: Int!
  }

  # A single post
  type Post {

    # Post ID
    id: ID!

    # User ID
    userId: ID!

    # User full name
    userName: String!

    # Message content
    message: String!

    # Post type
    type: String!

    # Created time.
    createdTime: Date!
  }

  # A user and his statistics
  type User {
    # User ID
    userId: ID!

    # User name
    userName: String!

    # User statistics. Note that query { users {...}} doesn't return user stats.
    # To fetch full stats data, use query { blog { authors {...}}}.
    stats: UserStats
  }

  # User statistics
  type UserStats {

    # Total number of posts
    totalCount: Int!

    # Min length of posts
    minLength: Int!

    # Average length of posts
    averageLength: Float!

    # Max length of posts
    maxLength: Int!

    # Posting frequency by month
    frequencies: [Frequency!]!

    # Collection of longest posts
    longestPosts: [Post!]!
  }

  # Posting frequency by month
  type Frequency {
    # The first date of month
    month: Date!

    # The number of posts of user in the month
    count: Int!
  }

  # Blog filter, used for query { blog (filter: {...}){ })}
  input BlogFilter {

    # User filter, can be null
    userId: ID

    # Page filter, can be null
    page: PageFilter

    # Sorting by created time. Default is false.
    sortByCreatedTimeAsc: Boolean
  }

  # Page filter
  input PageFilter {
    # Zero-based page index
    index: Int!

    # Non-zero page size
    size: Int!
  }

  # The date time type. Serialized using Unix time stamp (number of seconds since 1.1.1970 UTC)  .
  scalar Date
`;
