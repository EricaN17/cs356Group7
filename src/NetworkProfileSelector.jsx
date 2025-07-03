import React, {useEffect, useState} from 'react';
import { fetchNetworkProfiles } from './api';

const NetworkProfileSelector = ({ selectedProfileId, onChange }) => {
    const [networkProfiles, setNetworkProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const data = await fetchNetworkProfiles();
                setNetworkProfiles(data);
            } catch (err) {
                console.error('Error loading network profiles:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProfiles();
    }, []);


    const selected = networkProfiles.find(
        (p) => p.network_profile_id.toString() === selectedProfileId
    );

    return (
        <div className="form-group">
            <label htmlFor="networkProfile">Network Profile</label>
            {loading ? (
                <p>Loading network profiles...</p>
            ) : error ? (
                <p className="error">Error: {error}</p>
            ) : (
                <>
                    <select
                        id="networkProfile"
                        name="networkProfile"
                        value={selectedProfileId}
                        onChange={(e) => {
                            const selected = networkProfiles.find(
                                (p) => p.network_profile_id.toString() === e.target.value
                            );
                            onChange(selected || null);
                        }}
                        className="form-control"
                    >
                        <option value="">-- Select a Profile --</option>
                        {networkProfiles.map((profile) => (
                            <option key={profile.network_profile_id} value={profile.network_profile_id}>
                                {profile.networkName}
                            </option>
                        ))}
                    </select>

                    {selected && (
                        <div className="profile-details">
                            <p><strong>Delay:</strong> {selected.delay} ms</p>
                            <p><strong>Jitter:</strong> {selected.jitter} ms</p>
                            <p><strong>Packet Loss:</strong> {selected.packetLoss}%</p>
                            <p><strong>Bandwidth:</strong> {selected.bandwidth} Mbps</p>
                            <p><strong>Description:</strong> {selected.description}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default NetworkProfileSelector;
