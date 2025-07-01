import React, { useState, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import ViewExperiments from './ViewExperiments';
import './ExperimentManagerUI.css';
import NetworkProfileSelector from "./NetworkProfileSelector";
import './backend_modules/services/ExperimentsService.js'
import {createExperimentCall,updateExperimentCall,deleteExperimentCall} from "./backend_modules/services/ExperimentsService";
import { fetchEncoders, fetchExperiments } from './api'; // Import your API functions

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
        delay: '',
        jitter: '',
        packetLoss: '',
        bandwidth: '',
        Video: "",
        Duration: "",
        Frames_to_Encode: '',
        ResWidth: '',
        ResHeight: '',
        OutputFile: '',
        Encoder: '',
        Bitrate: '',
        QP: '',
        Mode: '',
        NetworkCondition: '',
    });


    const [selectedEncoders, setSelectedEncoders] = useState([]);
    const [activeTab, setActiveTab] = useState('create');
    const [encoders, setEncoders] = useState([]);
    const [bitrates, setBitrates] = useState(['1000', '2000', '3000']); // Example bitrate options
    const [qps, setQps] = useState(['22', '23', '24']); // Example QP options
    const [modes, setModes] = useState(['CBR', 'VBR']); // Example mode options
    const [networkConditions, setNetworkConditions] = useState(['Good', 'Average', 'Poor']); // Example network conditions

    // Fetch encoders when the component mounts
    useEffect(() => {
        const loadEncoders = async () => {
            try {
                const encoderData = await fetchEncoders();
                setEncoders(encoderData);
            } catch (error) {
                console.error("Failed to fetch encoders:", error);
            }
        };
        loadEncoders();
    }, []);

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRunExperiment = () => {
        console.log("Run Experiment clicked", formData);
        // Call your function to create the experiment here
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
                                        <button onClick={() => console.log("Run Experiment", formData, selectedEncoders)}>Run Experiment</button>
                                        <button onClick={() => console.log("Save Config", formData)}>Save Config</button>
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
                        <div className="ui-form-section">
                            <h2>Create New Experiment</h2>
                            <div className="ui-form">
                                <label className="ui-label">
                                    Encoder
                                    <Select.Root
                                        value={formData.Encoder}
                                        onValueChange={(val) => handleFormChange('Encoder', val)}
                                    >
                                        <Select.Trigger className="ui-select">
                                            <Select.Value placeholder="Select Encoder" />
                                        </Select.Trigger>
                                        <Select.Portal>
                                            <Select.Content className="ui-dropdown">
                                                <Select.Viewport>
                                                    {encoders.map((encoder) => (
                                                        <Select.Item key={encoder.id} value={encoder.name} className="ui-option">
                                                            <Select.ItemText>{encoder.name}</Select.ItemText>
                                                        </Select.Item>
                                                    ))}
                                                </Select.Viewport>
                                            </Select.Content>
                                        </Select.Portal>
                                    </Select.Root>
                                </label>

                                <label className="ui-label">
                                    Bitrate
                                    <Select.Root
                                        value={formData.Bitrate}
                                        onValueChange={(val) => handleFormChange('Bitrate', val)}
                                    >
                                        <Select.Trigger className="ui-select">
                                            <Select.Value placeholder="Select Bitrate" />
                                        </Select.Trigger>
                                        <Select.Portal>
                                            <Select.Content className="ui-dropdown">
                                                <Select.Viewport>
                                                    {bitrates.map((bitrate) => (
                                                        <Select.Item key={bitrate} value={bitrate} className="ui-option">
                                                            <Select.ItemText>{bitrate}</Select.ItemText>
                                                        </Select.Item>
                                                    ))}
                                                </Select.Viewport>
                                            </Select.Content>
                                        </Select.Portal>
                                    </Select.Root>
                                </label>

                                <label className="ui-label">
                                    QP
                                    <Select.Root
                                        value={formData.QP}
                                        onValueChange={(val) => handleFormChange('QP', val)}
                                    >
                                        <Select.Trigger className="ui-select">
                                            <Select.Value placeholder="Select QP" />
                                        </Select.Trigger>
                                        <Select.Portal>
                                            <Select.Content className="ui-dropdown">
                                                <Select.Viewport>
                                                    {qps.map((qp) => (
                                                        <Select.Item key={qp} value={qp} className="ui-option">
                                                            <Select.ItemText>{qp}</Select.ItemText>
                                                        </Select.Item>
                                                    ))}
                                                </Select.Viewport>
                                            </Select.Content>
                                        </Select.Portal>
                                    </Select.Root>
                                </label>

                                <label className="ui-label">
                                    Mode
                                    <Select.Root
                                        value={formData.Mode}
                                        onValueChange={(val) => handleFormChange('Mode', val)}
                                    >
                                        <Select.Trigger className="ui-select">
                                            <Select.Value placeholder="Select Mode" />
                                        </Select.Trigger>
                                        <Select.Portal>
                                            <Select.Content className="ui-dropdown">
                                                <Select.Viewport>
                                                    {modes.map((mode) => (
                                                        <Select.Item key={mode} value={mode} className="ui-option">
                                                            <Select.ItemText>{mode}</Select.ItemText>
                                                        </Select.Item>
                                                    ))}
                                                </Select.Viewport>
                                            </Select.Content>
                                        </Select.Portal>
                                    </Select.Root>
                                </label>

                                        <NetworkProfileSelector
                                            selectedProfileId={formData.networkCondition}
                                            onChange={(profile) => {
                                                if (profile) {
                                                    handleFormChange('networkCondition', profile.id.toString());
                                                    handleFormChange('delay', profile.delay.toString());
                                                    handleFormChange('jitter', profile.jitter.toString());
                                                    handleFormChange('packetLoss', profile.packetLoss.toString());
                                                    handleFormChange('bandwidth', profile.bandwidth.toString());
                                                } else {
                                                    handleFormChange('networkCondition', '');
                                                    handleFormChange('delay', '');
                                                    handleFormChange('jitter', '');
                                                    handleFormChange('packetLoss', '');
                                                    handleFormChange('bandwidth', '');
                                                }
                                            }}
                                        />


                                    </div>
                                )}

                                <button className="ui-log-button">Error & Log Panel</button>
                                <label className="ui-label">
                                    Network Condition
                                    <Select.Root
                                        value={formData.NetworkCondition}
                                        onValueChange={(val) => handleFormChange('NetworkCondition', val)}
                                    >
                                        <Select.Trigger className="ui-select">
                                            <Select.Value placeholder="Select Network Condition" />
                                        </Select.Trigger>
                                        <Select.Portal>
                                            <Select.Content className="ui-dropdown">
                                                <Select.Viewport>
                                                    {networkConditions.map((condition) => (
                                                        <Select.Item key={condition} value={condition} className="ui-option">
                                                            <Select.ItemText>{condition}</Select.ItemText>
                                                        </Select.Item>
                                                    ))}
                                                </Select.Viewport>
                                            </Select.Content>
                                        </Select.Portal>
                                    </Select.Root>
                                </label>

                                <div className="ui-buttons">
                                    <button onClick={handleRunExperiment}>Run Experiment</button>
                                    <button onClick={() => setFormData({ Encoder: '', Bitrate: '', QP: '', Mode: '', NetworkCondition: '' })}>Reset Form</button>
                                </div>
                            </div>
                        </div>
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

