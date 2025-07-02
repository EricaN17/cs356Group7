import React, { useState, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import ViewExperiments from './ViewExperiments';
import './ExperimentManagerUI.css';
import NetworkProfileSelector from "./NetworkProfileSelector";
import { fetchEncoders, fetchVideoSources, fetchNetworkConditions, fetchEncoderById } from './api'; // Ensure this path is correct
import { AvatarIcon } from '@radix-ui/react-icons';

export default function ExperimentManagerUI() {
    const [videoFile, setVideoFile] = useState(null);
    const [useJsonConfig, setUseJsonConfig] = useState(false);
    const [formData, setFormData] = useState({
        experimentName: '',
        description: '',
        videoSources: [],
        encodingParameters: {
            id: null,
            name: '',
            comment: '',
            encoderType: '',
            scalable: false,
            noOfLayers: null,
            path: '',
            filename: '',
            modeFileReq: false,
            seqFileReq: false,
            layersFileReq: false,
        },
        networkConditions: {
            delay: '',
            jitter: '',
            packetLoss: '',
            bandwidth: ''
        },
        metricsRequested: [],
        status: 'Pending'
    });

    const [selectedEncoders, setSelectedEncoders] = useState([]);
    const [selectedVideoSources, setSelectedVideoSources] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState(['PSNR']);
    const [activeTab, setActiveTab] = useState('create');

    const [encoders, setEncoders] = useState([]);
    const [videoOptions, setVideoOptions] = useState([]);
    const [networkConditions, setNetworkConditions] = useState([]);

    const metricsOptions = ['PSNR', 'SSIM', 'VMAF', 'Bitrate', 'Latency'];
    const statusOptions = ['Pending', 'Running', 'Completed', 'Failed'];

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedEncoders = await fetchEncoders();
                setEncoders(fetchedEncoders);

                const fetchedVideoSources = await fetchVideoSources();
                setVideoOptions(fetchedVideoSources);

                const fetchedNetworkConditions = await fetchNetworkConditions();
                setNetworkConditions(fetchedNetworkConditions);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();
    }, []);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith(".y4m")) {
            setVideoFile(file);
        } else {
            alert("Please upload a valid .y4m video file.");
        }
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEncoderChange = async (encoderId) => {
        try {
            const encoder = await fetchEncoderById(encoderId);
            setFormData(prev => ({
                ...prev,
                encodingParameters: {
                    id: encoder.id,
                    name: encoder.name,
                    comment: encoder.description,
                    encoderType: encoder.encoderType,
                    scalable: encoder.scalable,
                    noOfLayers: encoder.maxLayers,
                    path: encoder.encoderCode,
                    filename: '',
                    modeFileReq: encoder.modeFileReq,
                    seqFileReq: encoder.seqFileReq,
                    layersFileReq: encoder.layersFileReq,
                }
            }));
        } catch (error) {
            console.error("Error fetching encoder details:", error);
            alert("Failed to fetch encoder details. Please try again.");
        }
    };

    const handleVideoSourceChange = (source) => {
        setSelectedVideoSources(prev =>
            prev.includes(source)
                ? prev.filter(s => s !== source)
                : [...prev, source]
        );
    };

    const handleMetricChange = (metric) => {
        setSelectedMetrics(prev =>
            prev.includes(metric)
                ? prev.filter(m => m !== metric)
                : [...prev, metric]
        );
    };

    const handleEncoderToggle = async (encoderId) => {
        setSelectedEncoders(prev =>
            prev.includes(encoderId)
                ? prev.filter(e => e !== encoderId)
                : [...prev, encoderId]
        );

        // Fetch encoder details when toggled
        await handleEncoderChange(encoderId);
    };

    const handleRunExperiment = async () => {
        console.log("Running Experiment with data:", formData, selectedEncoders, selectedVideoSources, selectedMetrics);
        const payload = new FormData();

        if (videoFile) {
            payload.append("Video", videoFile);
        }

        for (const key in formData) {
            if (key !== "Video") {
                payload.append(key, formData[key]);
            }
        }

        payload.append("selectedEncoders", JSON.stringify(selectedEncoders));

        try {
            await createExperimentCall(payload);
            alert("Experiment created successfully!");
        } catch (error) {
            console.error("Experiment creation failed:", error);
            alert("Failed to create experiment.");
        }
    };

    const handleReset = () => {
        setUseJsonConfig(false);
        setFormData({
            experimentName: '',
            description: '',
            videoSources: [],
            encodingParameters: {
                id: null,
                name: '',
                comment: '',
                encoderType: '',
                scalable: false,
                noOfLayers: null,
                path: '',
                filename: '',
                modeFileReq: false,
                seqFileReq: false,
                layersFileReq: false,
            },
            networkConditions: {
                delay: '',
                jitter: '',
                packetLoss: '',
                bandwidth: ''
            },
            metricsRequested: [],
            status: 'Pending'
        });
        setSelectedEncoders([]);
        setSelectedVideoSources([]);
        setSelectedMetrics(['PSNR']);
    };

    return (
        <div className="ui-wrapper">
            <div className="ui-header">
                <h1>OneClick Experiments Manager</h1>
                <a href="https://ui.uni.kylestevenson.dev/user" className="user-button" title="User  Profile">
                    <AvatarIcon width="20" height="20" />
                </a>
            </div>

            <div className="ui-container">
                <nav className="ui-nav">
                    <span className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>
                        Create New Experiment
                    </span>
                    <span className={activeTab === 'view' ? 'active' : ''} onClick={() => setActiveTab('view')}>
                        View Experiments
                    </span>
                </nav>

                <div className="ui-grid">
                    {activeTab === 'create' && (
                        <>
                            <div className="ui-form-section">
                                <h2>Create New Experiment (Main Form)</h2>

                                <div className="ui-upload-section">
                                    <label className="ui-upload-label">
                                        <span className="ui-upload-title">Upload Video (.y4m):</span>
                                        <input
                                            type="file"
                                            accept=".y4m"
                                            onChange={handleVideoChange}
                                            className="ui-upload-input"
                                        />
                                    </label>
                                </div>

                                <div className="ui-form">
                                    <label className="ui-checkbox">
                                        <Checkbox.Root
                                            className="checkbox-box"
                                            checked={useJsonConfig}
                                            onCheckedChange={(val) => setUseJsonConfig(!!val)}
                                        >
                                            <Checkbox.Indicator>
                                                <CheckIcon className="checkbox-check" />
                                            </Checkbox.Indicator>
                                        </Checkbox.Root>
                                        <span>Upload JSON Config</span>
                                    </label>

                                    {!useJsonConfig && (
                                        <>
                                            <div className="ui-select-grid">
                                                <label className="ui-label">
                                                    Experiment Name*
                                                    <input
                                                        type="text"
                                                        value={formData.experimentName}
                                                        onChange={(e) => handleFormChange('experimentName', e.target.value)}
                                                        required
                                                    />
                                                </label>
                                            </div>

                                            <div className="ui-select-grid">
                                                <label className="ui-label">
                                                    Description
                                                    <textarea
                                                        value={formData.description}
                                                        onChange={(e) => handleFormChange('description', e.target.value)}
                                                    />
                                                </label>
                                            </div>

                                            <div className="ui-select-grid">
                                                <label className="ui-label">
                                                    Status
                                                    <Select.Root
                                                        value={formData.status}
                                                        onValueChange={(val) => handleFormChange('status', val)}
                                                    >
                                                        <Select.Trigger className="ui-select">
                                                            <Select.Value />
                                                        </Select.Trigger>
                                                        <Select.Portal>
                                                            <Select.Content className="ui-dropdown">
                                                                <Select.Viewport>
                                                                    {statusOptions.map(option => (
                                                                        <Select.Item key={option} value={option} className="ui-option">
                                                                            <Select.ItemText>{option}</Select.ItemText>
                                                                        </Select.Item>
                                                                    ))}
                                                                </Select.Viewport>
                                                            </Select.Content>
                                                        </Select.Portal>
                                                    </Select.Root>
                                                </label>
                                            </div>

                                            <div className="ui-select-grid">
                                                <label className="ui-label">
                                                    Video Sources
                                                    <div className="video-sources-group">
                                                        {videoOptions.map(source => (
                                                            <label key={source} className="ui-checkbox">
                                                                <Checkbox.Root
                                                                    className="checkbox-box"
                                                                    checked={selectedVideoSources.includes(source)}
                                                                    onCheckedChange={() => handleVideoSourceChange(source)}
                                                                >
                                                                    <Checkbox.Indicator>
                                                                        <CheckIcon className="checkbox-check" />
                                                                    </Checkbox.Indicator>
                                                                </Checkbox.Root>
                                                                <span>{source}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="ui-select-grid">
                                                <label className="ui-label">
                                                    Metrics
                                                    <div className="metrics-group">
                                                        {metricsOptions.map(metric => (
                                                            <label key={metric} className="ui-checkbox">
                                                                <Checkbox.Root
                                                                    className="checkbox-box"
                                                                    checked={selectedMetrics.includes(metric)}
                                                                    onCheckedChange={() => handleMetricChange(metric)}
                                                                >
                                                                    <Checkbox.Indicator>
                                                                        <CheckIcon className="checkbox-check" />
                                                                    </Checkbox.Indicator>
                                                                </Checkbox.Root>
                                                                <span>{metric}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </label>
                                            </div>
                                        </>
                                    )}

                                    <div className="ui-buttons">
                                        <button type="button" onClick={handleRunExperiment}>Run Experiment</button>
                                        <button type="button" onClick={handleReset}>Reset Form</button>
                                    </div>
                                </div>
                            </div>

                            <div className="ui-encoder-section">
                                <h3>Encoder Selection</h3>
                                <div className="ui-toggle-group">
                                    {encoders.map(encoder => (
                                        <label key={encoder.id} className="ui-checkbox">
                                            <Checkbox.Root
                                                className="checkbox-box"
                                                checked={selectedEncoders.includes(encoder.id)}
                                                onCheckedChange={() => handleEncoderToggle(encoder.id)}
                                            >
                                                <Checkbox.Indicator>
                                                    <CheckIcon className="checkbox-check" />
                                                </Checkbox.Indicator>
                                            </Checkbox.Root>
                                            <span>{encoder.name}</span>
                                        </label>
                                    ))}
                                </div>

                                {selectedEncoders.length > 0 && (
                                    <div className="ui-select-grid">
                                        <label className="ui-label">
                                            Encoder Comment
                                            <input
                                                type="text"
                                                value={formData.encodingParameters.comment}
                                                onChange={(e) => handleFormChange('encodingParameters.comment', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Encoder Type
                                            <input
                                                type="text"
                                                value={formData.encodingParameters.encoderType}
                                                onChange={(e) => handleFormChange('encodingParameters.encoderType', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Scalable
                                            <Checkbox.Root
                                                checked={formData.encodingParameters.scalable}
                                                onCheckedChange={(val) => handleFormChange('encodingParameters.scalable', val)}
                                            >
                                                <Checkbox.Indicator>
                                                    <CheckIcon className="checkbox-check" />
                                                </Checkbox.Indicator>
                                            </Checkbox.Root>
                                        </label>

                                        <label className="ui-label">
                                            Number of Layers
                                            <input
                                                type="number"
                                                value={formData.encodingParameters.noOfLayers || ''}
                                                onChange={(e) => handleFormChange('encodingParameters.noOfLayers', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Path
                                            <input
                                                type="text"
                                                value={formData.encodingParameters.path}
                                                onChange={(e) => handleFormChange('encodingParameters.path', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Filename
                                            <input
                                                type="text"
                                                value={formData.encodingParameters.filename}
                                                onChange={(e) => handleFormChange('encodingParameters.filename', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Mode File Required
                                            <Checkbox.Root
                                                checked={formData.encodingParameters.modeFileReq}
                                                onCheckedChange={(val) => handleFormChange('encodingParameters.modeFileReq', val)}
                                            >
                                                <Checkbox.Indicator>
                                                    <CheckIcon className="checkbox-check" />
                                                </Checkbox.Indicator>
                                            </Checkbox.Root>
                                        </label>

                                        <label className="ui-label">
                                            Sequence File Required
                                            <Checkbox.Root
                                                checked={formData.encodingParameters.seqFileReq}
                                                onCheckedChange={(val) => handleFormChange('encodingParameters.seqFileReq', val)}
                                            >
                                                <Checkbox.Indicator>
                                                    <CheckIcon className="checkbox-check" />
                                                </Checkbox.Indicator>
                                            </Checkbox.Root>
                                        </label>

                                        <label className="ui-label">
                                            Layers File Required
                                            <Checkbox.Root
                                                checked={formData.encodingParameters.layersFileReq}
                                                onCheckedChange={(val) => handleFormChange('encodingParameters.layersFileReq', val)}
                                            >
                                                <Checkbox.Indicator>
                                                    <CheckIcon className="checkbox-check" />
                                                </Checkbox.Indicator>
                                            </Checkbox.Root>
                                        </label>
                                    </div>
                                )}

                                <h3>Network Conditions</h3>
                                <NetworkProfileSelector
                                    selectedProfileId={formData.networkConditions.networkCondition}
                                    onChange={(profile) => {
                                        if (profile) {
                                            handleFormChange('networkConditions.networkCondition', profile.id.toString());
                                            handleFormChange('networkConditions.delay', profile.delay.toString());
                                            handleFormChange('networkConditions.jitter', profile.jitter.toString());
                                            handleFormChange('networkConditions.packetLoss', profile.packetLoss.toString());
                                            handleFormChange('networkConditions.bandwidth', profile.bandwidth.toString());
                                        } else {
                                            handleFormChange('networkConditions.networkCondition', '');
                                            handleFormChange('networkConditions.delay', '');
                                            handleFormChange('networkConditions.jitter', '');
                                            handleFormChange('networkConditions.packetLoss', '');
                                            handleFormChange('networkConditions.bandwidth', '');
                                        }
                                    }}
                                />
                            </div>
                        </>
                    )}
                    {activeTab === 'view' && <ViewExperiments />}
                </div>
            </div>
        </div>
    );
}
