import type { MatchSchema } from '../../schemas/entities/match.entity';
import type { PlayerSchema } from '../../schemas/entities/player.entity';
import type { PostSchema } from '../../schemas/entities/post.entity';
import type { TeamSchema } from '../../schemas/entities/team.entity';
import type { UserSchema } from '../../schemas/entities/user.entity';
import type { VenueSchema } from '../../schemas/entities/venue.entity';

export type FeedMatchResponse = MatchSchema & {
  creator: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'avatar' | 'username'>;
  venue: Pick<VenueSchema, 'id' | 'name' | 'latitude' | 'longitude'>;
  teams: (Pick<TeamSchema, 'id' | 'name'> & {
    players: Pick<PlayerSchema, 'id' | 'name' | 'assists' | 'goals' | 'isCaptain' | 'positions' | 'rating'> &
      {
        user: Pick<UserSchema, 'avatar' | 'firstName' | 'lastName' | 'username'>;
      }[];
  })[];
};
export type FeedPostResponse = PostSchema & {
  _count: { comments: number };
  likes: { userId: string }[];
  author: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'avatar' | 'username'>;
  attachements: unknown[];
};

export type PostsResponse = Omit<FeedPostResponse, 'author'> & {
  author: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'avatar' | 'username' | 'role'>;
};

export type GetFeedResponse = FeedMatchResponse | FeedPostResponse;

export function isMatch(item: GetFeedResponse): item is FeedMatchResponse {
  return 'creatorId' in item;
}

export function isPost(item: GetFeedResponse): item is FeedPostResponse {
  return 'authorId' in item;
}
