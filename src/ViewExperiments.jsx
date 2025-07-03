import React, { useEffect, useState } from 'react';
import './ViewExperiments.css';
import {fetchExperiments} from "./api";

const ViewExperiments = () => {
    const [experiments, setExperiments] = useState([]);

    useEffect(() => {
        const loadExperiments = async () => {
            try {
                const data = await fetchExperiments();
                setExperiments(data);
            } catch (err) {
                console.error('Error loading experiments:', err);
            }
        };

        loadExperiments();
    }, []);


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
                    {experiments.map((exp) => {
                        const sequence = exp.Sequences?.[0]; // take the first sequence
                        const encodingParams = sequence?.EncodingParameters || {};
                        const network = sequence?.NetworkDisruptionProfile;

                        return (
                            <tr key={exp.Id}>
                                <td>{exp.ExperimentName}</td>
                                <td>{encodingParams.Encoder || 'N/A'}</td>
                                <td>
                                    {encodingParams.ResWidth && encodingParams.ResHeight
                                        ? `${encodingParams.ResWidth}x${encodingParams.ResHeight}`
                                        : 'N/A'}
                                </td>
                                <td>{encodingParams.Bitrate || 'N/A'}</td>
                                <td>{network?.networkName || 'N/A'}</td>
                                <td>{encodingParams.EncoderType || 'N/A'}</td>
                            </tr>
                        );
                    })}
                    </tbody>

                </table>
            )}
        </div>
    );
};

export default ViewExperiments;