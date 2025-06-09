/* eslint-disable no-unused-vars */


const {createExperiment, updateExperiment, deleteExperiment} = require("../ExpCRUDAxios");
const {rejectResponse} = require("./ServiceResponse");



const createExperimentCall = ({ experimentInput }) => new Promise(


  async (resolve, reject) => {
    try {
        console.log("First layer of call")
      resolve(createExperiment({
        experimentInput,
      }));
    } catch (e) {
      reject(rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
const deleteExperimentCall = ({ experimentId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(deleteExperiment({
        experimentId,
      }));
    } catch (e) {
      reject(rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
const updateExperimentCall = ({ experimentId, experimentInput }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(updateExperiment({
        experimentId,
        experimentInput,
      }));
    } catch (e) {
      reject(rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  createExperimentCall,
  deleteExperimentCall,
  updateExperimentCall,
};
