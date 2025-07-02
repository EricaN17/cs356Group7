import React, { useState, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import ViewExperiments from './ViewExperiments';
import './ExperimentManagerUI.css';
import NetworkProfileSelector from "./NetworkProfileSelector";
import { fetchEncoders, fetchVideoSources, fetchNetworkConditions } from './api';
import { AvatarIcon } from '@radix-ui/react-icons';

export default function ExperimentManagerUI() {


    const [videoFile, setVideoFile] = useState(null);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith(".y4m")) {
            setVideoFile(file);
        } else {
            alert("Please upload a valid .y4m video file.");
        }
    };
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

    const handleReset = () => {
        setUseJsonConfig(false);
        setFormData({
            experimentName: '',
            description: '',
            videoSources: [],
            encodingParameters: {
                bitDepth: '',
                spatialResolution: '',
                temporalResolution: '',
                encoding: '',
                op1: '',
                op2: '',
                QP: '',
                mode: ''
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

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRunExperiment = async () => {
        console.log("Run Experiment clicked", formData, selectedEncoders);

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



    const handleSaveConfig = () => {
        console.log("Save Config clicked", formData);
        updateExperimentCall(formData.experimentId, formData,selectedEncoders);
    };

    const handleEncoderToggle = (encoder) => {
        setSelectedEncoders((prev) =>
            prev.includes(encoder)
                ? prev.filter((e) => e !== encoder)
                : [...prev, encoder]
        );
    };

    return (
        <div className="ui-wrapper">
            <div className="ui-header">
                <h1>OneClick Experiments Manager</h1>
                <a href="https://ui.uni.kylestevenson.dev/user" className="user-button" title="User   Profile">
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
                                                checked={selectedEncoders.includes(encoder.name)}
                                                onCheckedChange={() => handleEncoderToggle(encoder.name)}
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
                                            Quantization Parameter (QP)
                                            <Select.Root
                                                value={formData.encodingParameters.QP}
                                                onValueChange={(val) => handleFormChange('encodingParameters.QP', val)}
                                            >
                                                <Select.Trigger className="ui-select">
                                                    <Select.Value placeholder="Select QP" />
                                                </Select.Trigger>
                                                <Select.Content>
                                                    <Select.Viewport>
                                                        {['22', '27', '32', '37'].map(option => (
                                                            <Select.Item key={option} value={option} className="ui-option">
                                                                <Select.ItemText>{option}</Select.ItemText>
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Viewport>
                                                </Select.Content>
                                            </Select.Root>
                                        </label>

                                        <label className="ui-label">
                                            Encoder Mode
                                            <Select.Root
                                                value={formData.encodingParameters.mode}
                                                onValueChange={(val) => handleFormChange('encodingParameters.mode', val)}
                                            >
                                                <Select.Trigger className="ui-select">
                                                    <Select.Value placeholder="Select Mode" />
                                                </Select.Trigger>
                                                <Select.Content>
                                                    <Select.Viewport>
                                                        {['Intra Only', 'Low Delay', 'Random Access'].map(option => (
                                                            <Select.Item key={option} value={option} className="ui-option">
                                                                <Select.ItemText>{option}</Select.ItemText>
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Viewport>
                                                </Select.Content>
                                            </Select.Root>
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
