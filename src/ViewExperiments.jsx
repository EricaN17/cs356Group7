import React, { useEffect, useState } from 'react';
import { fetchExperiments } from './api'; // Import your API function

const ViewExperiments = () => {
    const [experiments, setExperiments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadExperiments = async () => {
            try {
                const data = await fetchExperiments();
                setExperiments(data);
            } catch (error) {
                setError(error.message);
            }
        };
        loadExperiments();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Experiments</h2>
            <ul>
                {experiments.map((experiment) => (
                    <li key={experiment.Id}>
                        <h3>{experiment.ExperimentName}</h3>
                        <p>Description: {experiment.Description}</p>
                        <p>Status: {experiment.status}</p>
                        <p>Created At: {new Date(experiment.CreatedAt).toLocaleString()}</p>
                        <p>Owner ID: {experiment.OwnerId}</p>
                        <h4>Sequences:</h4>
                        <ul>
                            {experiment.Sequences.map((sequence) => (
                                <li key={sequence.SequenceId}>
                                    <p>Sequence ID: {sequence.SequenceId}</p>
                                    <p>Network Topology ID: {sequence.NetworkTopologyId?.networkName || 'N/A'}</p>
                                    <p>Network Disruption Profile ID: {sequence.NetworkDisruptionProfileId}</p>
                                    <p>Encoding Parameters: {JSON.stringify(sequence.EncodingParameters)}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewExperiments;

