import ExperimentModel from '../ExperimentModel/ExperimentModel.js'
import ExperimentsConfigFileBuilder from "../ExperimentModel/ExperimentsConfigFileBuilder";

const builder = new ExperimentsConfigFileBuilder();
const {createExperiment, updateExperiment, deleteExperiment} = require("../ExpCRUDAxios");
const {rejectResponse} = require("./ServiceResponse");




const modelBuilder = (experimentInput, selectedEncoders) => {
    return new ExperimentModel(
        experimentInput.id,
        experimentInput.ownerId,
        Date.now(),
        experimentInput.description,
        "Dummy",
        "New",
        new Set);
};

const experimentConfigBuilder = (experimentInput) =>{
    return builder
        .setSequenceId(0)
        .setNetworkTopologyId(experimentInput.NetworkTopologyId)
        .setDisruptionProfileId(experimentInput.networkDisruptionProfileId)
        .setEncodingParams({
            Video: experimentInput.video,
            Duration: experimentInput.Duration,
            FPS: experimentInput.FPS,
            ResWidth: experimentInput.ResWidth,
            ResHeight: experimentInput.ResHeight,
            OutputFile: experimentInput.OutputFile
        })
        .build();
}


export const createExperimentCall = async (experimentInput, selectedEncoders) => {

    try {
        console.log("First layer of call");
        const modelHead = modelBuilder(experimentInput, selectedEncoders);
        const config = experimentConfigBuilder(experimentInput)
        modelHead.addToSet(config)
        return await createExperiment({ modelHead });
    } catch (e) {
        throw rejectResponse(e.message || 'Invalid input', e.status || 405);
    }
};

export const deleteExperimentCall = ({ experimentId }) => new Promise(
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
export const updateExperimentCall = async (experimentId,experimentInput,selectedEncoders) => {
    try {
        console.log("First layer of call");
        const modelHead = modelBuilder(experimentInput, selectedEncoders);
        return await updateExperiment({experimentId,experimentInput});
    } catch (e) {
        throw rejectResponse(e.message || 'Invalid input', e.status || 405);
    }
};
