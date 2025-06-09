class ExperimentModel {

    const
    experimentConfigEntry = {
        "SequenceId": 1,
        "NetworkTopologyId": 0o01003,
        "networkDisruptionProfileId": 100,
        "EncodingParameters": {
            "Video": "Beauty",
            "Duration": "5s",
            "Frames_to_Encode": 100,
            "FPS": 30,
            "ResWidth": 1920,
            "ResHeight": 1080,
            "OutputFile": "ID_1_encoded.yuv",
            // Add other parameters as needed
        }
    };
    constructor(id, ownerId, createdAt, description, experimentName, status, set) {
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
            type: 'object',
            properties: {
                id: {type: 'string'},
                ownerId: {type: 'string'},
                createdAt: {type: 'string', format: 'date-time'},
                description: {type: 'string'},
                experimentName: {type: 'string'},
                status: {type: 'string'}, // Assuming status is a string
                set: {type: 'array', items: {type: 'string'}} // Assuming set is an array of strings
            },
            required: ['id', 'ownerId', 'createdAt', 'description', 'experimentName', 'status', 'set']
        };
    }


}

// Usage example
const modelSchema = new ExperimentModel().generateJSONSchema();
console.log(modelSchema);


