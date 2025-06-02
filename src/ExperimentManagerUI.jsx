import React, { useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import ViewExperiments  from './ViewExperiments';
import './ExperimentManagerUI.css';


export default function ExperimentManagerUI() {
    const [useJsonConfig, setUseJsonConfig] = useState(false);
    const [formData, setFormData] = useState({
        bitDepth: '',
        spatialResolution: '',
        temporalResolution: '',
        encoding: '',
        op1: '',
        op2: '',
    });
    const [selectedEncoders, setSelectedEncoders] = useState([]);
    const [activeTab, setActiveTab] = useState('create');

    const handleReset = () => {
        setUseJsonConfig(false);
        setFormData({
            bitDepth: '',
            spatialResolution: '',
            temporalResolution: '',
            encoding: '',
            op1: '',
            op2: '',
        });
        setSelectedEncoders([]);
    };

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRunExperiment = () => {
        console.log("Run Experiment clicked");
    };

    const handleSaveConfig = () => {
        console.log("Save Config clicked");
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
                                                                    <Select.Item value="Auto" className="ui-option">Auto</Select.Item>
                                                                    <Select.Item value="Automat" className="ui-option">Automat</Select.Item>
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
                                    {['AVC', 'SVC', 'SHVC', 'HEVC', 'New encoder to be added'].map((encoder) => (
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


{/*                <div className="ui-table-section">*/}
{/*                    <h2>Experiments Dashboard (Main Table View)</h2>*/}
{/*                    <table className="ui-table">*/}
{/*                        <thead>*/}
{/*                        <tr>*/}
{/*                            <th>ID</th>*/}
{/*                            <th>Name</th>*/}
{/*                            <th>Encoder Used</th>*/}
{/*                            <th>Duration</th>*/}
{/*                            <th>Status</th>*/}
{/*                            <th>Output Link</th>*/}
{/*                            <th>Log</th>*/}
{/*                        </tr>*/}
{/*                        </thead>*/}
{/*                        <tbody>*/}
{/*                        <tr>*/}
{/*                            <td colSpan={7}>No experiments yet</td>*/}
{/*                        </tr>*/}
{/*                        </tbody>*/}
{/*                    </table>*/}
{/*            /!*    </div>*!/*/}
{/*//             </div>*/}
{/*//         </div>*/}
{/*//     );*/}
{/*// }*/}
