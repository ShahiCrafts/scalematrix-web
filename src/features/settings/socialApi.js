import { apiCall } from '../../shared/utils/api';

export const socialApi = {
  // 1. Get OAuth Initiation URL
  getAuthUrl: async (provider = 'meta', channel = 'instagram') => {
    return apiCall(`/social/oauth/url?provider=${provider}&channel=${channel}`);
  },

  // 2. Fetch Connected Social Accounts
  getConnectedAccounts: async () => {
    return apiCall('/social/accounts');
  },

  // 3. Disconnect Account
  disconnectAccount: async (accountId) => {
    return apiCall(`/social/accounts/${accountId}`, { method: 'DELETE' });
  },

  // 4. Publish or Schedule Post
  publishPost: async (postData) => {
    return apiCall('/social/publish', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // 5. Fetch Social Posts History
  getPosts: async (status = '', page = 1, limit = 20) => {
    return apiCall(`/social/posts?status=${status}&page=${page}&limit=${limit}`);
  },

  // 6. Fetch Account Insights & Analytics
  getAnalytics: async (accountId) => {
    return apiCall(`/social/analytics/${accountId}`);
  },

  // 7. Sync Live Analytics
  syncAnalytics: async (accountId) => {
    return apiCall(`/social/analytics/${accountId}/sync`, { method: 'POST' });
  },

  // 8. Fetch Unified Social Inbox
  getInbox: async (accountId) => {
    return apiCall(`/social/inbox/${accountId}`);
  },

  // 9. Reply to Inbox Item
  replyToInbox: async (itemId, message) => {
    return apiCall(`/social/inbox/items/${itemId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};
