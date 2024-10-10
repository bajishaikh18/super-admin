"use client"

import React, { useState } from 'react'
import  {   AgencyType } from '@/stores/useAgencyStore';
import { Row, Col, InputGroup, Form, Dropdown, Button, Card } from 'react-bootstrap';
import { SelectOption } from '@/helpers/types';
import { TableFilter } from '@/components/common/table/Filter';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import styles from './Agency.module.scss';




const Agencies: React.FC = () => {

    const [field, setField] = useState<SelectOption>({ value: 'agencyName', label: 'Agency Name' } as SelectOption);
    const [search, setSearch] = React.useState<string>("");

    const columnHelper = createColumnHelper<AgencyType>();

    const columns = [
        columnHelper.accessor('_id', {
            header: 'Agency#',
            cell: (info) => (
                <Link href={`/agencies/${info.getValue()}`}>
                    {info.getValue()}
                </Link>
            )
        }),
        columnHelper.accessor('agencyName', {
            header: 'Agency Name',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('phone', {
            header: 'Phone',
            cell: (info) => info.getValue(),
        })
    ];

    
       

    const handleCreateAgency = () => {
        console.log("Agency created successfully");
    }

    
  return (
    <>
    <Card>
        <main className="main-section">
        <div className="page-block">
            <h3 className={styles.sectionHeading}>Registered Agencies</h3>
        <div className={styles.filterSection}>          
             <TableFilter
            search={search}
            field={field}
            handleChange={(value) => setSearch(value)}
            handleFilterChange={(newField) => setField(newField)}
            columnsHeaders={columns}
            />

           <button className={styles.createAgency} onClick={handleCreateAgency}>
             + Create Agency
            </button>

        </div>
        </div>
    </main>
    </Card>
    </>
  )
}
export default Agencies;