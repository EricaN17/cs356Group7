import React, { useEffect, useState } from 'react';
import { fetchExperiments } from './api'; // Import your API function
import React, { useEffect, useState } from 'react';
import './ViewExperiments.css'; // ✅ make sure this CSS is imported

const ViewExperiments = () => {
    const [experiments, setExperiments] = useState([]);
    const [error, setError] = useState(null);

const ViewExperiments = () => {
    const [experiments, setExperiments] = useState([]);

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
        fetch('/data/experiments.json')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch experiments');
                return res.json();
            })
            .then((data) => setExperiments(data))
            .catch((err) => console.error('Error loading experiments:', err));
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="view-experiments">
            <h2>Previous Experiments</h2>
            {experiments.length === 0 ? (
                <p>No experiments found.</p>
            ) : (
                <table className="experiment-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Codec</th>
                        <th>Resolution</th>
                        <th>Bitrate</th>
                        <th>Network</th>
                        <th>Encoders</th>
                    </tr>
                    </thead>
                    <tbody>
                    {experiments.map((exp) => (
                        <tr key={exp.id}>
                            <td>{exp.name}</td>
                            <td>{exp.codec}</td>
                            <td>{exp.resolution}</td>
                            <td>{exp.bitrate}</td>
                            <td>{exp.networkProfile}</td>
                            <td>{exp.encoders.join(', ')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
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

export default ViewExperiments;
