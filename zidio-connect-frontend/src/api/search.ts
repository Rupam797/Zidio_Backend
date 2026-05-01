import axiosInstance from './axios';

export interface SearchResult {
  id: number;
  type: 'JOB' | 'STUDENT' | 'RECRUITER';
  title: string;
  subtitle: string;
  imageUrl: string | null;
  extra: string | null;
}

export const globalSearch = (query: string): Promise<SearchResult[]> =>
  axiosInstance.get('/search', { params: { q: query } }).then(r => r.data);
