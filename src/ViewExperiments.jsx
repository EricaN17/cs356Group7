import React, { useState, useEffect } from 'react';

export default function ViewExperiments()
{
    const [ experiments, setExperiments] = useState ([]);

    // i will use the API here when i have it

    useEffect(() => {
        setExperiments([
            {
                id: 'EXP-001',
                name: 'Baseline Test',
                encoder: 'HEVC',
                duration: '5m 23s',
                status: 'Completed',
                outputLink: '/output/exp-001.mp4',
                logLink: '/logs/exp-001.log'
            },
            {
                id: 'EXP-002',
                name: 'Quality Check',
                encoder: 'AVC',
                duration: '3m 40s',
                status: 'Running',
                outputLink: '',
                logLink: '/logs/exp-002.log'
            }
        ]);
    }, []);

    return (
        <div className="ui-wrapper">
            <div className="ui-header">Experiments Dashboard</div>
            <div className="ui-container">
                <table className="ui-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Encoder</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Output</th>
                        <th>Log</th>
                    </tr>
                    </thead>
                    <tbody>
                    {experiments.length === 0 ? (
                        <tr>
                            <td colSpan="7">No experiments available</td>
                        </tr>
                    ) : (
                        experiments.map((exp) => (
                            <tr key={exp.id}>
                                <td>{exp.id}</td>
                                <td>{exp.name}</td>
                                <td>{exp.encoder}</td>
                                <td>{exp.duration}</td>
                                <td>{exp.status}</td>
                                <td>
                                    {exp.outputLink ? (
                                        <a href={exp.outputLink} target="_blank" rel="noopener noreferrer">Download</a>
                                    ) : 'Pending'}
                                </td>
                                <td>
                                    <a href={exp.logLink} target="_blank" rel="noopener noreferrer">View Log</a>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
