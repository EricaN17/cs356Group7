import './ExperimentsConfig.js'
class ExperimentModel {
    videoSources;
    encodingParameters;
    networkConditions;
    metricsRequested;
    constructor(id, ownerId, createdAt, description, experimentName, status, set = []) {
        this.id = id;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.description = description;
        this.experimentName = experimentName;
        this.status = status;
        this.set = set;
    }

    generateJSONSchema() {
        return {
            type: "object",
            properties: {
                id: { type: "string" },
                ownerId: { type: "string" },
                createdAt: { type: "string", format: "date-time" },
                description: { type: "string" },
                experimentName: { type: "string" },
                status: { type: "string" },
                set: {
                    type: "array",
                    items: { type: "object" }
                }
            },
            required: ["id", "ownerId", "createdAt", "description", "experimentName", "status", "set"]
        };
    }

    toNewJSON() {
        return {
            ExperimentName: this.experimentName || "string",
            description: this.description || "string",
            sequences: this.set instanceof Set && this.set.size > 0
                ? [...this.set].map((sequence, index) => ({
                    NetworkTopologyId: sequence.networkTopologyId ?? 1,
                    NetworkDisruptionProfileId: sequence.networkDisruptionProfileId ?? 1,
                    EncodingParameters: sequence.EncodingParameters,
                    SequenceId: sequence.sequenceId ?? index + 1
                }))
                : [],
            id: this.id ?? 11,
            createdAt: this.createdAt || new Date().toISOString(),
            ownerId: this.ownerId ?? 1,
            status: this.status || "PENDING"
        };
    }

    getSet() {
        return this.set;
    }

    addToSet(entry) {
        this.set.add(entry)
    }
}
export default ExperimentModel;