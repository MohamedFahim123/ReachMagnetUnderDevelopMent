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
    const [subIndustry, setSubIndustry] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [allowedCountries, setAllowedCountries] = useState([]);
    const [filterWithCountry, setFilterWithCountry] = useState('');
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
            const response = await axios.get(`${baseURL}/show-industry/${subIndustryID}?country=${filterWithCountry}&t=${new Date().getTime()}`);
            setContentData(response?.data?.data?.companies);
            setAllowedCountries(response?.data?.data?.countries)
        } catch (error) {
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    const fetchAllContentDatafromSub = async (subIndustrySlug) => {
       if (subIndustrySlug) {
        console.log(subIndustrySlug);
            try {
                const response = await axios.get(`${baseURL}/show-sub-industry/${subIndustrySlug}?country=${filterWithCountry}&t=${new Date().getTime()}`);
                setContentData(response?.data?.data?.companies);
                setAllowedCountries(response?.data?.data?.countries);
            } catch (error) {
                toast.error(error?.response?.data.message || 'Something Went Wrong!');
            }
       }
    };
    console.log(filterWithCountry);
    
    const fetchAllSubFromMain = async () => {
        try {
            const response = await axios.get(`${baseURL}/show-sub-industries/${subIndustryID}?t=${new Date().getTime()}`);
            setSubIndustry(response?.data?.data?.industry?.sub_industries);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    useEffect(() => {
        fetchAllContentData();
        fetchAllIndustries()
        fetchAllSubFromMain()
    }, [subIndustryID, filterWithCountry, setAllowedCountries]);



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
                            <AllCategorySideBar industries={industries} handleClose={handleClose} subIndustry={subIndustry}  show={show} fetchAllContentDatafromSub={fetchAllContentDatafromSub}
                            fetchAllContentData={fetchAllContentData}
                            setFilterWithCountry={setFilterWithCountry}
                            filterWithCountry={filterWithCountry}
                            />
                            <div className="subCategory__mainContent container">
                                <SubCategoryMainContent handleShow={handleShow} contentData={contentData} allowedCountries={allowedCountries} setFilterWithCountry={setFilterWithCountry} filterWithCountry={filterWithCountry}/>
                            </div>
                        </div>
                    </div>
            }
        </>

    )
}
