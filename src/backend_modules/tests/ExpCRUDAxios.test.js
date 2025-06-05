import axios from "axios";
import * as UserService from "../services/UabsService.js";
import {
    listExperiments,
    getExperiment,
    createExperiment,
    updateExperiment,
    deleteExperiment
} from "../ExpCRUDAxios.js";

// Mock axios.* so we can stub responses
jest.mock("axios");

describe("ExpCRUDAxios", () => {
    const API_BASE_URL = "http://localhost:8000/api/v1";
    let fakeConfig;

    beforeEach(() => {
        fakeConfig = {
            headers: {
                Authorization: "Bearer faketoken",
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("listExperiments() calls GET /experiments with auth header", async () => {
        const fakeResponse = { data: [{ id: "e1" }, { id: "e2" }] };

        jest.spyOn(UserService, "getAuthHeaderConfig").mockResolvedValue(fakeConfig);
        axios.get.mockResolvedValueOnce(fakeResponse);

        const result = await listExperiments();
        expect(result).toEqual(fakeResponse.data);

        expect(UserService.getAuthHeaderConfig).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(
            `${API_BASE_URL}/experiments`,
            fakeConfig
        );
    });

test("getExperiment({ experimentId }) calls GET /experiments/{experimentId}", async () => {
    const experimentId = "xyz123";
    const fakeExp = { id: experimentId, name: "TestExp" };
    axios.get.mockResolvedValueOnce({ data: fakeExp });

    const result = await getExperiment({ experimentId });
    expect(result).toEqual(fakeExp);

    expect(UserService.getAuthHeaderConfig).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/experiments/${experimentId}`,
        fakeConfig
    );
});

    test("createExperiment(input) calls POST /experiments with body & auth", async () => {
        const payload = { name: "NewExp", description: "..." };
        const fakeCreated = { id: "new1", ...payload };
        axios.post.mockResolvedValueOnce({ data: fakeCreated });

        const result = await createExperiment(payload);
        expect(result).toEqual(fakeCreated);

        expect(UserService.getAuthHeaderConfig).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(
            `${API_BASE_URL}/experiments`,
            payload,
            fakeConfig
        );
    });

    test("updateExperiment({ experimentId }, input) calls PUT /experiments/{experimentId}", async () => {
        const experimentId = "upd123";
        const payload = { name: "UpdatedName" };
        const data = { experimentId, ...payload }; // Combine experimentId and payload
        const fakeUpdated = { id: experimentId, ...payload };
        axios.put.mockResolvedValueOnce({ data: fakeUpdated });

        const result = await updateExperiment(data); // Pass combined data object
        expect(result).toEqual(fakeUpdated);

        expect(UserService.getAuthHeaderConfig).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(
            `${API_BASE_URL}/experiments/${experimentId}`,
            data, // Ensure data is passed in the axios.put call
            fakeConfig
        );
    });

    test("deleteExperiment(body) calls POST /delete/{id} with auth", async () => {
        const expId = "del123";
        const body = { experimentId: expId };
        const fakeRespData = { message: "Deleted" };
        axios.post.mockResolvedValueOnce({ data: fakeRespData });

        const result = await deleteExperiment(body);
        expect(result).toEqual(fakeRespData);

        expect(UserService.getAuthHeaderConfig).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(
            `${API_BASE_URL}/delete/${expId}`,
            null,
            fakeConfig
        );
    });


});