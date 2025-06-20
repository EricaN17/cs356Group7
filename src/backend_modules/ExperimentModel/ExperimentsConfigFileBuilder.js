// ExperimentConfigBuilder.js
import ExperimentConfig from './ExperimentsConfig.js';

class ExperimentConfigBuilder {
    constructor() {
        this.data = {
            SequenceId: null,
            NetworkTopologyId: null,
            networkDisruptionProfileId: null,
            EncodingParameters: {}
        };
    }

    setSequenceId(id) {
        this.data.SequenceId = id;
        return this;
    }

    setNetworkTopologyId(id) {
        this.data.NetworkTopologyId = id;
        return this;
    }

    setDisruptionProfileId(id) {
        this.data.networkDisruptionProfileId = id;
        return this;
    }

    setEncodingParam(key, value) {
        this.data.EncodingParameters[key] = value;
        return this;
    }

    setEncodingParams(params) {
        Object.assign(this.data.EncodingParameters, params);
        return this;
    }

    build() {
        return new ExperimentConfig(this.data);
    }
}

export default ExperimentConfigBuilder;


