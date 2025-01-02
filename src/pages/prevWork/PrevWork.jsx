import { useEffect } from "react";
import { usePrevWorkStore } from "../../store/AllPrevWorkStore";
import Cookies from 'js-cookie';
import MyLoader from "../../components/myLoaderSec/MyLoader";
import MyNewSidebarDash from "../../components/myNewSidebarDash/MyNewSidebarDash";
import MainContentHeader from "../../components/mainContentHeaderSec/MainContentHeader";
import UnAuthSec from "../../components/unAuthSection/UnAuthSec";
import ContentViewHeader from "../../components/contentViewHeaderSec/ContentViewHeader";
import AddNewItem from "../../components/addNewItemBtn/AddNewItem";
import PrevWorkCard from "../../components/prevWorkCard/PrevWorkCard";

export default function PrevWork({ token }) {
    const loginType = localStorage.getItem('loginType');
    const cookiesData = Cookies.get("currentLoginedData");
    const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;

    const {
        loading,
        prevWork,
        unAuth,
        totalPages,
        currentPage,
        fetchPrevWork,
        deletePrevWork,
        setCurrentPage,
    } = usePrevWorkStore();

    useEffect(() => {
        fetchPrevWork(token, loginType, currentPage);
    }, [token, loginType, currentPage, fetchPrevWork]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    const handleDeleteThisPrevWork = (id) => {
        deletePrevWork(token, loginType, id);
    };

    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className="dashboard__handler d-flex">
                    <MyNewSidebarDash />
                    <div className="main__content container">
                        <MainContentHeader currentUserLogin={currentUserLogin} />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className="myProducts__handler content__view__handler">
                                <ContentViewHeader title="Our Previous Work" />
                                <AddNewItem link="/profile/previous-work/addNewItem" />
                                {prevWork?.length !== 0 ? (
                                    <div className="productTable__content">
                                        <div className="row">
                                            {
                                                prevWork?.map((row, index) => (
                                                    <div className="col-md-6 mt-4" key={index}>
                                                        <PrevWorkCard handleDeleteThisPrevWork={handleDeleteThisPrevWork} id={row?.id} title={row?.title} description={row?.description} img={row?.image} type={row?.type} />
                                                    </div>
                                                ))}
                                        </div>

                                        {
                                            totalPages > 1 && (
                                                <div className="d-flex justify-content-center align-items-center mt-4">
                                                    <button
                                                        type="button"
                                                        className="paginationBtn me-2"
                                                        disabled={currentPage === 1}
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                    >
                                                        <i className="bi bi-caret-left-fill"></i>
                                                    </button>
                                                    <span className="currentPagePagination">{currentPage}</span>
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
                                    <div className="row">
                                        <div className="col-12 text-danger fs-5">No Previous Work Yet</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
