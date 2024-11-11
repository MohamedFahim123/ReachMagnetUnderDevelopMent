import React, { useEffect, useState } from 'react'
import MyLoader from '../../components/myLoaderSec/MyLoader'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
import CategoryOctagonShape from '../../components/categoryOctagonShapeSec/CategoryOctagonShape'
export default function OtherCategories() {
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newData, setNewdata] = useState([]);

    const fetchAllIndustries = async () => {
        try {
            const response = await axios.get(`${baseURL}/show-all-industries?page=${currentPage}?t=${new Date().getTime()}`);
            setNewdata(response?.data?.data?.industries);
            setTotalPages(response?.data?.data?.meta?.last_page);
        } catch (error) {

            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    useEffect(() => {
        fetchAllIndustries();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='otherCategory__handler singleCompanyQuote__handler'>
                        <MyMainHeroSec
                            heroSecContainerType='singleCompany__quote'
                            headText='All Industries'
                        />
                        {/* <div className="otherCategory__display__handler position-relative d-flex mb-4">
                            <div>
                                <AllCategorySideBar industries={industries}/>
                            </div>
                            <div className="subCategory__mainContentm w-100">
                                <SubCategoryMainContent subCategsItems={subCategsItems} />
                            </div>
                        </div> */}
                        <div className='container  my-5'>
                            <div className="allCategory__items" style={{margin: '60px 0'}}>
                                <div className="category__octagon__flex__box">
                                    {
                                        newData?.length !== 0 ?
                                            <>
                                                {
                                                    newData?.map((el, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <CategoryOctagonShape
                                                                    octagonIcon={el?.icon}
                                                                    iconName={el?.name}
                                                                    iconLink={`/all-Industries/${el?.id}`}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    totalPages > 1 &&
                                                    <div className="col-12 d-flex justify-content-center align-items-center mt-4">
                                                        <button
                                                            type="button"
                                                            className="paginationBtn me-2"
                                                            disabled={currentPage === 1}
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                        >
                                                            <i class="bi bi-caret-left-fill"></i>
                                                        </button>
                                                        <span className='currentPagePagination'>{currentPage}</span>
                                                        <button
                                                            type="button"
                                                            className="paginationBtn ms-2"
                                                            disabled={currentPage === totalPages}
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                        >
                                                            <i class="bi bi-caret-right-fill"></i>
                                                        </button>
                                                    </div>
                                                }
                                            </>
                                            :
                                            <div className='row'>
                                                <div className="col-12 text-danger fs-5">
                                                    No Industries Items Yet
                                                </div>
                                            </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
