'use client';
import React from 'react';

import { Authorize } from '@/components/common/Authorize';
import { ROLE } from '@/helpers/constants';
import AppliedOrSavedUsers from '@/components/users/AppliedorSavedUsers';
import { useParams, useSearchParams } from 'next/navigation';
import { NotFound } from '@/components/common/Feedbacks';
const allowedTypes = ['agency','job'];
const allowedPageTypes = ['applied','saved'];
const Page: React.FC = () => {
    const searchParams = useSearchParams()
    const type = searchParams.get("type");
    const {pageType} = useParams();
    if(!type || !allowedTypes.includes(type) || !allowedPageTypes.includes(pageType as string)){
        return <NotFound text='Looks like you are in a wrong page'/>
    }
    return (
        <Authorize roles={[ROLE.superAdmin,ROLE.employer, ROLE.admin]}>
            <AppliedOrSavedUsers pageType={pageType as "applied"}/>
        </Authorize>
    );
};

export default Page;
