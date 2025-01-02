import React, { useEffect, useState } from 'react'
import './subCategoryMain.css'
import AllCategorySideBar from '../../components/allCategorySideBarSec/AllCategorySideBar'
import SubCategoryMainContent from '../../components/subCategoryMainContentSec/SubCategoryMainContent'
import MyLoader from '../../components/myLoaderSec/MyLoader'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
export default function SubCategoryMain() {
    const [loading, setLoading] = useState(true);
    const {subIndustryID} = useParams()   
     
    const [contentData, setContentData] = useState([]);
    const [industries, setIndustries] = useState([]);
    const fetchAllIndustries = async () => {
        try {
            const response = await axios.get(`${baseURL}/industries?t=${new Date().getTime()}`);
            setIndustries(response?.data?.data?.industries);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
        fetchAllContentData()
    };

    const fetchAllContentData = async () => {
        try {
            const response = await axios.get(`${baseURL}/show-industry/${subIndustryID}?t=${new Date().getTime()}`);
            setContentData(response?.data?.data?.industry);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    useEffect(() => {
        fetchAllContentData();
        fetchAllIndustries()
    }, [subIndustryID]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);
    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='otherCategory__handler subCategoryMain__handler singleCompanyQuote__handler'>
                        <MyMainHeroSec
                            heroSecContainerType='singleCompany__quote'
                            headText='All Industries'
                        />
                        <div className="otherCategory__display__handler h-100 d-flex w-100 mb-4">
                            <AllCategorySideBar industries={industries} handleClose={handleClose}  show={show} />
                            <div className="subCategory__mainContent container">
                                <SubCategoryMainContent handleShow={handleShow} contentData={contentData} />
                            </div>
                        </div>
                    </div>
            }
        </>

    )
}
