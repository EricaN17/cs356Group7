import React, { useState, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import ViewExperiments from './ViewExperiments';
import './ExperimentManagerUI.css';
import { createExperimentCall, updateExperimentCall } from "./backend_modules/services/ExperimentsService";
import { fetchEncoders, fetchDropdownData } from './api'; // Import your API functions

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
    });

    const [selectedEncoders, setSelectedEncoders] = useState([]);
    const [activeTab, setActiveTab] = useState('create');

    // State for dropdown options
    const [dropdownOptions, setDropdownOptions] = useState({
        bitDepth: [],
        spatialResolution: [],
        temporalResolution: [],
        encoding: [],
        op1: [],
        op2: [],
        QP: [],
        mode: [],
        networkCondition: [],
    });

    // Fetch dropdown data and encoders when the component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                const encoderData = await fetchEncoders();
                // Assuming fetchDropdownData returns an object with dropdown options
                const dropdownData = await fetchDropdownData();

                setDropdownOptions({
                    bitDepth: dropdownData.bitDepth || [],
                    spatialResolution: dropdownData.spatialResolution || [],
                    temporalResolution: dropdownData.temporalResolution || [],
                    encoding: dropdownData.encoding || [],
                    op1: dropdownData.op1 || [],
                    op2: dropdownData.op2 || [],
                    QP: dropdownData.QP || [],
                    mode: dropdownData.mode || [],
                    networkCondition: dropdownData.networkCondition || [],
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        loadData();
    }, []);

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
        });
        setSelectedEncoders([]);
    };

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRunExperiment = () => {
        console.log("Run Experiment clicked", formData, selectedEncoders);
        createExperimentCall(formData, selectedEncoders);
    };

    const handleSaveConfig = () => {
        console.log("Save Config clicked", formData);
        updateExperimentCall(formData.experimentId, formData, selectedEncoders);
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
                                            {Object.keys(dropdownOptions).map((key) => (
                                                <label key={key} className="ui-label">
                                                    {key.charAt(0).toUpperCase() + key.slice(1)} {/* Capitalize the label */}
                                                    <Select.Root
                                                        value={formData[key]}
                                                        onValueChange={(val) => handleFormChange(key, val)}
                                                    >
                                                        <Select.Trigger className="ui-select">
                                                            <Select.Value placeholder="Select..." />
                                                        </Select.Trigger>
                                                        <Select.Portal>
                                                            <Select.Content className="ui-dropdown">
                                                                <Select.Viewport>
                                                                    {(dropdownOptions[key] || []).map((option) => (
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

                                {selectedEncoders.length > 0 && (
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
                                                        {dropdownOptions.QP.map((option) => (
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
                                                        {dropdownOptions.mode.map((option) => (
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
                                                        {dropdownOptions.networkCondition.map((option) => (
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



// import React, { useState, useEffect } from 'react';
// import * as Checkbox from '@radix-ui/react-checkbox';
// import * as Select from '@radix-ui/react-select';
// import { CheckIcon } from '@radix-ui/react-icons';
// import ViewExperiments from './ViewExperiments';
// import './ExperimentManagerUI.css';
// import { createExperimentCall, updateExperimentCall } from "./backend_modules/services/ExperimentsService";
// import { fetchEncoders, fetchDropdownData } from './api'; // Ensure these are correctly imported
//
// export default function ExperimentManagerUI() {
//     const [useJsonConfig, setUseJsonConfig] = useState(false);
//     const [formData, setFormData] = useState({
//         Encoder: '',
//         QP: '',
//         mode: '',
//         networkCondition: '',
//         // Other fields as needed...
//     });
//
//     const [selectedEncoders, setSelectedEncoders] = useState([]);
//     const [activeTab, setActiveTab] = useState('create');
//     const [encoders, setEncoders] = useState([]);
//     const [dropdownOptions, setDropdownOptions] = useState({
//         QP: [],
//         mode: [],
//         networkCondition: [],
//     });
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
//
//         const loadDropdownData = async () => {
//             try {
//                 const dropdownData = await fetchDropdownData();
//                 setDropdownOptions({
//                     QP: dropdownData.QP || [],
//                     mode: dropdownData.mode || [],
//                     networkCondition: dropdownData.networkCondition || [],
//                 });
//             } catch (error) {
//                 console.error("Failed to load dropdown data:", error);
//             }
//         };
//
//         loadEncoders();
//         loadDropdownData();
//     }, []);
//
//     const handleEncoderToggle = (encoder) => {
//         setSelectedEncoders((prev) =>
//             prev.includes(encoder)
//                 ? prev.filter((e) => e !== encoder)
//                 : [...prev, encoder]
//         );
//     };
//
//     const handleFormChange = (field, value) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };
//
//     const handleRunExperiment = () => {
//         console.log("Run Experiment clicked", formData, selectedEncoders);
//         createExperimentCall(formData, selectedEncoders);
//     };
//
//     const handleSaveConfig = () => {
//         console.log("Save Config clicked", formData);
//         updateExperimentCall(formData.experimentId, formData, selectedEncoders);
//     };
//
//     return (
//         <div className="ui-wrapper">
//             <div className="ui-header">OneClick Experiments Manager</div>
//             <div className="ui-container">
//                 <nav className="ui-nav">
//                     <span className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>
//                         Create New Experiment
//                     </span>
//                     <span className={activeTab === 'view' ? 'active' : ''} onClick={() => setActiveTab('view')}>
//                         View Experiments
//                     </span>
//                 </nav>
//
//                 <div className="ui-grid">
//                     {activeTab === 'create' && (
//                         <>
//                             <div className="ui-form-section">
//                                 <h2>Create New Experiment</h2>
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
//                                     <div className="ui-select-grid">
//                                         <label className="ui-label">
//                                             Select Encoder
//                                             <Select.Root
//                                                 value={formData.Encoder}
//                                                 onValueChange={(val) => {
//                                                     handleFormChange('Encoder', val);
//                                                     handleEncoderToggle(val); // Automatically select the encoder
//                                                 }}
//                                             >
//                                                 <Select.Trigger className="ui-select">
//                                                     <Select.Value placeholder="Select Encoder" />
//                                                 </Select.Trigger>
//                                                 <Select.Content>
//                                                     <Select.Viewport>
//                                                         {encoders.map((encoder) => (
//                                                             <Select.Item key={encoder.id} value={encoder.name} className="ui-option">
//                                                                 <Select.ItemText>{encoder.name}</Select.ItemText>
//                                                             </Select.Item>
//                                                         ))}
//                                                     </Select.Viewport>
//                                                 </Select.Content>
//                                             </Select.Root>
//                                         </label>
//                                     </div>
//
//                                     <div className="ui-buttons">
//                                         <button onClick={handleRunExperiment}>Run Experiment</button>
//                                         <button onClick={handleSaveConfig}>Save Config</button>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className="ui-encoder-section">
//                                 <h3>Encoder Selection</h3>
//                                 <div className="ui-toggle-group">
//                                     {selectedEncoders.map((encoder) => (
//                                         <label key={encoder} className="ui-checkbox">
//                                             <Checkbox.Root
//                                                 className="checkbox-box"
//                                                 checked={true} // Automatically checked
//                                             >
//                                                 <Checkbox.Indicator>
//                                                     <CheckIcon className="checkbox-check" />
//                                                 </Checkbox.Indicator>
//                                             </Checkbox.Root>
//                                             <span>{encoder}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//
//                                 {selectedEncoders.length > 0 && (
//                                     <div className="ui-select-grid">
//                                         <label className="ui-label">
//                                             Quantization Parameter (QP)
//                                             <Select.Root
//                                                 value={formData.QP}
//                                                 onValueChange={(val) => handleFormChange('QP', val)}
//                                             >
//                                                 <Select.Trigger className="ui-select">
//                                                     <Select.Value placeholder="Select QP" />
//                                                 </Select.Trigger>
//                                                 <Select.Content>
//                                                     <Select.Viewport>
//                                                         {dropdownOptions.QP.map((option) => (
//                                                             <Select.Item key={option} value={option} className="ui-option">
//                                                                 <Select.ItemText>{option}</Select.ItemText>
//                                                             </Select.Item>
//                                                         ))}
//                                                     </Select.Viewport>
//                                                 </Select.Content>
//                                             </Select.Root>
//                                         </label>
//
//                                         <label className="ui-label">
//                                             Encoder Mode
//                                             <Select.Root
//                                                 value={formData.mode}
//                                                 onValueChange={(val) => handleFormChange('mode', val)}
//                                             >
//                                                 <Select.Trigger className="ui-select">
//                                                     <Select.Value placeholder="Select Mode" />
//                                                 </Select.Trigger>
//                                                 <Select.Content>
//                                                     <Select.Viewport>
//                                                         {dropdownOptions.mode.map((option) => (
//                                                             <Select.Item key={option} value={option} className="ui-option">
//                                                                 <Select.ItemText>{option}</Select.ItemText>
//                                                             </Select.Item>
//                                                         ))}
//                                                     </Select.Viewport>
//                                                 </Select.Content>
//                                             </Select.Root>
//                                         </label>
//
//                                         <label className="ui-label">
//                                             Network Condition
//                                             <Select.Root
//                                                 value={formData.networkCondition}
//                                                 onValueChange={(val) => handleFormChange('networkCondition', val)}
//                                             >
//                                                 <Select.Trigger className="ui-select">
//                                                     <Select.Value placeholder="Select Network" />
//                                                 </Select.Trigger>
//                                                 <Select.Content>
//                                                     <Select.Viewport>
//                                                         {dropdownOptions.networkCondition.map((option) => (
//                                                             <Select.Item key={option} value={option} className="ui-option">
//                                                                 <Select.ItemText>{option}</Select.ItemText>
//                                                             </Select.Item>
//                                                         ))}
//                                                     </Select.Viewport>
//                                                 </Select.Content>
//                                             </Select.Root>
//                                         </label>
//                                     </div>
//                                 )}
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

