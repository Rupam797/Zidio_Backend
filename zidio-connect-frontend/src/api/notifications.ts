import axiosInstance from './axios';

export const getMyNotifications = () =>
  axiosInstance.get('/notifications').then(r => r.data);

export const getUnreadCount = () =>
  axiosInstance.get('/notifications/unread-count').then(r => r.data.count);

export const markAllRead = () =>
  axiosInstance.put('/notifications/mark-read');
