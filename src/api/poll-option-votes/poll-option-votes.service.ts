import type { PollOptionVoteSchema } from '../../schemas/entities/poll-option-vote.entity';
import type { PollOptionSchema } from '../../schemas/entities/poll-option.entity';
import { Api } from '../define-api';

const api = Api.create('/poll-option-votes');

export type VoteResponse = {
  votes: PollOptionVoteSchema[];
  options: (PollOptionSchema & {
    _count: {
      votes: number;
    };
    votes: {
      userId: string;
    }[];
  })[];
};

export const pollOptionVotesService = {
  create: async (optionIds: string[]) => await api.post<VoteResponse, { optionIds: string[] }>('/', { optionIds }),
};
