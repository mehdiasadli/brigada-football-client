import { Api } from '../define-api';
import type { PollSchema } from '../../schemas/entities/poll.entity';
import type { PollOptionSchema } from '../../schemas/entities/poll-option.entity';

const api = Api.create('/polls');

// Extended poll type with options and voting data
export interface PollWithOptions extends PollSchema {
  options: (PollOptionSchema & {
    _count?: { votes: number };
    isVoted?: boolean;
  })[];
  totalVotes?: number;
  userVotes?: string[];
}

// Voting request type
export interface VotePollRequest {
  pollId: string;
  optionIds: string[];
}

// Voting response type
export interface VotePollResponse {
  success: boolean;
  message: string;
  poll: PollWithOptions;
}

export const pollsService = {
  // Get poll with options and voting data
  async getPollWithOptions(pollId: string) {
    return api.get<PollWithOptions>(`/${pollId}/with-options`);
  },

  // Vote on a poll
  async votePoll(data: VotePollRequest) {
    return api.post<VotePollResponse, { optionIds: string[] }>(`/${data.pollId}/vote`, {
      optionIds: data.optionIds,
    });
  },

  // Get poll results (for anonymous polls or after voting)
  async getPollResults(pollId: string) {
    return api.get<PollWithOptions>(`/${pollId}/results`);
  },
};
