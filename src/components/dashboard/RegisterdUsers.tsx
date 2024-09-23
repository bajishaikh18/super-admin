import React, { useState, useEffect } from 'react';
import styles from '../../app/dashboard/Dashboard.module.scss';
import { AppUser, AdminUser } from  '../../stores/useUserStore';
import { useUserStore } from '../../stores/useUserStore';



type TabType = 'App Users' | 'Admin Users';

const RegisteredUsers: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('App Users');
    const [searchTerm, setSearchTerm] = useState('');
    const { appUsers, adminUsers, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleTabClick = (tab: TabType) => {
        setActiveTab(tab);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = (users: Array<AppUser | AdminUser>) =>
        users.filter(user =>
            Object.values(user).some((value: any) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    const isAppUser = (user: AppUser | AdminUser): user is AppUser => {
        return (user as AppUser).cv !== undefined;
    };

    return (
        <section className={styles.registeredUsers}>
            <div className={styles.card}>
                <div className={styles.headerRow}>
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'App Users' ? styles.active : ''}`}
                            onClick={() => handleTabClick('App Users')}
                        >
                            App Users (27362)
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Admin Users' ? styles.active : ''}`}
                            onClick={() => handleTabClick('Admin Users')}
                        >
                            Admin Users (7)
                        </button>
                    </div>
                    <div className={styles.searchContainer}>
                        <img src="/path/to/search-icon.png" alt="Search Icon" className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search"
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <img src="/path/to/another-icon.png" alt="Another Icon" className={styles.anotherIcon} />
                </div>

                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Mobile No.</th>
                            <th>Email ID</th>
                            {activeTab === 'App Users' && (
                                <>
                                    <th>State</th>
                                    <th>Job Title</th>
                                    <th>Industry</th>
                                    <th>Experience</th>
                                    <th>Gulf Exp.</th>
                                    <th>CV Availability</th>
                                    <th>Work Video</th>
                                    <th>Regd. Date</th>
                                    <th>Status</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {activeTab === 'App Users' && filteredUsers(appUsers).map((user, index) => (
                            <tr key={index}>
                                <td className={styles.blueName}>{user.name}</td>
                                <td>{user.mobile}</td>
                                <td>{user.email}</td>
                                {isAppUser(user) && (
                                    <>
                                        <td>{user.state}</td>
                                        <td>{user.jobTitle}</td>
                                        <td>{user.industry}</td>
                                        <td>{user.experience}</td>
                                        <td>{user.gulfExp}</td>
                                        <td className={user.cv === 'NA' ? styles.blackNA : styles.blueLink}>{user.cv}</td>
                                        <td className={user.video === 'NA' ? styles.blackNA : styles.blueLink}>{user.video}</td>
                                        <td>{user.regdDate}</td>
                                        <td>
                                            <span className={user.status === 'Inactive' ? styles.inactiveStatus : styles.blueStatus}>
                                                {user.status}
                                            </span>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {activeTab === 'Admin Users' && filteredUsers(adminUsers).map((user, index) => (
                            <tr key={index}>
                                <td className={styles.blueName}>{user.name}</td>
                                <td>{user.mobile}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default RegisteredUsers;















