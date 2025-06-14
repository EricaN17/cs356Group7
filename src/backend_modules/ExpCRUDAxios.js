// Import Axios library
import axios from 'axios'
import expModel from './ExperimentModel/ExperimentModel.js'

// Base URL for your API
const API_BASE_URL = 'http://localhost:8000/api/v1/'

// Function to create a new experiment




export async function createExperiment(expModel){
    try {
        console.log(expModel.modelHead)
        const response = await axios.post(`${API_BASE_URL}/experiments`, expModel);
        return response.expModel;
    } catch (error) {
        console.error('Error creating experiment:', error);
    }
}

// Function to update a experiment by ID
export async function updateExperiment(data){
    const id = data.experimentId
    try {
        const response = await axios.put(`${API_BASE_URL}/experiments/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating record with ID ${id}:`, error);
    }
}

// Function to delete a experiment by ID
export async function deleteExperiment(body){
    try {
        const response = await axios.post(`${API_BASE_URL}/delete/${body.experimentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting record with ID ${id}:`, error);
    }
}
