import { Api } from '../define-api';

const api = Api.create('/likes');

export const likesService = {
  like: (postId: string) => api.post(`/${postId}`),
  getLikesOfPost: (postId: string) => api.get(`/post/${postId}`),
  getLikesOfComment: (commentId: string) => api.get(`/comment/${commentId}`),
};
