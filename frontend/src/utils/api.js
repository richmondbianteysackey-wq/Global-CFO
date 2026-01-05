import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const api = {
  // Companies
  getCompanies: () => axios.get(`${API_URL}/companies`, getAuthHeaders()),
  getCompany: (id) => axios.get(`${API_URL}/companies/${id}`, getAuthHeaders()),
  createCompany: (data) => axios.post(`${API_URL}/companies`, data, getAuthHeaders()),
  updateCompany: (id, data) => axios.put(`${API_URL}/companies/${id}`, data, getAuthHeaders()),

  // Documents
  getDocuments: (companyId) =>
    axios.get(`${API_URL}/documents${companyId ? `?company_id=${companyId}` : ''}`, getAuthHeaders()),
  uploadDocument: (formData) =>
    axios.post(`${API_URL}/documents`, formData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    }),
  getDocument: (id) => axios.get(`${API_URL}/documents/${id}`, getAuthHeaders()),
  deleteDocument: (id) => axios.delete(`${API_URL}/documents/${id}`, getAuthHeaders()),

  // Transactions
  getTransactions: (companyId) =>
    axios.get(`${API_URL}/transactions${companyId ? `?company_id=${companyId}` : ''}`, getAuthHeaders()),
  createTransaction: (data) => axios.post(`${API_URL}/transactions`, data, getAuthHeaders()),
  updateTransaction: (id, data) => axios.put(`${API_URL}/transactions/${id}`, data, getAuthHeaders()),

  // Tasks
  getTasks: (companyId) =>
    axios.get(`${API_URL}/tasks${companyId ? `?company_id=${companyId}` : ''}`, getAuthHeaders()),
  createTask: (data) => axios.post(`${API_URL}/tasks`, data, getAuthHeaders()),

  // Messages
  getMessages: (companyId) => axios.get(`${API_URL}/messages?company_id=${companyId}`, getAuthHeaders()),
  sendMessage: (data) => axios.post(`${API_URL}/messages`, data, getAuthHeaders()),

  // Reports
  getDashboardStats: (companyId) =>
    axios.get(`${API_URL}/reports/dashboard?company_id=${companyId}`, getAuthHeaders()),

  // Audit Logs
  getAuditLogs: (companyId) =>
    axios.get(`${API_URL}/audit-logs${companyId ? `?company_id=${companyId}` : ''}`, getAuthHeaders()),

  // Marketing & Intake (public)
  submitContact: (data) => axios.post(`${API_URL}/marketing/contact`, data),
  subscribeNewsletter: (data) => axios.post(`${API_URL}/marketing/newsletter`, data),
  submitSmsLead: (data) => axios.post(`${API_URL}/marketing/sms`, data),
  submitIntake: (formData) =>
    axios.post(`${API_URL}/marketing/intake`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
