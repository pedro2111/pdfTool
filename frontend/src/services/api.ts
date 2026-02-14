import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = {
    convertImage: async (file: File) => {
        const formData = new FormData();
        formData.append('files', file);
        return axios.post(`${API_URL}/convert-images`, formData, {
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    convertImages: async (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return axios.post(`${API_URL}/convert-images`, formData, {
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    mergePdfs: async (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return axios.post(`${API_URL}/merge-pdfs`, formData, {
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    convertAndMerge: async (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return axios.post(`${API_URL}/convert-and-merge`, formData, {
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
