import axiosInstance from './axios';

export const sendConnectionRequest = (receiverEmail) =>
  axiosInstance.post('/connections/request', { receiverEmail }).then(r => r.data);

export const acceptConnectionRequest = (id) =>
  axiosInstance.put(`/connections/${id}/accept`).then(r => r.data);

export const getPendingRequests = () =>
  axiosInstance.get('/connections/pending').then(r => r.data);

export const getMyConnections = () =>
  axiosInstance.get('/connections').then(r => r.data);
