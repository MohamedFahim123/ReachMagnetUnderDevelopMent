import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { getYoutubeVideoId } from '../../functions/getYoutubeVideo';
import { useDashBoardMediaStore } from '../../store/DashBoardMedia';

export default function MyMedia({ token }) {
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();

    const {
        loading,
        mediaItems,
        unAuth,
        totalPages,
        currentPage,
        filteration,
        activeRole,
        fetchMedias,
        filterMedias,
        deleteMediaItem,
        setCurrentPage,
        setFilteration,
        setActiveRole,
    } = useDashBoardMediaStore();

    useEffect(() => {
        fetchMedias(token, loginType, currentPage);
    }, [token, loginType, currentPage, fetchMedias]);

    useEffect(() => {
        if (filteration.type) {
            filterMedias(token, loginType, currentPage, filteration);
        } else {
            fetchMedias(token, loginType, currentPage);
        }
    }, [filteration, token, loginType, currentPage, filterMedias]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteMedia = (id) => {
        deleteMediaItem(token, loginType, id);
    };

    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className="dashboard__handler d-flex">
                    <MyNewSidebarDash />
                    <div className="main__content container">
                        <MainContentHeader currentUserLogin={null} search={false} />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className="content__view__handler">
                                <ContentViewHeader title="Medias For Company" />
                                <AddNewItem link="/profile/media/addNewItem" />
                                {loginType === 'employee' && (
                                    <div className="my__roles__actions mb-5 ps-0 ms-0">
                                        <button
                                            className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => {
                                                fetchMedias(token, loginType);
                                                setFilteration({ type: '' });
                                                setActiveRole('All');
                                            }}
                                        >
                                            All
                                        </button>
                                        <button
                                            className={`def__btn meddle_btn px-5 ${activeRole === 'image' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => {
                                                setFilteration({ type: 'image' });
                                                setActiveRole('image');
                                            }}
                                        >
                                            Image
                                        </button>
                                        <button
                                            className={`cust__btn px-5 ${activeRole === 'link' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => {
                                                setFilteration({ type: 'link' });
                                                setActiveRole('link');
                                            }}
                                        >
                                            Video
                                        </button>
                                    </div>
                                )}
                                <div className="content__card__list">
                                    {mediaItems.length !== 0 ? (
                                        <div className="row">
                                            {mediaItems.map((el) => (
                                                <div className="col-lg-6 d-flex justify-content-center mb-3" key={el?.id}>
                                                    <div className="card__item">
                                                        <div className="card__image">
                                                            {el?.type !== 'link' ? (
                                                                <img src={el?.link} alt={el?.id} />
                                                            ) : (
                                                                <iframe
                                                                    width="289px"
                                                                    height="191px"
                                                                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(el?.link)}`}
                                                                    title="YouTube video"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                ></iframe>
                                                            )}
                                                        </div>
                                                        <div className="card__btns d-flex">
                                                            <button
                                                                onClick={() => handleDeleteMedia(el?.id)}
                                                                className="btn__D"
                                                            >
                                                                Delete
                                                            </button>
                                                            <button
                                                                className="btn__E"
                                                                onClick={() => navigate(`/profile/media/edit-item/${el?.id}`)}
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
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
                                            <div className="col-12 text-danger fs-5">No Media Items Yet</div>
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
