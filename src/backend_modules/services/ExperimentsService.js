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
        experimentInput.experimentName,
        experimentInput.status,
        new Set);
};

const experimentConfigBuilder = (experimentInput,videoData) =>{
    return builder
        .setSequenceId(0)
        .setNetworkTopologyId(experimentInput.NetworkTopologyId)
        .setDisruptionProfileId(experimentInput.networkDisruptionProfileId)
        .setEncodingParams({
            Video: videoData.title,
            Duration: experimentInput.Duration,
            Frames_to_Encode: experimentInput.Frames_to_Encode,
            FPS: videoData.framerate,
            ResWidth: experimentInput.ResWidth,
            ResHeight: experimentInput.ResHeight,
            OutputFile: experimentInput.OutputFile,
            Encoder: experimentInput.encodingParameters.name,
            EncoderType: experimentInput.encodingParameters.encoderType,
            Bitrate: experimentInput.Bitrate,
            YuvFormat: experimentInput.YuvFormat,
            EncoderMode : experimentInput.EncoderMode,
            Quality: experimentInput.Quality,
            BitDepth: videoData.BitDepth,
            IntraPeriod: experimentInput.IntraPeriod,
            BFrames: experimentInput.BFrames


        })
        .build();
}

export const createExperimentSetConfig = async (
    experimentInput,
    modelHead,
    videoData
) => {
    console.log(modelHead instanceof ExperimentModel);
    const entry =  experimentConfigBuilder(experimentInput,videoData);
    modelHead.addToSet(entry);
    console.log("Entry: ")
    console.log(entry.EncodingParameters);
};



export const createExperimentCall = async (experimentInput,modelHead,videoData) => {
    try {
        console.log("First layer of call");
        const experiment = modelHead
        if (experiment.getSet() == null) {
            const config = experimentConfigBuilder(experimentInput)
            experiment.addToSet(config)

            experiment.videoSources = config.videoSources

            experiment.encodingParameters = {
                codec: config.EncoderMode,
                bitrate: config.Bitrate,
                resolution: config.resolution
            };

            experiment.networkConditions = config.networkConditions

            experiment.metricsRequested = config.metricsRequested
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
        console.log("First layer of call");
        const modelHead = modelBuilder(experimentInput, selectedEncoders);
        return await updateExperiment({experimentId,experimentInput});
    } catch (e) {
        throw rejectResponse(e.message || 'Invalid input', e.status || 405);
    }
};
