import axiosInstance from './axios';

export const getAllPosts = () => axiosInstance.get('/posts').then(r => r.data);
export const getMyPosts = () => axiosInstance.get('/posts/mine').then(r => r.data);
export const createPost = (data) => axiosInstance.post('/posts', data).then(r => r.data);
export const likePost = (id) => axiosInstance.put(`/posts/${id}/like`).then(r => r.data);
export const deletePost = (id) => axiosInstance.delete(`/posts/${id}`).then(r => r.data);
export const getComments = (postId) => axiosInstance.get(`/posts/${postId}/comments`).then(r => r.data);
export const addComment = (postId, data) => axiosInstance.post(`/posts/${postId}/comments`, data).then(r => r.data);
