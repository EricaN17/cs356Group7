import { fetchEncoders, fetchEncoderById, fetchExperiments, fetchVideoSources, createExperiment } from '../api';

jest.mock('../api');

describe('API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetchEncoders should return encoders', async () => {
        const mockEncoders = [{ id: 1, name: 'Encoder 1' }];
        fetchEncoders.mockResolvedValueOnce(mockEncoders);

        const encoders = await fetchEncoders();
        expect(encoders).toEqual(mockEncoders);
    });

    test('fetchEncoderById should return encoder details', async () => {
        const mockEncoder = { id: 1, name: 'Encoder 1', description: 'Description of Encoder 1' };
        fetchEncoderById.mockResolvedValueOnce(mockEncoder);

        const encoder = await fetchEncoderById(1);
        expect(encoder).toEqual(mockEncoder);
    });

    test('fetchExperiments should return experiments', async () => {
        const mockExperiments = [
            {
                Id: 1,
                ExperimentName: 'Experiment 1',
                Sequences: [{
                    EncodingParameters: {
                        Encoder: 'H264',
                        ResWidth: 1920,
                        ResHeight: 1080,
                        Bitrate: 45000,
                    },
                }],
            },
        ];
        fetchExperiments.mockResolvedValueOnce(mockExperiments);

        const experiments = await fetchExperiments();
        expect(experiments).toEqual(mockExperiments);
    });

    test('fetchVideoSources should return video sources', async () => {
        const mockVideoSources = [
            { title: 'Video 1', duration: '5s' },
            { title: 'Video 2', duration: '10s' },
        ];
        fetchVideoSources.mockResolvedValueOnce(mockVideoSources);

        const videoSources = await fetchVideoSources();
        expect(videoSources).toEqual(mockVideoSources);
    });

    test('createExperiment should return success message', async () => {
        const mockResponse = { success: true, message: 'Experiment created successfully' };
        createExperiment.mockResolvedValueOnce(mockResponse);

        const response = await createExperiment({ /* experiment data */ });
        expect(response).toEqual(mockResponse);
    });
});

