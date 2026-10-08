'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { EmployeeFetchApi } from './EmployeeApi';


export default function Search() {
    const [paramsId, setParamsId] = useState(null);
    const [loading, setloading] = useState(true);
    const searchParams = useSearchParams()
    const [employee, setEmployee] = useState([]);
    const params = useParams();
    useEffect(() => {
        setParamsId(params.id);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}employees/${paramsId}`;

        const fetchDataFromApiComponent = async () => {
            try {
                const response = await EmployeeFetchApi(apiUrl);
                setEmployee(response.data);
            } catch(err){
                console.log("Fail to fetch Data from Params id")
            } finally{
                setloading(false);
            }
        }
        fetchDataFromApiComponent();
    }, [paramsId]);

    if(loading){
        return <p>The data is loading...</p>
    }
    return (
        <>
            the data will be here
        </>
    )

}