import axiosInstance from './axios';

// Get all active jobs / search with filters
export const getAllJobs = async (params?: { keyword?: string; type?: string; location?: string; page?: number; size?: number }) => {
  const response = await axiosInstance.get('/student/jobs', { params });
  return response.data;
};

// For Recruiter to get their own posted jobs
export const getMyJobs = async () => {
  const response = await axiosInstance.get('/recruiter/jobs');
  return response.data;
};

// For Recruiter to post a job
export const createJob = async (jobData: any) => {
  const response = await axiosInstance.post('/recruiter/jobs', jobData);
  return response.data;
};

// For Student to apply to a job (with optional cover letter)
export const applyForJob = async (jobId: string | number, coverLetter?: string) => {
  const response = await axiosInstance.post(`/student/apply/${jobId}`, { coverLetter });
  return response.data;
};

// For Student to get their applications
export const getMyApplications = async () => {
  const response = await axiosInstance.get('/student/applications');
  return response.data;
};

// Get single job detail
export const getJobDetail = async (id: string | number) => {
  const response = await axiosInstance.get(`/student/jobs/${id}`);
  return response.data;
};

// Toggle save/unsave a job
export const toggleSaveJob = async (jobId: string | number) => {
  const response = await axiosInstance.post(`/student/jobs/${jobId}/save`);
  return response.data;
};

// Get saved jobs
export const getSavedJobs = async () => {
  const response = await axiosInstance.get('/student/jobs/saved');
  return response.data;
};

// Withdraw an application
export const withdrawApplication = async (applicationId: string | number) => {
  const response = await axiosInstance.put(`/student/applications/${applicationId}/withdraw`);
  return response.data;
};

// Get student dashboard stats
export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/student/dashboard');
  return response.data;
};
