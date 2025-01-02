import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import Cookies from 'js-cookie';
import './myPosts.css';
import { useDashBoardPostsStore } from '../../store/DashBoardPosts';

export default function MyPosts({ token }) {
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const cookiesData = Cookies.get('currentLoginedData');

    const {
        posts,
        loading,
        unAuth,
        totalPages,
        currentPage,
        fetchPosts,
        deletePost,
        setCurrentPage,
    } = useDashBoardPostsStore();

    useEffect(() => {
        if (!currentUserLogin) {
            setCurrentUserLogin(JSON.parse(cookiesData));
        }
    }, [cookiesData, currentUserLogin]);

    useEffect(() => {
        fetchPosts(token, loginType, currentPage);
    }, [token, loginType, currentPage]);

    const handlePageChange = (newPage) => setCurrentPage(newPage);

    const handleDeletePost = (postId) => deletePost(token, loginType, postId);
    console.log(posts);
    
    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className='dashboard__handler postsInDash__handler d-flex'>
                    <MyNewSidebarDash />
                    <div className='main__content container'>
                        <MainContentHeader currentUserLogin={currentUserLogin} />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className='content__view__handler'>
                                <ContentViewHeader title={'Posts'} />
                                <AddNewItem link={'/profile/posts/addNewItem'} />
                                <div className="content__card__list">
                                    {posts.length ? (
                                        <div className="row gap-4">
                                            {posts.map((el) => (
                                                <div key={el?.postId} className='col-lg-5 col-md-5 col-sm-12 postItemBg'>
                                                    <div className="headOfNews__card d-flex justify-content-between align-items-start">
                                                        <div className="headOfNews__card-leftPart">
                                                            <div className="image">
                                                                <img src={el.companyLogo} alt="newImg" />
                                                            </div>
                                                            <h4>{el.postTitle}</h4>
                                                            <p>Type: {el.postType}</p>
                                                            <p>{el.postDate}</p>
                                                        </div>
                                                        <div className="headOfNews__card-rightPart">
                                                            <i
                                                                onClick={() => navigate(`/profile/posts/edit-item/${el?.postId}`)}
                                                                className="bi bi-pencil-square me-2 text-primary"
                                                            ></i>
                                                            <i
                                                                onClick={() => handleDeletePost(el?.postId)}
                                                                className="bi bi-trash text-danger"
                                                            ></i>
                                                        </div>
                                                    </div>
                                                    <div className="news__card-body">
                                                        <p>{el.postDescription}</p>
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
                                            <div className="col-12 text-danger fs-5">No Posts Yet</div>
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
