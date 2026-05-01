import axiosInstance from './axios';

export const getAllPosts = (page = 0, size = 10) =>
  axiosInstance.get('/posts', { params: { page, size } }).then(r => r.data);

export const getMyPosts = () => axiosInstance.get('/posts/mine').then(r => r.data);

export const createPost = (data: any) => axiosInstance.post('/posts', data).then(r => r.data);

export const likePost = (id: string | number, type: string = 'LIKE') => axiosInstance.put(`/posts/${id}/like?type=${type}`).then(r => r.data);

export const deletePost = (id: string | number) => axiosInstance.delete(`/posts/${id}`).then(r => r.data);

export const getComments = (postId: string | number) => axiosInstance.get(`/posts/${postId}/comments`).then(r => r.data);

export const addComment = (postId: string | number, data: any) => axiosInstance.post(`/posts/${postId}/comments`, data).then(r => r.data);

export const uploadPostMedia = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/posts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};
