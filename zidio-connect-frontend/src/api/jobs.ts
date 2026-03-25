import axiosInstance from './axios';

// Get all active jobs for Student
export const getAllJobs = async () => {
  const response = await axiosInstance.get('/student/jobs');
  return response.data;
};

// For Recruiter to get their own posted jobs
export const getMyJobs = async () => {
  const response = await axiosInstance.get('/recruiter/jobs');
  return response.data;
};

// For Recruiter to post a job
export const createJob = async (jobData) => {
  const response = await axiosInstance.post('/recruiter/jobs', jobData);
  return response.data;
};

// For Student to apply to a job
export const applyForJob = async (jobId) => {
  // Backend endpoint is POST /api/student/apply/{jobId}
  const response = await axiosInstance.post(`/student/apply/${jobId}`);
  return response.data;
};

// For Student to get their applications
export const getMyApplications = async () => {
  const response = await axiosInstance.get('/student/applications');
  return response.data;
};
