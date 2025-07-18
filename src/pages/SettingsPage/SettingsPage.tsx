

import styles from './SettingsPage.module.css';
import { useStore } from '../../store';

export const SettingsPage = () => {
    const pollingInterval = useStore(s => s.pollingInterval);
    const setPollingInterval = useStore(s => s.setPollingInterval);
    const userRole = useStore(s => s.userRole);
    const setUserRole = useStore(s => s.setUserRole);

    const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Math.min(60, Number(e.target.value)));
        setPollingInterval(value);
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserRole(e.target.value as 'admin' | 'contributor');
    };

    return (
        <div className={styles['settings-container']}>
            <div className={styles['settings-title']}>Settings</div>
            <div className={styles['settings-grid']}>
                <div className={styles['settings-row']}>
                    <label htmlFor="polling-interval" className={styles['settings-label']}>Polling interval (seconds):</label>
                    <input
                        id="polling-interval"
                        className={styles['settings-input']}
                        type="number"
                        value={pollingInterval}
                        min={1}
                        max={60}
                        onChange={handleIntervalChange}
                    />
                </div>
                <div className={styles['settings-row']}>
                    <label htmlFor="user-role" className={styles['settings-label']}>User Role:</label>
                    <select
                        id="user-role"
                        className={styles['settings-select']}
                        value={userRole}
                        onChange={handleRoleChange}
                    >
                        <option value="admin">Admin</option>
                        <option value="contributor">Contributor</option>
                    </select>
                </div>
            </div>
        </div>
    );
};