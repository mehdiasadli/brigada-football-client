import { Api } from '../define-api';

const api = Api.create('/friendships');

export const friendshipsService = {
  sendFriendshipRequest: async (friendId: string) => {
    return await api.post(`/request/${friendId}`);
  },
  cancelFriendshipRequest: async (id: string) => {
    return await api.put(`/request/${id}/cancel`);
  },
  rejectFriendshipRequest: async (id: string) => {
    return await api.put(`/request/${id}/reject`);
  },
  acceptFriendshipRequest: async (id: string) => {
    return await api.put(`/request/${id}/accept`);
  },
};
