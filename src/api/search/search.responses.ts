import type { PostSchema } from '../../schemas/entities/post.entity';
import type { UserSchema } from '../../schemas/entities/user.entity';
import type { VenueSchema } from '../../schemas/entities/venue.entity';

export type SearchPostResponse = Pick<PostSchema, 'id' | 'createdAt' | 'content'> & {
  author: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'avatar' | 'username'>;
};

export type SearchUserResponse = Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'avatar' | 'username'>;

export type SearchVenueResponse = Pick<VenueSchema, 'id' | 'name' | 'address'>;

export type SearchResponse =
  | {
      type: 'post';
      item: SearchPostResponse;
    }
  | {
      type: 'user';
      item: SearchUserResponse;
    }
  | {
      type: 'venue';
      item: SearchVenueResponse;
    };

export function isSearchUser(response: SearchResponse): response is {
  type: 'user';
  item: SearchUserResponse;
} {
  return response.type === 'user';
}

export function isSearchPost(response: SearchResponse): response is {
  type: 'post';
  item: SearchPostResponse;
} {
  return response.type === 'post';
}

export function isSearchVenue(response: SearchResponse): response is {
  type: 'venue';
  item: SearchVenueResponse;
} {
  return response.type === 'venue';
}
