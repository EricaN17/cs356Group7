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
        </div>
    );
};

export default ViewExperiments;