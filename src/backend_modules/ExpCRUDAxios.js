// Import Axios library
import axios from 'axios'
import expModel from './ExperimentModel/ExperimentModel.js'
import { getAuthHeaderConfig } from "./services/UabsService.js";

// Base URL for your API
const API_BASE_URL = 'http://localhost:8000/api/v1'

async function _getConfig(multipart = false) {
    if (multipart) {
        // Only Authorization header; let axios set Content-Type for FormData.
        return await getAuthHeaderConfig({ json: false });
    } else {
        // Include JSON headers
        return await getAuthHeaderConfig({ json: true });
    }
}

// Function to list experiments
export async function listExperiments() {
    try {
        const config = await _getConfig();
        const response = await axios.get(`${API_BASE_URL}/experiments`, config);
        const experiments = response.data;
        const token = _readRawToken();
        const { role, sub: username } = _decodeJwtPayload(token);
        if (role !== 'superuser') {
            return experiments.filter(exp => exp.owner === username);
        }
        return experiments;
    } catch (error) {
        console.error('Error in listExperiments:', error);
        throw error;
    }
}

//Function to get experiment by id
export async function getExperiment({ experimentId }) {
    try {
        const config = await _getConfig();
        const response = await axios.get(`${API_BASE_URL}/experiments/${experimentId}`, config);
        const exp = response.data;
        // Ensure access
        const token = _readRawToken();
        const { role, sub: username } = _decodeJwtPayload(token);
        if (role !== 'superuser' && exp.owner !== username) {
            throw new Error('Access denied: insufficient permissions to view this experiment.');
        }
        return exp;
    } catch (error) {
        console.error(`Error in getExperiment(${experimentId}):`, error);
        throw error;
    }
}
// Function to create a new experiment
export async function createExperiment(data){
    try {
        const config = await _getConfig();
        const response = await axios.post(`${API_BASE_URL}/experiments`, data, config);
        return response.data;
    } catch (error) {
        console.error('Error creating experiment:', error);
    }
}

// Function to update a experiment by ID
export async function updateExperiment(data){
    const id = data.experimentId
    try {
        const config = await _getConfig();
        const response = await axios.put(`${API_BASE_URL}/experiments/${id}`, data, config);
        return response.data;
    } catch (error) {
        console.error(`Error updating record with ID ${id}:`, error);
    }
}

// Function to delete a experiment by ID
export async function deleteExperiment(body){
    try {
        const config = await _getConfig();
        const response = await axios.post(`${API_BASE_URL}/delete/${body.experimentId}`, null, config);
        return response.data;
    } catch (error) {
        console.error(`Error deleting record with ID ${id}:`, error);
    }
}
