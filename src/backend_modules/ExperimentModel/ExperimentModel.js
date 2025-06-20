import './ExperimentsConfig.js'
class ExperimentModel {
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

    getSet() {
        return this.set;
    }

    setSet(newSet) {
        if (!Array.isArray(newSet)) {
            throw new Error("set must be an array.");
        }
        this.set = newSet;
    }

    addToSet(entry) {
        this.set.add(entry)
    }
}
export default ExperimentModel;