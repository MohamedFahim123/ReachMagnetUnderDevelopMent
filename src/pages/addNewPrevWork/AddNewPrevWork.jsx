import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import { baseURL } from "../../functions/baseUrl";
import toast from "react-hot-toast";
import { scrollToTop } from "../../functions/scrollToTop";
import MyLoader from "../../components/myLoaderSec/MyLoader";
import MyNewSidebarDash from "../../components/myNewSidebarDash/MyNewSidebarDash";
import MainContentHeader from "../../components/mainContentHeaderSec/MainContentHeader";
import ContentViewHeader from "../../components/contentViewHeaderSec/ContentViewHeader";

export default function AddNewPrevWork({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const { id } = useParams();
    const [currPrevWork, setCurrPrevWork] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        title_en: '',
        description_en: '',
        type_en: '',
        image: '',
    });

    useEffect(() => {
        if (id && loginType === 'employee') {
            (async () => {
                await axios.get(`${baseURL}/${loginType}/show-pervious-work/${id}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(response => {
                        setCurrPrevWork(response?.data?.data?.pervious_work);
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Something went wrong!');
                    });
            })();
        };
    }, [id]);

    useEffect(() => {
        if (currPrevWork?.id && +currPrevWork?.id === +id) {
            setFormData({
                title_en: currPrevWork?.title || '',
                description_en: currPrevWork?.description || '',
                type_en: currPrevWork?.type || '',
                image: currPrevWork?.image || '',
            });

        };
    }, [currPrevWork, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleImageChange = (e) => {
        const files = (e.target.files);
        setFormData((prevState) => ({
            ...prevState,
            image: files[0],
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        const toastId = toast.loading('Loading...');
        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });

        try {
            const slugCompletion = id ? `update-pervious-work/${id}` : 'add-pervious-work';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                navigate('/profile/previous-work')
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Previous Work updated successfully' : 'PrevWork added successfully'), {
                    id: toastId,
                    duration: 1000
                });
            } else {
                toast.error(id ? 'Failed to update the PrevWork' : 'Failed to add PrevWork', {
                    id: toastId,
                    duration: 2000
                });
            };
        } catch (error) {
            if (error?.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors)
                    .flat()
                    .join('\n');
                toast.error(<div style={{ whiteSpace: 'pre-wrap' }}>{validationErrors}</div>, {
                    id: toastId,
                    duration: 2000
                });
            } else {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
                    id: toastId,
                    duration: 2000
                });
            }
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            <div className='newCatalogItem__form__handler'>
                                <ContentViewHeader title={id ? 'Update Previous Work' : 'Add new Previous Work'} />
                                <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="title_en">Work Title<span className="requiredStar"> *</span>
                                                    <i title='Work Title' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title_en"
                                                    id="title_en"
                                                    className="form-control"
                                                    placeholder="Work Title"
                                                    value={formData?.title_en}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="type_en">Type of Work<span className="requiredStar"> *</span>
                                                    <i title='Type of Work' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                {/* <select
                                                    name="type_en"
                                                    id="type_en"
                                                    className="form-control custom-select"
                                                    value={formData?.type_en}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select Type of Work</option>
                                                    <option value="service">Service</option>
                                                    <option value="Catalog">Catalog</option>
                                                </select> */}
                                                <input
                                                    type="text"
                                                    name="type_en"
                                                    id="type_en"
                                                    className="form-control"
                                                    placeholder="Work Title"
                                                    value={formData?.type_en}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="description_en">Work Description<span className="requiredStar"> *</span>
                                                    <i title='Work Description' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <textarea
                                                    type="text"
                                                    name="description_en"
                                                    id="description_en"
                                                    className="form-control"
                                                    placeholder="Work Description"
                                                    value={formData?.description_en}
                                                    onChange={handleInputChange}
                                                    cols={4}
                                                    rows={4}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="upload__image__btn ">
                                        <label htmlFor="image" className='mb-2'>Work Cover Image<span className="requiredStar"> *</span>
                                        <br />
                                        <span style={{color: 'gray', fontSize: '14px'}}>(Recommended size 1000 * 1000px)</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="image"
                                            id='image'
                                            onChange={handleImageChange}
                                            className="form-control mt-2"
                                        />
                                    </div>
                                    <div className="form__submit__button">
                                        <button type="submit" className="btn btn-primary">
                                            {id ? 'Update Previous Work' : 'Add Previous Work'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
