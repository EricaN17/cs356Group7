import React, { useState,useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import ViewExperiments from './ViewExperiments';
import './ExperimentManagerUI.css';
import './backend_modules/services/ExperimentsService.js'
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
        id: '',
        OwnerId: '',
        createdAt: '',
        description: '',
        experimentName: '',
        status: '',
        bitDepth: '',
        spatialResolution: '',
        temporalResolution: '',
        encoding: '',
        op1: '',
        op2: '',
        QP: '',
        mode: '',
        networkCondition: '',
        Video: '',
        Duration: '',
        Frames_to_Encode: '',
        ResWidth: '',
        ResHeight: '',
        OutputFile: '',
        Encoder: '',
        Bitrate: '',
        YuvFormat: '',
        EncoderMode: '',
        Quality: '',
        Depth: '',
        Gamut: '',
        QPISlice: '',
        QPPSlice: '',
        QPBSlice: '',
        IntraPeriod: '',
        BFrames: '',
        VideoSources: [],
        networkConditions: '',
        metricsRequested: ''
    });

    const modelHeadBuilderCall = () => {
        console.log("Model created");
        return modelBuilder(formData)

    }
    const modelHead = modelHeadBuilderCall();
    console.log(modelHead instanceof ExperimentModel);
    const [selectedEncoders, setSelectedEncoders] = useState([]);
    const [activeTab, setActiveTab] = useState('create');

    const handleReset = () => {
        setUseJsonConfig(false);
        setFormData({
            id: '',
            OwnerId: '',
            createdAt: '',
            description: '',
            experimentName: '',
            status: '',
            bitDepth: '',
            spatialResolution: '',
            temporalResolution: '',
            encoding: '',
            op1: '',
            op2: '',
            QP: '',
            mode: '',
            networkCondition: '',
            Video: "",
            Duration: "",
            Frames_to_Encode: '',
            ResWidth: '',
            ResHeight: '',
            OutputFile: '',
            Encoder: '',
            Bitrate: '',
            YuvFormat: '',
            EncoderMode: '',
            Quality: '',
            Depth: '',
            Gamut: '',
            QPISlice: '',
            QPPSlice: '',
            QPBSlice: '',
            IntraPeriod: '',
            BFrames: '',
            VideoSources: '',
            networkConditions: '',
            metricsRequested: ''
        });
        setSelectedEncoders([]);
    };

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRunExperiment = () => {
        console.log("Run Experiment clicked", formData, selectedEncoders);
        createExperimentCall(formData, modelHead)
        console.log(modelHead.toNewJSON())
        handleReset()
    };

    const handleDeleteExperiment = () => {
        console.log("Delete Experiment clicked", formData.id);
        deleteExperimentCall(formData.id)
    };

    const handleSaveConfig = () => {
        console.log("Save Config clicked", formData);
        createExperimentSetConfig(formData,modelHead)
        console.log(modelHead.getSet())
    };

    const handleEncoderToggle = (encoder) => {
        setSelectedEncoders((prev) =>
            prev.includes(encoder)
                ? prev.filter((e) => e !== encoder)
                : [...prev, encoder]
        );
    };

    const selectOptions = ["bitDepth", "spatialResolution", "temporalResolution", "encoding", "op1", "op2"];
    const selectLabels = [
        "Bit Depth (Input)",
        "Spatial Resolution (Input Field)",
        "Temporal Resolution",
        "Encoding",
        "OP (Slider)",
        "OP (Slider)"
    ];
    //dummy commit

    const selectDropdownValues = {
        bitDepth: ['8-bit', '10-bit', '12-bit'],
        spatialResolution: ['Auto', '720p', '1080p', '4K'],
        temporalResolution: ['24fps', '30fps', '60fps'],
        encoding: ['Auto', 'HEVC', 'AVC', 'VP9'],
        op1: ['Option 1A', 'Option 1B'],
        op2: ['Option 2A', 'Option 2B'],
    };

    const standardEncoderSelections = {
        QP: ['22', '27', '32', '37'],
        frameRate: ['24fps', '30fps', '60fps'],
        resolution: ['720p', '1080p', '4K'],
        mode: ['Intra Only', 'Low Delay', 'Random Access']
    };

    const isStandardEncoderSelected = selectedEncoders.some(enc => ['SVC', 'AVC', 'HEVC'].includes(enc));

    return (
        <div className="ui-wrapper">
            <div className="ui-header">OneClick Experiments Manager</div>

            <div className="ui-container">
                <nav className="ui-nav">
                    <span
                        className={activeTab === 'create' ? 'active' : ''}
                        onClick={() => setActiveTab('create')}
                    >
                        Create New Experiment
                    </span>
                    <span
                        className={activeTab === 'view' ? 'active' : ''}
                        onClick={() => setActiveTab('view')}
                    >
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
                                        <span>Upload JSON Config (Checkbox)</span>
                                    </label>

                                    {!useJsonConfig && (
                                        <div className="ui-select-grid">
                                            {selectOptions.map((field, idx) => (
                                                <label key={field} className="ui-label">
                                                    {selectLabels[idx]}
                                                    <Select.Root
                                                        value={formData[field]}
                                                        onValueChange={(val) => handleFormChange(field, val)}
                                                    >
                                                        <Select.Trigger className="ui-select">
                                                            <Select.Value placeholder="Select..." />
                                                        </Select.Trigger>
                                                        <Select.Portal>
                                                            <Select.Content className="ui-dropdown">
                                                                <Select.Viewport>
                                                                    {(selectDropdownValues[field] || []).map((option) => (
                                                                        <Select.Item key={option} value={option} className="ui-option">
                                                                            <Select.ItemText>{option}</Select.ItemText>
                                                                        </Select.Item>
                                                                    ))}
                                                                </Select.Viewport>
                                                            </Select.Content>
                                                        </Select.Portal>
                                                    </Select.Root>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    <div className="ui-buttons">
                                        <button onClick={handleRunExperiment}>Run Experiment</button>
                                        <button onClick={handleSaveConfig}>Save Config</button>
                                        <button onClick={handleReset}>Reset Form</button>
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

                                {isStandardEncoderSelected && (
                                    <div className="ui-select-grid">
                                        <label className="ui-label">
                                            Quantization Parameter (QP)
                                            <Select.Root
                                                value={formData.QP}
                                                onValueChange={(val) => handleFormChange('QP', val)}
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
                                                value={formData.mode}
                                                onValueChange={(val) => handleFormChange('mode', val)}
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

                                        <label className="ui-label">
                                            Network Condition
                                            <Select.Root
                                                value={formData.networkCondition}
                                                onValueChange={(val) => handleFormChange('networkCondition', val)}
                                            >
                                                <Select.Trigger className="ui-select">
                                                    <Select.Value placeholder="Select Network" />
                                                </Select.Trigger>
                                                <Select.Content>
                                                    <Select.Viewport>
                                                        <Select.Item value="Low Bandwidth" className="ui-option">
                                                            <Select.ItemText>Low Bandwidth (1 Mbps, 50ms)</Select.ItemText>
                                                        </Select.Item>
                                                    </Select.Viewport>
                                                </Select.Content>
                                            </Select.Root>
                                        </label>
                                    </div>
                                )}

                                <button className="ui-log-button">Error & Log Panel</button>
                            </div>
                        </>
                    )}

                    {activeTab === 'view' && <ViewExperiments />}
                </div>
            </div>
        </div>
    );
}