/**
 * User post.
 */
export interface Post {

  /**
   * The post ID.
   */
  id: string;

  /**
   * The user ID.
   */
  userId: string;

  /**
   * The user name.
   */
  userName: string;

  /**
   * The post message.
   */
  message: string;

  /**
   * The post type.
   */
  type: string;
  
  /**
   * The post created time.
   */
  createdTime: Date;
}
