import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../app/dashboard/Dashboard.module.scss';
import { Active, Pending, Expired } from '../../stores/useUserStore';
import { useUserStore } from '../../stores/useUserStore';
import { CustomDataTable } from '@/components/common/CustomDatatable';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from '@tanstack/react-table'

type TabType = 'Active' | 'Pending' | 'Expired';

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
  }

const columnHelper = createColumnHelper<Person>()

const columns = [
    columnHelper.accessor('firstName', {
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('visits', {
      header: () => <span>Visits</span>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: info => info.column.id,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: info => info.column.id,
    }),
  ]

  const defaultData: Person[] = [
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50,
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80,
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10,
    },
  ]
  
const PostedJobs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('Active');
    const [searchTerm, setSearchTerm] = useState('');
    const { active, pending, expired, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleTabClick = (tab: TabType) => {
        setActiveTab(tab);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = (users: Array<Active  | Pending | Expired>) =>
        users.filter(user =>
            Object.values(user).some((value: any) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    const isActive = (user: Active | Pending | Expired): user is Active => {
        return (user as Active).jobtype !== undefined;
    };
    const handleMediaClick = (media: string) => {
        console.log(`Media Link: ${media}`); 
    };
    return (
        <section className={styles.registeredUsers}>
            <div className={styles.card}>
                <div className={styles.headerRow}>
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Active' ? styles.active : ''}`}
                            onClick={() => handleTabClick('Active')}
                        >
                            Active ({12415})
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Pending' ? styles.active : ''}`}
                            onClick={() => handleTabClick('Pending')}
                        >
                            Pending ({21})
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Expired' ? styles.active : ''}`}
                            onClick={() => handleTabClick('Expired')}
                        >
                            Expired ({241})
                        </button>
                    </div>
                </div>
                <CustomDataTable columns={columns} data={defaultData} length={10} refetchFn={()=>{}} />
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th className={styles.greyText}>POST ID</th>
                            <th className={styles.greyText}>AGENCY NAME</th>
                            {activeTab === 'Active' && (
                                <>
                                    <th className={styles.greyText}>JOB TYPE</th>
                                    <th className={styles.greyText}>LOCATION</th>
                                    <th className={styles.greyText}>SALARY</th>
                                    <th className={styles.greyText}>BENEFITS</th>
                                    <th className={styles.greyText}>NO OF POSITIONS</th>
                                    <th className={styles.greyText}>MEDIA</th>
                                    <th className={styles.greyText}>POSTED DATE</th>
                                    <th className={styles.greyText}>EXPIRY</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {activeTab === 'Active' && filteredUsers(active).map((user, index) => (
                            <tr key={index}>
                                <td className={styles.blueName}>
                                    <a href={`/jobs/${user.postid}`} className={styles.blueLink}>
                                        {user.postid}
                                    </a>
                                </td>
                                <td>{user.agencyname}</td>
                                {isActive(user) && (
                                    <>
                                        <td>{user.jobtype}</td>
                                        <td>{user.location}</td>
                                        <td>{user.salary}</td>
                                        <td>{user.benefits}</td>
                                        <td>{user.noofpositions}</td>
                                        <td className={styles.blueName}>
                                            <span 
                                                className={styles.blueLink} 
                                                onClick={() => handleMediaClick(user.media)} 
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {user.media}
                                            </span>
                                        </td>
                                        <td>{user.posteddate}</td>
                                        <td>{user.expiry}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {activeTab === 'Pending' && filteredUsers(pending).map((user, index) => (
                            <tr key={index}>
                                <td className={styles.blueName}>
                                    <a href={`/jobs/${user.postid}`} className={styles.blueLink}>
                                        {user.postid}
                                    </a>
                                </td>
                                <td>{user.agencyname}</td>
                            </tr>
                        ))}
                        {activeTab === 'Expired' && filteredUsers(expired).map((user, index) => (
                            <tr key={index}>
                                <td className={styles.blueName}>
                                    <a href={`/jobs/${user.postid}`} className={styles.blueLink}>
                                        {user.postid}
                                    </a>
                                </td>
                                <td>{user.agencyname}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default PostedJobs;