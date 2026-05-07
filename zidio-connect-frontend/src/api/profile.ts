import axiosInstance from './axios';

// The profile API functions automatically switch endpoint based on role 
// if we track the role, or we can just try student first.

export const updateProfile = async (role, profileData) => {
  const endpoint = role === 'Student' || role === 'STUDENT' ? '/student/profile' : '/recruiter/profile';
  const response = await axiosInstance.put(endpoint, profileData);
  return response.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  // Only students upload resumes in this system based on controllers
  const response = await axiosInstance.post('/student/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const uploadProfilePicture = async (role, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const endpoint = role === 'Student' || role === 'STUDENT' ? '/student/profile-picture' : '/recruiter/profile-picture';
  const response = await axiosInstance.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const uploadBackgroundPicture = async (role, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const endpoint = role === 'Student' || role === 'STUDENT' ? '/student/background-picture' : '/recruiter/background-picture';
  const response = await axiosInstance.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
