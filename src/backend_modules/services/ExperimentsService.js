import ExperimentModel from '../ExperimentModel/ExperimentModel.js'
import ExperimentsConfigFileBuilder from "../ExperimentModel/ExperimentsConfigFileBuilder";

const builder = new ExperimentsConfigFileBuilder();
const {createExperiment, updateExperiment, deleteExperiment} = require("../ExpCRUDAxios");
const {rejectResponse} = require("./ServiceResponse");




export const modelBuilder = (experimentInput) => {

    return new ExperimentModel(
        experimentInput.id,
        experimentInput.ownerId,
        Date.now(),
        experimentInput.description,
        "Dummy8.0",
        "PENDING",
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
            FPS: experimentInput.temporalResolution,
            ResWidth: experimentInput.ResWidth,
            ResHeight: experimentInput.ResHeight,
            OutputFile: experimentInput.OutputFile,
            Bitrate: experimentInput.bitrate,
            YuvFormat: experimentInput.YuvFormat,
            EncoderMode : experimentInput.EncoderMode,
            Quality: experimentInput.Quality,
            BitDepth: experimentInput.bitDepth,
            IntraPeriod: experimentInput.IntraPeriod,
            BFrames: experimentInput.BFrames


        })
        .build();
}

export const createExperimentSetConfig = async (
    experimentInput,
    modelHead
) => {
    console.log(modelHead instanceof ExperimentModel);
    const entry =  experimentConfigBuilder(experimentInput);
    modelHead.addToSet(entry);
    console.log("Entry: ")
    console.log(entry.EncodingParameters);
};



export const createExperimentCall = async (experimentInput,modelHead) => {


    try {
        console.log("First layer of call");
        const experiment = modelHead
        if (experiment.getSet() == null) {
            const config = experimentConfigBuilder(experimentInput)
            experiment.addToSet(config)

            experiment.videoSources = [
                "Test input"
            ];

            experiment.encodingParameters = {
                codec: config.EncoderMode,
                bitrate: config.Bitrate,
                resolution: config.spatialResolution
            };

            experiment.networkConditions = {
                packetLoss: "2%",
                delay: "120ms"
            };

            experiment.metricsRequested = [
                "latency", "bitrate", "rebufferRatio"
            ];
        }
        return await createExperiment(experiment.toNewJSON());
    } catch (e) {
        throw rejectResponse(e.message || 'Invalid input', e.status || 405);
    }
};

export const deleteExperimentCall = async (experimentId) => {
    try {
        return await deleteExperiment(experimentId);
    } catch (e) {
        throw rejectResponse(e.message || 'Invalid input', e.status || 405);
    }
};
export const updateExperimentCall = async (experimentId,expModel,selectedEncoders) => {
    try {
        console.log("First layer of call",{experimentId});
        const experiment = modelBuilder(expModel, selectedEncoders);
        const config = experimentConfigBuilder(expModel)
        experiment.addToSet(config)
        // return await updateExperiment(experimentId,experiment.toJSON());
    } catch (e) {
        throw rejectResponse(e.message || 'Invalid input', e.status || 405);
    }
};
