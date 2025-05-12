import React, { useEffect } from "react";
import "./companyFollowers.css";
import MyNewSidebarDash from "../../components/myNewSidebarDash/MyNewSidebarDash";
import MainContentHeader from "../../components/mainContentHeaderSec/MainContentHeader";
import ContentViewHeader from "../../components/contentViewHeaderSec/ContentViewHeader";
import MyLoader from "../../components/myLoaderSec/MyLoader";
import UnAuthSec from "../../components/unAuthSection/UnAuthSec";
import Cookies from "js-cookie";
import { useFollowersStore } from "../../store/Followers";
import { NavLink } from "react-router-dom";

export default function CompanyFollowers({ loginType, token }) {
    const cookiesData = Cookies.get("currentLoginedData");
    const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;

    const {
        loading,
        followers,
        followed,
        unAuth,
        totalPages,
        currentPage,
        activeRole,
        fetchFollowers,
        setCurrentPage,
        setActiveRole,
    } = useFollowersStore();

    useEffect(() => {
        if (token) {
            fetchFollowers(token, loginType, currentPage);
        }
    }, [token, loginType, currentPage, fetchFollowers]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const filteredFollowers = loginType === "user"
        ? followers.filter((el, index, self) => index === self.findIndex((t) => t.companyId === el.companyId))
        : followers.filter((el, index, self) => index === self.findIndex((t) => t.userId === el.userId));
console.log(filteredFollowers);

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
                            <div className="content__view__handler company__follower__sec">
                                <ContentViewHeader title={`${loginType === "user" ? "All Following" : "All Followers"}`} />
                                <div className="follower__filter__search">
                                    <div className="followerInfo__handler row">
                                        {loginType !== "user" && (
                                            <div className="col-12 mb-4">
                                                <div className="my__roles__actions">
                                                    <button
                                                        className={`def__btn ${activeRole === "Followers" ? "rolesActiveBtn" : ""}`}
                                                        onClick={() => setActiveRole("Followers")}
                                                    >
                                                        Followers
                                                    </button>
                                                    <button
                                                        className={`cust__btn ${activeRole === "Followed Companies" ? "rolesActiveBtn" : ""}`}
                                                        onClick={() => setActiveRole("Followed Companies")}
                                                    >
                                                        Followed Companies
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {loginType !== "user" && activeRole === "Followed Companies" && (
                                            followed.map((el) => (
                                                <div key={el?.id} className="followerInfo__Item col-md-6">
                                                    <div className="followerImage">
                                                        <NavLink target="_blank" className={'nav-link'} to={`/${el?.companySlug}`}>
                                                        <img src={el?.companyLogo} alt={`${el?.companyName} avatar`} />
                                                        </NavLink>
                                                    </div>
                                                    <div className="followerContactInfo">
                                                        <NavLink target="_blank" className={'nav-link'} to={`/${el?.companySlug}`}>
                                                        <h1>{el?.companyName}</h1>
                                                        </NavLink>
                                                        <div className="follower__status">
                                                            <p className="isUsersfollowed text-light">following</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        {loginType !== "user" && activeRole === "Followers" && (
                                            followers?.map((el) => (
                                                <div key={el?.id} className="followerInfo__Item col-md-6">
                                                    <div className="followerImage">
                                                        <img src={el?.followableImage} alt={`${el?.followableName} avatar`} />
                                                    </div>
                                                    <div className="followerContactInfo">
                                                        {
                                                            el?.followableType === 'User' ?
                                                            <h1>{el?.followableName}</h1>
                                                            :
                                                            <NavLink target="_blank" className={'nav-link'} to={`/${el?.company_slug}`}>
                                                            <h1>{el?.followableName}</h1>
                                                            </NavLink>
                                                        }
                                                        
                                                        <div className="follower__status">
                                                            {/* <p>{el?.followableEmail || ""}</p> */}
                                                            <p className="isUsersfollowed text-light">follows you</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        {loginType !== "employee" && (
                                            filteredFollowers.map((el) => (
                                                <div key={el?.id} className="followerInfo__Item col-12">
                                                    <div className="followerImage">
                                                        <img src={el?.followableImage || el?.companyLogo} alt={`${el?.userName || el?.companyName} avatar`} />
                                                    </div>
                                                    <div className="followerContactInfo">
                                                    <NavLink target="_blank" className={'nav-link'} to={`/${el?.companySlug}`}>
                                                        <h1>{el?.followableName || el?.companyName}</h1>
                                                        </NavLink>
                                                        
                                                        <div className="follower__status">
                                                            <p>{el?.followableEmail || ""}</p>
                                                            <p className="isUsersfollowed">following</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div className="col-lg-12">
                                            {totalPages > 1 && (
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
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
