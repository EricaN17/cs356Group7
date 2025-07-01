import React, { useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import ViewExperiments from './ViewExperiments';
import './ExperimentManagerUI.css';
import NetworkProfileSelector from "./NetworkProfileSelector";
import { createExperimentCall, updateExperimentCall } from "./backend_modules/services/ExperimentsService";

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

    const videoOptions = ['video1.mp4', 'video2.mp4', 'video3.mp4'];
    const metricsOptions = ['PSNR', 'SSIM', 'VMAF', 'Bitrate', 'Latency'];
    const statusOptions = ['Pending', 'Running', 'Completed', 'Failed'];
    const standardEncoderSelections = {
        QP: ['22', '27', '32', '37'],
        mode: ['Intra Only', 'Low Delay', 'Random Access']
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
        createExperimentCall(formData, selectedEncoders, selectedVideoSources, selectedMetrics);
    };

    const handleSaveConfig = () => {
        console.log("Saving Config with data:", formData);
        updateExperimentCall(formData.id, formData, selectedEncoders);
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

    return (
        <div className="ui-wrapper">
            <div className="ui-header">OneClick Experiments Manager</div>

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
                                        <button type="button" onClick={handleSaveConfig}>Save Config</button>
                                        <button type="button" onClick={handleReset}>Reset Form</button>
                                    </div>
                                </div>
                            </div>

                            <div className="ui-encoder-section">
                                <h3>Encoder Selection</h3>
                                <div className="ui-toggle-group">
                                    {['SVC', 'AVC', 'HEVC'].map((encoder) => (
                                        <label key={encoder} className="ui-checkbox">
                                            <Checkbox.Root
                                                className="checkbox-box"
                                                checked={selectedEncoders.includes(encoder)}
                                                onCheckedChange={() => handleEncoderToggle(encoder)}
                                            >
                                                <Checkbox.Indicator>
                                                    <CheckIcon className="checkbox-check" />
                                                </Checkbox.Indicator>
                                            </Checkbox.Root>
                                            <span>{encoder}</span>
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
                                                        {standardEncoderSelections.QP.map((option) => (
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
                                                        {standardEncoderSelections.mode.map((option) => (
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

// import React, { useState, useEffect } from 'react';
// import * as Checkbox from '@radix-ui/react-checkbox';
// import * as Select from '@radix-ui/react-select';
// import { CheckIcon } from '@radix-ui/react-icons';
// import ViewExperiments from './ViewExperiments';
// import './ExperimentManagerUI.css';
// import NetworkProfileSelector from "./NetworkProfileSelector";
// import './backend_modules/services/ExperimentsService.js'
// import {createExperimentCall,updateExperimentCall,deleteExperimentCall} from "./backend_modules/services/ExperimentsService";
// import { fetchEncoders, fetchExperiments } from './api';
//
// export default function ExperimentManagerUI() {
//     const [useJsonConfig, setUseJsonConfig] = useState(false);
//     const [formData, setFormData] = useState({
//         id: '',
//         OwnerId: '',
//         createdAt: '',
//         description: '',
//         experimentName: '',
//         status: '',
//         bitDepth: '',
//         spatialResolution: '',
//         temporalResolution: '',
//         encoding: '',
//         op1: '',
//         op2: '',
//         QP: '',
//         mode: '',
//         networkCondition: '',
//         delay: '',
//         jitter: '',
//         packetLoss: '',
//         bandwidth: '',
//         Video: "",
//         Duration: "",
//         Frames_to_Encode: '',
//         ResWidth: '',
//         ResHeight: '',
//         OutputFile: '',
//         Encoder: '',
//         Bitrate: '',
//         QP: '',
//         Mode: '',
//         NetworkCondition: '',
//     });
//
//     const [selectedEncoders, setSelectedEncoders] = useState([]);
//     const [activeTab, setActiveTab] = useState('create');
//     const [encoders, setEncoders] = useState([]);
//     const [bitrates, setBitrates] = useState(['1000', '2000', '3000']);
//     const [qps, setQps] = useState(['22', '23', '24']);
//     const [modes, setModes] = useState(['CBR', 'VBR']);
//     const [networkConditions, setNetworkConditions] = useState(['Good', 'Average', 'Poor']);
//
//     useEffect(() => {
//         const loadEncoders = async () => {
//             try {
//                 const encoderData = await fetchEncoders();
//                 setEncoders(encoderData);
//             } catch (error) {
//                 console.error("Failed to fetch encoders:", error);
//             }
//         };
//         loadEncoders();
//     }, []);
//
//     const handleFormChange = (field, value) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };
//
//     const handleEncoderToggle = (encoder) => {
//         setSelectedEncoders(prev =>
//             prev.includes(encoder)
//                 ? prev.filter(e => e !== encoder)
//                 : [...prev, encoder]
//         );
//     };
//
//     const handleReset = () => {
//         setFormData({
//             id: '',
//             OwnerId: '',
//             createdAt: '',
//             description: '',
//             experimentName: '',
//             status: '',
//             bitDepth: '',
//             spatialResolution: '',
//             temporalResolution: '',
//             encoding: '',
//             op1: '',
//             op2: '',
//             QP: '',
//             mode: '',
//             networkCondition: '',
//             delay: '',
//             jitter: '',
//             packetLoss: '',
//             bandwidth: '',
//             Video: "",
//             Duration: "",
//             Frames_to_Encode: '',
//             ResWidth: '',
//             ResHeight: '',
//             OutputFile: '',
//             Encoder: '',
//             Bitrate: '',
//             QP: '',
//             Mode: '',
//             NetworkCondition: '',
//         });
//         setSelectedEncoders([]);
//     };
//
//     const handleRunExperiment = () => {
//         console.log("Run Experiment clicked", formData);
//     };
//
//     const selectOptions = ['Encoder', 'Bitrate', 'QP', 'Mode', 'NetworkCondition'];
//     const selectLabels = ['Encoder', 'Bitrate (kbps)', 'QP', 'Encoding Mode', 'Network Condition'];
//     const selectDropdownValues = {
//         Encoder: encoders.map(e => e.name),
//         Bitrate: bitrates,
//         QP: qps,
//         Mode: modes,
//         NetworkCondition: networkConditions
//     };
//
//     return (
//         <div className="ui-wrapper">
//             <div className="ui-header">OneClick Experiments Manager</div>
//             <div className="ui-container">
//                 <nav className="ui-nav">
//                     <span
//                         className={activeTab === 'create' ? 'active' : ''}
//                         onClick={() => setActiveTab('create')}
//                     >
//                         Create New Experiment
//                     </span>
//                     <span
//                         className={activeTab === 'view' ? 'active' : ''}
//                         onClick={() => setActiveTab('view')}
//                     >
//                         View Experiments
//                     </span>
//                 </nav>
//
//                 <div className="ui-grid">
//                     {activeTab === 'create' && (
//                         <>
//                             <div className="ui-form-section">
//                                 <h2>Create New Experiment (Main Form)</h2>
//                                 <div className="ui-form">
//                                     <label className="ui-checkbox">
//                                         <Checkbox.Root
//                                             className="checkbox-box"
//                                             checked={useJsonConfig}
//                                             onCheckedChange={(val) => setUseJsonConfig(!!val)}
//                                         >
//                                             <Checkbox.Indicator>
//                                                 <CheckIcon className="checkbox-check" />
//                                             </Checkbox.Indicator>
//                                         </Checkbox.Root>
//                                         <span>Upload JSON Config</span>
//                                     </label>
//
//                                     {!useJsonConfig && (
//                                         <div className="ui-select-grid">
//                                             {selectOptions.map((field, idx) => (
//                                                 <label key={field} className="ui-label">
//                                                     {selectLabels[idx]}
//                                                     <Select.Root
//                                                         value={formData[field]}
//                                                         onValueChange={(val) => handleFormChange(field, val)}
//                                                     >
//                                                         <Select.Trigger className="ui-select">
//                                                             <Select.Value placeholder="Select..." />
//                                                         </Select.Trigger>
//                                                         <Select.Portal>
//                                                             <Select.Content className="ui-dropdown">
//                                                                 <Select.Viewport>
//                                                                     {(selectDropdownValues[field] || []).map((option) => (
//                                                                         <Select.Item key={option} value={option} className="ui-option">
//                                                                             <Select.ItemText>{option}</Select.ItemText>
//                                                                         </Select.Item>
//                                                                     ))}
//                                                                 </Select.Viewport>
//                                                             </Select.Content>
//                                                         </Select.Portal>
//                                                     </Select.Root>
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     )}
//
//                                     <div className="ui-buttons">
//                                         <button onClick={handleRunExperiment}>Run Experiment</button>
//                                         <button onClick={() => console.log("Save Config", formData)}>Save Config</button>
//                                         <button onClick={handleReset}>Reset Form</button>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className="ui-encoder-section">
//                                 <h3>Encoder Selection</h3>
//                                 <div className="ui-toggle-group">
//                                     {['SVC', 'AVC', 'HEVC'].map((encoder) => (
//                                         <label key={encoder} className="ui-checkbox">
//                                             <Checkbox.Root
//                                                 className="checkbox-box"
//                                                 checked={selectedEncoders.includes(encoder)}
//                                                 onCheckedChange={() => handleEncoderToggle(encoder)}
//                                             >
//                                                 <Checkbox.Indicator>
//                                                     <CheckIcon className="checkbox-check" />
//                                                 </Checkbox.Indicator>
//                                             </Checkbox.Root>
//                                             <span>{encoder}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                                 <NetworkProfileSelector
//                                     selectedProfileId={formData.networkCondition}
//                                     onChange={(profile) => {
//                                         if (profile) {
//                                             handleFormChange('networkCondition', profile.id.toString());
//                                             handleFormChange('delay', profile.delay.toString());
//                                             handleFormChange('jitter', profile.jitter.toString());
//                                             handleFormChange('packetLoss', profile.packetLoss.toString());
//                                             handleFormChange('bandwidth', profile.bandwidth.toString());
//                                         } else {
//                                             handleFormChange('networkCondition', '');
//                                             handleFormChange('delay', '');
//                                             handleFormChange('jitter', '');
//                                             handleFormChange('packetLoss', '');
//                                             handleFormChange('bandwidth', '');
//                                         }
//                                     }}
//                                 />
//                             </div>
//                         </>
//                     )}
//
//                     {activeTab === 'view' && <ViewExperiments />}
//                 </div>
//             </div>
//         </div>
//     );
// }

