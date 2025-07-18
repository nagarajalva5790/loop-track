import { useState } from 'react';

export const SettingsPage = () => {
    const [interval, setInterval] = useState(10);

    const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Math.min(60, Number(e.target.value)));
        setInterval(value);
    };

    return (
        <div className="detail-container">
            <h2>Settings</h2>
            <div>
                <label htmlFor="polling-interval">Polling interval (seconds): </label>
                <input
                    id="polling-interval"
                    type="number"
                    value={interval}
                    min={1}
                    max={60}
                    onChange={handleIntervalChange}
                />
                <span className="settings-note">(Not yet functional)</span>
            </div>
        </div>
    );
};