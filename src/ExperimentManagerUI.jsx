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
    const [useJsonConfig, setUseJsonConfig] = useState(false);
    const [formData, setFormData] = useState({
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

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

    const handleEncoderToggle = (encoder) => {
        setSelectedEncoders(prev =>
            prev.includes(encoder)
                ? prev.filter(e => e !== encoder)
                : [...prev, encoder]
        );
    };

    const handleRunExperiment = () => {
        console.log("Running Experiment with data:", formData, selectedEncoders, selectedVideoSources, selectedMetrics);
        // Call your createExperiment function here
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
