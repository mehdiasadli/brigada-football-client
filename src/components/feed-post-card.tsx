import type { FeedPostResponse } from '../api/feed/feed.responses';

interface FeedPostCard {
  post: FeedPostResponse;
}

export default function FeedPostCard({ post }: FeedPostCard) {
  return <div>{post.content}</div>;
}
