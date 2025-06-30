import React, { useEffect, useState } from 'react';
import { fetchExperiments } from './api';
import './ExperimentManagerUI.css';

const ViewExperiments = () => {
    const [experiments, setExperiments] = useState([]);

    useEffect(() => {
        const loadExperiments = async () => {
            try {
                const data = await fetchExperiments();
                setExperiments(data);
            } catch (error) {
                console.error("Failed to fetch experiments:", error);
            }
        };

        loadExperiments();
    }, []);

    return (
        <div className="experiments-container">
            <h2>Experiments</h2>
            <div className="experiments-grid">
                {experiments.map((experiment) => (
                    <div className="experiment-card" key={experiment.Id}>
                        <h3>{experiment.ExperimentName}</h3>
                        <p><strong>Description:</strong> {experiment.Description}</p>
                        <p><strong>Status:</strong> {experiment.status}</p>
                        <p><strong>Created At:</strong> {new Date(experiment.CreatedAt).toLocaleString()}</p>
                        <p><strong>Owner ID:</strong> {experiment.OwnerId}</p>
                        <h4>Sequences:</h4>
                        <ul>
                            {experiment.Sequences.map((sequence) => (
                                <li key={sequence.SequenceId}>
                                    <p><strong>Sequence ID:</strong> {sequence.SequenceId}</p>
                                    <p><strong>Network Topology ID:</strong> {sequence.NetworkTopologyId || 'N/A'}</p>
                                    <p><strong>Network Disruption Profile ID:</strong> {sequence.NetworkDisruptionProfileId}</p>
                                    <p><strong>Encoding Parameters:</strong> {JSON.stringify(sequence.EncodingParameters)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewExperiments;
