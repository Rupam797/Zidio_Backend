import axiosInstance from './axios';

export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/admin/dashboard');
  return response.data;
};

export const getAllStudents = async () => {
  const response = await axiosInstance.get('/admin/students');
  return response.data;
};

export const getAllRecruiters = async () => {
  const response = await axiosInstance.get('/admin/recruiters');
  return response.data;
};

export const getAllJobs = async () => {
  const response = await axiosInstance.get('/admin/jobs');
  return response.data;
};

export const toggleUserBlock = async (id) => {
  const response = await axiosInstance.put(`/admin/user/${id}/block`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/admin/user/${id}`);
  return response.data;
};

export const toggleJobStatus = async (id) => {
  const response = await axiosInstance.put(`/admin/job/${id}/toggle`);
  return response.data;
};
