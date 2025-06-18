import { Api } from '../define-api';

const api = Api.create('/likes');

export const likesService = {
  likePost: (postId: string) => api.post(`/post/${postId}`),
  likeComment: (commentId: string) => api.post(`/comment/${commentId}`),
  getLikesOfPost: (postId: string) => api.get(`/post/${postId}`),
  getLikesOfComment: (commentId: string) => api.get(`/comment/${commentId}`),
};
