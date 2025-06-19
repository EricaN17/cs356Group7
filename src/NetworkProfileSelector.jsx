import React from 'react';
import networkProfiles from '../src/data/networkProfiles.json';

const NetworkProfileSelector = ({ selectedProfileId, onChange }) => {
    const selected = networkProfiles.find(
        (p) => p.networkProfile.id.toString() === selectedProfileId
    );

    return (
        <div className="form-group">
            <label htmlFor="networkProfile">Network Profile</label>
            <select
                id="networkProfile"
                name="networkProfile"
                value={selectedProfileId}
                onChange={(e) => {
                    const selected = networkProfiles.find(
                        (p) => p.networkProfile.id.toString() === e.target.value
                    );
                    onChange(selected?.networkProfile || null);
                }}
                className="form-control"
            >
                <option value="">-- Select a Profile --</option>
                {networkProfiles.map((wrapper) => {
                    const profile = wrapper.networkProfile;
                    return (
                        <option key={profile.id} value={profile.id}>
                            {profile.name}
                        </option>
                    );
                })}
            </select>

            {selected && (
                <div className="profile-details">
                    <p><strong>Delay:</strong> {selected.networkProfile.delay} ms</p>
                    <p><strong>Jitter:</strong> {selected.networkProfile.jitter} ms</p>
                    <p><strong>Packet Loss:</strong> {selected.networkProfile.packetLoss}%</p>
                    <p><strong>Bandwidth:</strong> {selected.networkProfile.bandwidth} Mbps</p>
                </div>
            )}
        </div>
    );
};

export default NetworkProfileSelector;
