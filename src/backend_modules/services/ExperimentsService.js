/* eslint-disable no-unused-vars */


const {listExperiments,getExperiment,createExperiment, updateExperiment, deleteExperiment} = require("../ExpCRUDAxios");
const {rejectResponse} = require("./Service");

const listExperimentsCall = () => new Promise(
    async (resolve, reject) => {
        try {
          resolve(listExperiments());
        } catch (e) {
          reject(rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
    }
);
const getExperimentCall = ({ experimentId }) => new Promise(
    async (resolve, reject) => {
        try {
          resolve(getExperiment({
            experimentId,
          }));
        } catch (e) {
          reject(rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ))
        }
    }
);
const createExperimentCall = ({ experimentInput }) => new Promise(
  async (resolve, reject) => {
    try {
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
  listExperimentsCall,
  getExperimentCall,
  createExperimentCall,
  deleteExperimentCall,
  updateExperimentCall,
};
