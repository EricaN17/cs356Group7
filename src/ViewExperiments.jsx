import React, { useState, useEffect } from 'react';
import { fetchExperiments, deleteExperiment } from './api'; // Ensure this path is correct
import './ExperimentManagerUI.css';

const ViewExperiments = () => {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const loadExperiments = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchExperiments();
                setExperiments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadExperiments();
    }, [refresh]);

    const handleDelete = async (experimentId) => {
        if (window.confirm('Are you sure you want to delete this experiment?')) {
            try {
                setLoading(true);
                await deleteExperiment(experimentId);
                setRefresh(prev => !prev); // Trigger refresh
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRefresh = () => {
        setRefresh(prev => !prev);
    };

    if (loading && experiments.length === 0) {
        return <div className="ui-loading">Loading experiments...</div>;
    }

    if (error) {
        return (
            <div className="ui-error">
                Error: {error}
                <button onClick={handleRefresh}>Retry</button>
            </div>
        );
    }

    return (
        <div className="ui-table-section">
            <div className="ui-table-header">
                <h2>Experiment History</h2>
                <button onClick={handleRefresh} disabled={loading}>
                    Refresh
                </button>
            </div>

            {experiments.length === 0 ? (
                <p>No experiments found</p>
            ) : (
                <table className="ui-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {experiments.map(exp => (
                        <tr key={exp.id}>
                            <td>{exp.id}</td>
                            <td>{exp.experimentName}</td>
                            <td>
                  <span className={`status-${exp.status.toLowerCase()}`}>
                    {exp.status}
                  </span>
                            </td>
                            <td>{new Date(exp.createdAt).toLocaleString()}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    disabled={loading}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewExperiments;
