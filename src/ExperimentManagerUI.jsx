import React, { useState, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import ViewExperiments from './ViewExperiments';
import './ExperimentManagerUI.css';
import NetworkProfileSelector from "./NetworkProfileSelector";
import { fetchEncoders, fetchVideoSources, fetchEncoderById } from './api';
import { AvatarIcon } from '@radix-ui/react-icons';
import {
    createExperimentCall,
    updateExperimentCall,
    deleteExperimentCall,
    modelBuilder,
    createExperimentSetConfig
} from "./backend_modules/services/ExperimentsService";
import ExperimentModel from "./backend_modules/ExperimentModel/ExperimentModel";
import { createExperiment } from './api';

export default function ExperimentManagerUI() {
    const [useJsonConfig, setUseJsonConfig] = useState(false);
    const [formData, setFormData] = useState({
        experimentName: '',
        description: '',
        videoTitle: '',
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
            packetLoss: 0,
            delay: 0,
            jitter: 0,
            bandwidth: 0,
            network_profile_id: 0,
        },
        metricsRequested: [],
        status: 'Pending'
    });

    const modelHeadBuilderCall = () => {
        return modelBuilder(formData);
    };
    const modelHead = modelHeadBuilderCall();

    const [selectedEncoders, setSelectedEncoders] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState(['PSNR']);
    const [activeTab, setActiveTab] = useState('create');
    const [selectedNetworkProfile, setSelectedNetworkProfile] = useState(null);

    const [encoders, setEncoders] = useState([]);
    const [videoOptions, setVideoOptions] = useState([]);

    const metricsOptions = ['PSNR', 'SSIM', 'VMAF', 'Bitrate', 'Latency'];
    const statusOptions = ['Pending'];

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

    const handleFormChange = (eOrField, maybeValue) => {
        if (typeof eOrField === 'string') {
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
        setSelectedEncoders([encoder]); // Allow only one encoder to be selected
    };

    const handleEncoderSelect = async (encoderId) => {
        try {
            const encoderDetails = await fetchEncoderById(encoderId);
            // Update your formData or state with the encoder details
            setFormData(prev => ({
                ...prev,
                encodingParameters: {
                    ...prev.encodingParameters,
                    id: encoderDetails.id,
                    name: encoderDetails.name,
                    comment: encoderDetails.description, // Assuming you want to use description as a comment
                    encoderType: encoderDetails.encoderType,
                    scalable: encoderDetails.scalable,
                    noOfLayers: encoderDetails.maxLayers,
                    modeFileReq: encoderDetails.modeFileReq, // Set based on API response
                    seqFileReq: encoderDetails.seqFileReq, // Set based on API response
                    layersFileReq: encoderDetails.layersFileReq, // Set based on API response
                }
            }));
        } catch (error) {
            console.error("Error fetching encoder details:", error);
            alert(`Failed to fetch encoder details: ${error.message}`);
        }
    };

    const handleRunExperiment = async () => {
        const selectedVideo = videoOptions.find(v => v.title === formData.videoTitle);

        if (!selectedVideo) {
            alert("Invalid video ID. Please enter a valid ID from the available videos.");
            return;
        }

        const payload = {
            ExperimentName: formData.experimentName,
            Description: formData.description,
            status: "PENDING",
            Sequences: [{
                NetworkTopologyId: 1, // Confirm if this should be dynamic
                NetworkDisruptionProfileId: parseInt(formData.networkConditions.network_profile_id) || 1,
                EncodingParameters: {
                    id: formData.encodingParameters.id,
                    name: formData.encodingParameters.name,
                    comment: formData.encodingParameters.comment,
                    encoderType: formData.encodingParameters.encoderType,
                    scalable: formData.encodingParameters.scalable,
                    noOfLayers: formData.encodingParameters.noOfLayers,
                    path: formData.encodingParameters.path,
                    filename: formData.encodingParameters.filename,
                    modeFileReq: formData.encodingParameters.modeFileReq,
                    seqFileReq: formData.encodingParameters.seqFileReq,
                    layersFileReq: formData.encodingParameters.layersFileReq,

                    Video: selectedVideo.title,                                 // from video
                    Duration: selectedVideo.duration || "5s",                   // use "5s" if not available
                    Frames_to_Encode: selectedVideo.framesToEncode || 100,      // use 100 if not available
                    FPS: selectedVideo.frameRate,                               // from video
                    ResWidth: selectedVideo.resolution ? parseInt(selectedVideo.resolution.split('x')[0]) : 1920,  // parsed from video resolution
                    ResHeight: selectedVideo.resolution ? parseInt(selectedVideo.resolution.split('x')[1]) : 1080, // parsed from video resolution
                    OutputFile: "ID_1_encoded.yuv",                             // static placeholder, replace dynamically later
                    Encoder: formData.encodingParameters.encoderType || "H264",        // from selected encoder
                    EncoderType: "Standard", // from encoding parameters
                    Bitrate: selectedVideo.bitrate || 45020,                    // use 45020 if not available
                    YuvFormat: selectedVideo.yuvFormat || "4:0:0",              // use "4:0:0" if not available
                    EncoderMode: formData.encodingParameters.encoderMode || "RANDOM ACCESS", // from encoding parameters or default
                    Quality: selectedVideo.quality || 27,                       // use 27 if not available
                    BitDepth: selectedVideo.bitDepth || 12,                     // use 12 if not available
                    Depth: selectedVideo.bitDepth ||12, // added in
                    IntraPeriod: selectedVideo.intraPeriod || 1,                // use 1 if not available
                    QPISlice: 24, // added in
                    QPBSlice: 24, // added in
                    QPPSlice: 24, // added in
                    BFrames: selectedVideo.bFrames || 2,                        // use 2 if not available
                },
                SequenceId: 14, // Confirm if this should be dynamic
                NetworkDisruptionProfile: {
                    networkName: formData.networkConditions.networkName,
                    description: formData.networkConditions.description,
                    packetLoss: parseFloat(formData.networkConditions.packetLoss),
                    delay: parseInt(formData.networkConditions.delay),
                    jitter: parseInt(formData.networkConditions.jitter),
                    bandwidth: parseInt(formData.networkConditions.bandwidth),
                    network_profile_id: parseInt(formData.networkConditions.network_profile_id) || 0,
                }
            }],
            Id: 0, // Replace dynamically if needed
            CreatedAt: new Date().toISOString(),
            OwnerId: 30, // Replace dynamically if needed
            metricsRequested: selectedMetrics,
            videoSources: [{
                title: selectedVideo.title,
                description: selectedVideo.description,
                bitDepth: selectedVideo.bitDepth,
                path: selectedVideo.path,
                format: selectedVideo.format,
                frameRate: selectedVideo.frameRate,
                resolution: selectedVideo.resolution,
                createdDate: selectedVideo.createdDate,
                lastUpdatedBy: selectedVideo.lastUpdatedBy
            }]
        };

        console.log(payload);
        try {
            const response = await createExperiment(payload);
            console.log("Experiment created successfully:", response);
            alert("Experiment created successfully!");
        } catch (error) {
            console.error("Experiment creation failed:", error);
            alert(`Failed to create experiment: ${error.message}`);
        }
    };

    const handleSaveConfig = () => {
        console.log("Save Config clicked", formData);
        createExperimentSetConfig(formData, modelHead, payload);
        console.log(modelHead.getSet());
    };

    const handleReset = () => {
        setUseJsonConfig(false);
        setFormData({
            experimentName: '',
            description: '',
            videoTitle: '',
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
                packetLoss: 0,
                delay: 0,
                jitter: 0,
                bandwidth: 0,
                network_profile_id: 0,
            },
            metricsRequested: [],
            status: 'Pending'
        });
        setSelectedEncoders([]);
        setSelectedMetrics(['PSNR']);
    };

    // Function to handle checkbox changes and log their values
    const handleCheckboxChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            encodingParameters: {
                ...prev.encodingParameters,
                [field]: value
            }
        }));
        console.log(`${field} is now ${value}`);
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

                                        <div className="ui-select-grid">
                                            <label className="ui-label">
                                                Video Title
                                                <input
                                                    type="text"
                                                    value={formData.videoTitle}
                                                    onChange={(e) => handleFormChange('videoTitle', e.target.value)}
                                                    placeholder="Enter video title"
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
                                    <label key={encoder.id} className="ui-radio">
                                        <input
                                            type="radio"
                                            name="encoder"
                                            value={encoder.name}
                                            checked={selectedEncoders.includes(encoder.name)}
                                            onChange={() => {
                                                handleEncoderToggle(encoder.name); // Allow only one encoder to be selected
                                                handleEncoderSelect(encoder.id); // Fetch encoder details when selected
                                            }}
                                        />
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
                                            onCheckedChange={(val) => handleCheckboxChange('modeFileReq', val)}
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
                                            onCheckedChange={(val) => handleCheckboxChange('seqFileReq', val)}
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
                                            handleFormChange('networkConditions.network_profile_id', parseInt(profile.network_profile_id));
                                            handleFormChange('networkConditions.networkName', profile.networkName);
                                            handleFormChange('networkConditions.description', profile.description);
                                            handleFormChange('networkConditions.packetLoss', parseFloat(profile.packetLoss));
                                            handleFormChange('networkConditions.delay', parseInt(profile.delay));
                                            handleFormChange('networkConditions.jitter', parseInt(profile.jitter));
                                            handleFormChange('networkConditions.bandwidth', parseInt(profile.bandwidth));
                                        } else {
                                            handleFormChange('networkConditions.network_profile_id', 0);
                                            handleFormChange('networkConditions.networkName', '');
                                            handleFormChange('networkConditions.description', '');
                                            handleFormChange('networkConditions.packetLoss', 0);
                                            handleFormChange('networkConditions.delay', 0);
                                            handleFormChange('networkConditions.jitter', 0);
                                            handleFormChange('networkConditions.bandwidth', 0);
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
