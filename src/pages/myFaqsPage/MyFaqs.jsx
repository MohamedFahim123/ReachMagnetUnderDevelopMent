import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import './myFaqs.css';
import Cookies from 'js-cookie';
import { useDashBoardFaqsStore } from '../../store/DashBoardFaqs';

export default function MyFaqs({ token }) {
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const cookiesData = Cookies.get('currentLoginedData');

    const {
        faqs,
        loading,
        unAuth,
        totalPages,
        currentPage,
        fetchFaqs,
        deleteFaq,
        setCurrentPage,
    } = useDashBoardFaqsStore();

    useEffect(() => {
        if (!currentUserLogin) {
            setCurrentUserLogin(JSON.parse(cookiesData));
        }
    }, [cookiesData, currentUserLogin]);

    useEffect(() => {
        fetchFaqs(token, loginType, currentPage);
    }, [token, loginType, currentPage]);

    const handlePageChange = (newPage) => setCurrentPage(newPage);

    const handleDeleteFaq = (id) => deleteFaq(token, loginType, id);

    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className='dashboard__handler allFaqsDash__handler d-flex'>
                    <MyNewSidebarDash />
                    <div className='main__content container'>
                        <MainContentHeader currentUserLogin={currentUserLogin} />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className='content__view__handler'>
                                <ContentViewHeader title={'FAQs'} />
                                <AddNewItem link={'/profile/faqs/addNewItem'} />
                                <div className="content__card__list">
                                    {faqs.length ? (
                                        <div className="row">
                                            {faqs.map((el) => (
                                                <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                                    <div className='singleCompany__rectangleSec-slide'>
                                                        <div className='deleteFaq__btn'>
                                                            <i
                                                                className="bi bi-x-circle text-danger"
                                                                onClick={() => handleDeleteFaq(el?.id)}
                                                            ></i>
                                                        </div>
                                                        <h4>{el?.question}</h4>
                                                        <p className='d-flex justify-content-between'>
                                                            <span>{el?.answer}</span>
                                                            <i
                                                                className="bi bi-pencil-square text-primary fs-6 tableEditBtn cursorPointer"
                                                                onClick={() => navigate(`/profile/faqs/edit-item/${el?.id}`)}
                                                            ></i>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {totalPages > 1 && (
                                                <div className="col-12 d-flex justify-content-center align-items-center mt-4">
                                                    <button
                                                        type="button"
                                                        className="paginationBtn me-2"
                                                        disabled={currentPage === 1}
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                    >
                                                        <i className="bi bi-caret-left-fill"></i>
                                                    </button>
                                                    <span className='currentPagePagination'>{currentPage}</span>
                                                    <button
                                                        type="button"
                                                        className="paginationBtn ms-2"
                                                        disabled={currentPage === totalPages}
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                    >
                                                        <i className="bi bi-caret-right-fill"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className='row'>
                                            <div className="col-12 text-danger fs-5">
                                                No FAQs Items Yet
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
