import React, { useState, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import ViewExperiments from './ViewExperiments';
import './ExperimentManagerUI.css';
import NetworkProfileSelector from "./NetworkProfileSelector";
import { fetchEncoders, fetchVideoSources } from './api';
import { AvatarIcon } from '@radix-ui/react-icons';
import {
    createExperimentCall,
    updateExperimentCall,
    deleteExperimentCall,
    modelBuilder,
    createExperimentSetConfig
} from "./backend_modules/services/ExperimentsService";
import ExperimentModel from "./backend_modules/ExperimentModel/ExperimentModel";

export default function ExperimentManagerUI() {
    const [useJsonConfig, setUseJsonConfig] = useState(false);
    const [formData, setFormData] = useState({
        experimentName: '',
        description: '',
        videoId: '',
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
            networkName: '',
            description: '',
            packetLoss: '',
            delay: '',
            jitter: '',
            bandwidth: '',
            network_profile_id: '',
        },
        metricsRequested: [],
        status: 'Pending'
    });

    const modelHeadBuilderCall = () => {
        return modelBuilder(formData)
    }
    const modelHead = modelHeadBuilderCall();

    const [selectedEncoders, setSelectedEncoders] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState(['PSNR']);
    const [activeTab, setActiveTab] = useState('create');
    const [selectedNetworkProfile, setSelectedNetworkProfile] = useState(null);



    const [encoders, setEncoders] = useState([]);
    const [videoOptions, setVideoOptions] = useState([]);

    const metricsOptions = ['PSNR', 'SSIM', 'VMAF', 'Bitrate', 'Latency'];
    const statusOptions = ['Pending', 'Running', 'Completed', 'Failed'];

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedEncoders = await fetchEncoders();
                setEncoders(fetchedEncoders);

                const fetchedVideoSources = await fetchVideoSources();
                setVideoOptions(fetchedVideoSources);

            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();
    }, []);

    // at the top of your component:
    const handleFormChange = (eOrField, maybeValue) => {
        if (typeof eOrField === 'string') {
            // Called with (field, value)
            const name = eOrField;
            const value = maybeValue;

            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                setFormData((prev) => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            const e = eOrField;
            const { name, value, type, checked } = e.target;
            const val = type === 'checkbox' ? checked : value;

            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                setFormData((prev) => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: val
                    }
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: val
                }));
            }
        }
    };


    const handleEncoderChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            encodingParameters: {
                ...prev.encodingParameters,
                [field]: value
            }
        }));
    };

    const handleMetricChange = (metric) => {
        setSelectedMetrics(prev =>
            prev.includes(metric)
                ? prev.filter(m => m !== metric)
                : [...prev, metric]
        );
    };

    const handleEncoderToggle = (encoder) => {
        setSelectedEncoders(prev =>
            prev.includes(encoder)
                ? prev.filter(e => e !== encoder)
                : [...prev, encoder]
        );
    };

    const handleRunExperiment = async () => {
        console.log("Running Experiment with data:", formData, selectedEncoders, selectedMetrics);
        const payload = new FormData();

        const selectedVideo = videoOptions.find(v => v.id.toString() === formData.videoId);

        if (!selectedVideo) {
            alert("Invalid video ID. Please enter a valid ID from the available videos.");
            return;
        }

        payload.append("selectedEncoders", JSON.stringify(selectedEncoders));

        payload.append("title", selectedVideo.title);
        payload.append("description", selectedVideo.description);
        payload.append("bitDepth", selectedVideo.BitDepth.toString());
        payload.append("path", selectedVideo.path);
        payload.append("format", selectedVideo.format);
        payload.append("frameRate", selectedVideo.frameRate.toString());
        payload.append("resolution", selectedVideo.resolution);
        payload.append("createdDate", selectedVideo.createdDate);
        payload.append("lastUpdatedBy", selectedVideo.lastUpdatedBy);

        const preparedFormData = {
            ...formData,
            videoSources: [selectedVideo],
        };

        for (const key in preparedFormData) {
            if (key !== "videoSources" && key !== "videoId") {
                if (typeof preparedFormData[key] === 'object') {
                    payload.append(key, JSON.stringify(preparedFormData[key]));
                } else {
                    payload.append(key, preparedFormData[key]);
                }
            }
        }

        for (const key in formData.networkConditions) {
            payload.append(`networkConditions.${key}`, formData.networkConditions[key]);
        }


        payload.append("videoSources", JSON.stringify(preparedFormData.videoSources));

        try {
            await createExperimentCall(formData,modelHead,payload);
            alert("Experiment created successfully!");
        } catch (error) {
            console.error("Experiment creation failed:", error);
            alert("Failed to create experiment.");
        }
    };

    const handleSaveConfig = () => {

        console.log("Save Config clicked", formData);
        createExperimentSetConfig(formData, modelHead,payload)
        console.log(modelHead.getSet())
    };

    const handleReset = () => {
        setUseJsonConfig(false);
        setFormData({
            experimentName: '',
            description: '',
            videoId: '',
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
                networkName: '',
                description: '',
                packetLoss: '',
                delay: '',
                jitter: '',
                bandwidth: '',
                network_profile_id: '',
            },
            metricsRequested: [],
            status: 'Pending'
        });
        setSelectedEncoders([]);
        setSelectedMetrics(['PSNR']);
    };

    return (
        <div className="ui-wrapper">
            <div className="ui-header">
                <h1>OneClick Experiments Manager</h1>
                <a href="https://ui.uni.kylestevenson.dev/user" className="user-button" title="User Profile">
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
                                <h2>Create New Experiment</h2>

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
                                            <div>
                                                <div className="ui-select-grid">
                                                    <label className="ui-label">
                                                        Video ID
                                                        <input
                                                            type="number"
                                                            value={formData.videoId || ''}
                                                            onChange={(e) => handleFormChange('videoId', e.target.value)}
                                                            placeholder={formData.videoId || ''}
                                                        />
                                                    </label>
                                                </div>

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
                                        <button type="button" onClick={handleSaveConfig}>Save Config</button>
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
                                            Encoder Comment
                                            <input
                                                type="text"
                                                value={formData.encodingParameters.comment}
                                                onChange={(e) => handleEncoderChange('comment', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Encoder Type
                                            <input
                                                type="text"
                                                value={formData.encodingParameters.encoderType}
                                                onChange={(e) => handleEncoderChange('encoderType', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Scalable
                                            <Checkbox.Root
                                                checked={formData.encodingParameters.scalable}
                                                onCheckedChange={(val) => handleEncoderChange('scalable', val)}
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
                                                onChange={(e) => handleEncoderChange('noOfLayers', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Path
                                            <input
                                                type="text"
                                                value={formData.encodingParameters.path}
                                                onChange={(e) => handleEncoderChange('path', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Filename
                                            <input
                                                type="text"
                                                value={formData.encodingParameters.filename}
                                                onChange={(e) => handleEncoderChange('filename', e.target.value)}
                                            />
                                        </label>

                                        <label className="ui-label">
                                            Mode File Required
                                            <Checkbox.Root
                                                checked={formData.encodingParameters.modeFileReq}
                                                onCheckedChange={(val) => handleEncoderChange('modeFileReq', val)}
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
                                                onCheckedChange={(val) => handleEncoderChange('seqFileReq', val)}
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
                                                onCheckedChange={(val) => handleEncoderChange('layersFileReq', val)}
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
                                    selectedProfileId={selectedNetworkProfile?.network_profile_id?.toString() ?? ''}
                                    onChange={(profile) => {
                                        setSelectedNetworkProfile(profile);
                                        if (profile) {
                                            handleFormChange('networkConditions.network_profile_id', profile.network_profile_id.toString());
                                            handleFormChange('networkConditions.networkName', profile.networkName);
                                            handleFormChange('networkConditions.description', profile.description);
                                            handleFormChange('networkConditions.packetLoss', profile.packetLoss.toString());
                                            handleFormChange('networkConditions.delay', profile.delay.toString());
                                            handleFormChange('networkConditions.jitter', profile.jitter.toString());
                                            handleFormChange('networkConditions.bandwidth', profile.bandwidth.toString());
                                        } else {
                                            handleFormChange('networkConditions.network_profile_id', '');
                                            handleFormChange('networkConditions.networkName', '');
                                            handleFormChange('networkConditions.description', '');
                                            handleFormChange('networkConditions.packetLoss', '');
                                            handleFormChange('networkConditions.delay', '');
                                            handleFormChange('networkConditions.jitter', '');
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
