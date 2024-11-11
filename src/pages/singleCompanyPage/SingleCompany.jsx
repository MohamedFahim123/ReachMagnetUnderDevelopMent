import React, { useEffect, useState } from 'react'
import './singleCompany.css'
import HeroOnlyCover from '../../components/heroOnlyCoverSec/HeroOnlyCover'
import CompanyInfoCard from '../../components/companyInfoCardSec/CompanyInfoCard'
import ProductDetailsFilterationBar from '../../components/productDetailsFilterationBarSec/ProductDetailsFilterationBar'
import aboutMarkImage from '../../assets/companyImages/flat-color-icons_about.png'
import workHourImg from '../../assets/companyImages/tabler_clock-hour-7-filled.png'
import AboutCompany from '../../components/aboutCompanySec/AboutCompany'
import SingleCompanyRectangleSec from '../../components/singleCompanyRectangleSec/SingleCompanyRectangleSec'
import HeaderOfSec from '../../components/myHeaderOfSec/HeaderOfSec'
import SingleCompanyNewsSec from '../../components/singleCompanyNewsSec/SingleCompanyNewsSec'
import CompanyContact from '../../components/companyContactSec/CompanyContact'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getDataFromAPI } from '../../functions/fetchAPI';
import LastMinuteCard from '../../components/lastMinuteCardSec/LastMinuteCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/autoplay";
import Autoplay from "../../../node_modules/swiper/modules/autoplay.mjs";
import MyLoader from '../../components/myLoaderSec/MyLoader'
import CompanyMediaCard from '../../components/companyMediaCardSec/CompanyMediaCard'
import BookAppointMentFrom from '../../components/bookAppointMentFrom/BookAppointMentFrom'

export default function SingleCompany({ token, fetchCartItems, wishlistItems }) {
    const [loading, setLoading] = useState(true);
    const { companyId } = useParams();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const companyData = {
        aboutMark: aboutMarkImage,
        briefDescription: 'Homzmart is a one stop shop where you purchase everything from furniture to household items and more!',
        details: [
            'We inject confidence into the online home shopping experience by solving for brands, manufacturers, and customers.',
            'We combine the power of technology and logistics to provide a seamless experience for the customer; therefore, delivering value to all our stakeholders.',
            'We are continuously solving for ‘home’ – Homzmart has the largest selection to design, style and brighten your home all with a single click. Convenience, predictive-tech and customer centric approach.'
        ],
        faq: [
            { title: 'How It Works', description: 'Unbeatable Selection over thousands of items waiting for you' },
            { title: 'Payment Method', description: 'You can choose from a variety of payment methods including cash on delivery' },
            { title: 'Fast Delivery', description: 'Order delivered to your doorstep' },
            { title: 'Expert Service', description: 'We are there to support you anytime' }
        ],
        workHourImage: workHourImg,
        workingHours: [
            { day: 'Sunday', from: '10 AM', to: '11 PM' },
            { day: 'Monday', from: '10 AM', to: '11 PM' },
            { day: 'Tuesday', from: '10 AM', to: '11 PM' },
            { day: 'Wednesday', from: '10 AM', to: '11 PM' },
            { day: 'Thursday', from: '10 AM', to: '11 PM' },
        ],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2823585.1606278117!2d39.30088302422216!3d31.207963192810116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15006f476664de99%3A0x8d285b0751264e99!2z2KfZhNij2LHYr9mG!5e0!3m2!1sar!2seg!4v1717936559294!5m2!1sar!2seg'
    };

    const showCompaniesQuery = useQuery({
        queryKey: ['show-company'],
        queryFn: () => getDataFromAPI(`show-company/${companyId}?t=${new Date().getTime()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
    });
    const companyNetworks = useQuery({
        queryKey: ['company-networks'],
        queryFn: () => getDataFromAPI(`company-networks/${companyId}?t=${new Date().getTime()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
    });

    const [activeItem, setActiveItem] = useState('Overview');

    const items = [
        { name: 'Overview', active: activeItem === 'Overview' },
        { name: 'Services', active: activeItem === 'Services' },
        { name: 'Product Catalog', active: activeItem === 'Product Catalog' },
        // { name: 'Products', active: activeItem === 'Products' },
        { name: 'Media', active: activeItem === 'Media' },
        { name: 'Networks', active: activeItem === 'Networks' },
    ];

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    console.log(showCompaniesQuery?.data?.company);
console.log(companyNetworks?.data);


    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='singleCompany__handler'>
                        <HeroOnlyCover />
                        <CompanyInfoCard handleShow={handleShow} showCompaniesQuery={showCompaniesQuery?.data?.company} token={token} />
                        <div className='my-5'>
                            <ProductDetailsFilterationBar items={items} onItemClick={handleItemClick} />
                        </div>
                        {!showCompaniesQuery?.isLoading &&
                            <div className='container showCompany__Service'>
                                {
                                    activeItem === 'Overview' &&
                                    <AboutCompany showCompaniesQuery={showCompaniesQuery?.data?.company} company={companyData} />
                                }
                                {
                                    activeItem === 'Services' &&
                                    <>
                                        {
                                            showCompaniesQuery?.data?.company?.companyServices?.length !== 0 ?
                                                <Swiper
                                                    className='mySwiper'
                                                    modules={[Autoplay]}
                                                    autoplay={{
                                                        delay: 2500,
                                                        pauseOnMouseEnter: true,
                                                        disableOnInteraction: false
                                                    }}
                                                    breakpoints={{
                                                        300: {
                                                            slidesPerView: 1.1,
                                                            spaceBetween: 10
                                                        },
                                                        426: {
                                                            slidesPerView: 1.2,
                                                            spaceBetween: 20
                                                        },
                                                        600: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        768: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        995: {
                                                            slidesPerView: 3.2,
                                                            spaceBetween: 20
                                                        },
                                                    }}
                                                >
                                                    {showCompaniesQuery?.data?.company?.companyServices?.map((el) => {
                                                        return (
                                                            <SwiperSlide className=' my-3' key={el?.serviceId}>
                                                                <LastMinuteCard
                                                                    productImage={el?.serviceImage}
                                                                    productName={el?.serviceTitle}
                                                                    showCustomContent={true}
                                                                    productLink={`/show-company/${companyId}/service-details/${el?.serviceId}`}
                                                                    borderColor={'rgba(0, 0, 0, 0.5)'}
                                                                    onAddClick={''}
                                                                />
                                                            </SwiperSlide>
                                                        )
                                                    })}
                                                </Swiper>
                                                :
                                                <h5 className='text-center text-danger text-capitalize mb-4'>
                                                    No Services for this company
                                                </h5>
                                        }

                                    </>
                                }
                                {
                                    activeItem === 'Product Catalog' &&
                                    <>
                                        {
                                            showCompaniesQuery?.data?.company?.companyCatalogs?.length !== 0 ?
                                                <Swiper
                                                    className='mySwiper'
                                                    modules={[Autoplay]}
                                                    autoplay={{
                                                        delay: 2500,
                                                        pauseOnMouseEnter: true,
                                                        disableOnInteraction: false
                                                    }}
                                                    breakpoints={{
                                                        300: {
                                                            slidesPerView: 1.1,
                                                            spaceBetween: 10
                                                        },
                                                        426: {
                                                            slidesPerView: 1.2,
                                                            spaceBetween: 20
                                                        },
                                                        600: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        768: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        995: {
                                                            slidesPerView: 3.2,
                                                            spaceBetween: 20
                                                        },
                                                    }}
                                                >
                                                    {showCompaniesQuery?.data?.company?.companyCatalogs?.map((el) => {
                                                        return (
                                                            <SwiperSlide className=' my-3' key={el?.catalogId}>
                                                                <LastMinuteCard
                                                                    productImage={el?.catalogImages[0].media}
                                                                    productName={el?.catalogTitle}
                                                                    productLink={`/show-company/${companyId}/catalog-details/${el?.catalogId}`}
                                                                    showCustomContent={true}
                                                                    borderColor={'rgba(0, 0, 0, 0.5)'}
                                                                    onAddClick={''}
                                                                />
                                                            </SwiperSlide>
                                                        )
                                                    })}
                                                </Swiper>
                                                :
                                                <h5 className='text-center text-danger text-capitalize mb-4'>
                                                    No Product Catalog for this company
                                                </h5>
                                        }

                                    </>
                                }
                                {
                                    activeItem === 'Products' &&
                                    <>
                                        <Swiper
                                            className='mySwiper'
                                            modules={[Autoplay]}
                                            autoplay={{
                                                delay: 2500,
                                                pauseOnMouseEnter: true,
                                                disableOnInteraction: false
                                            }}
                                            breakpoints={{
                                                300: {
                                                    slidesPerView: 1.1,
                                                    spaceBetween: 10
                                                },
                                                426: {
                                                    slidesPerView: 1.2,
                                                    spaceBetween: 20
                                                },
                                                600: {
                                                    slidesPerView: 2.2,
                                                    spaceBetween: 15
                                                },
                                                768: {
                                                    slidesPerView: 2.2,
                                                    spaceBetween: 15
                                                },
                                                995: {
                                                    slidesPerView: 3.2,
                                                    spaceBetween: 20
                                                },
                                            }}
                                        >
                                            {showCompaniesQuery?.data?.company?.companyProducts?.map((el) => {
                                                return (
                                                    <SwiperSlide className=' my-3' key={el?.productId}>
                                                        <LastMinuteCard
                                                            productImage={el?.productMedias[0].image}
                                                            productName={el?.productTitle}
                                                            showCustomContent={true}
                                                            borderColor={'rgba(0, 0, 0, 0.5)'}
                                                            onAddClick={''}
                                                        />
                                                    </SwiperSlide>
                                                )
                                            })}
                                        </Swiper>
                                    </>
                                }
                                {
                                    activeItem === 'Media' &&
                                    <>
                                        {
                                            showCompaniesQuery?.data?.company?.companyPortfolio?.length !== 0 ?
                                                <Swiper
                                                    className='mySwiper'
                                                    modules={[Autoplay]}
                                                    autoplay={{
                                                        delay: 2500,
                                                        pauseOnMouseEnter: true,
                                                        disableOnInteraction: false
                                                    }}
                                                    breakpoints={{
                                                        300: {
                                                            slidesPerView: 1.1,
                                                            spaceBetween: 10
                                                        },
                                                        426: {
                                                            slidesPerView: 1.2,
                                                            spaceBetween: 20
                                                        },
                                                        600: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        768: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        995: {
                                                            slidesPerView: 3.2,
                                                            spaceBetween: 20
                                                        },
                                                    }}
                                                >
                                                    {showCompaniesQuery?.data?.company?.companyPortfolio?.map((el) => {
                                                        return (
                                                            <SwiperSlide className=' my-3' key={el?.id}>
                                                                <CompanyMediaCard type={el?.type} mediaSrc={el?.link} 
                                                                 
                                                                />
                                                            </SwiperSlide>
                                                        )
                                                    })}
                                                </Swiper>
                                                :
                                                <h5 className='text-center text-danger text-capitalize mb-4'>
                                                    No added media for this company
                                                </h5>
                                        }

                                    </>
                                }
                                 {
                                    activeItem === 'Networks' &&
                                    <>
                                        {
                                            companyNetworks?.data?.networks?.length !== 0 ?
                                                <Swiper
                                                    className='mySwiper'
                                                    modules={[Autoplay]}
                                                    autoplay={{
                                                        delay: 2500,
                                                        pauseOnMouseEnter: true,
                                                        disableOnInteraction: false
                                                    }}
                                                    breakpoints={{
                                                        300: {
                                                            slidesPerView: 1.1,
                                                            spaceBetween: 10
                                                        },
                                                        426: {
                                                            slidesPerView: 1.2,
                                                            spaceBetween: 20
                                                        },
                                                        600: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        768: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        995: {
                                                            slidesPerView: 3.2,
                                                            spaceBetween: 20
                                                        },
                                                    }}
                                                >
                                                    {companyNetworks?.data?.networks?.networks?.map((el) => {
                                                        return (
                                                        <SwiperSlide className=' my-3' key={el?.id}>
                                                            <CompanyMediaCard type={'image'} mediaSrc={el?.logo} 
                                                            mainInfo={true}
                                                            mainInfoName={el?.name}
                                                            mainInfoType={el?.label}
                                                            mainInfoLink={''}
                                                            />
                                                        </SwiperSlide>
                                                        )
                                                    })}
                                                </Swiper>
                                                :
                                                <h5 className='text-center text-danger text-capitalize mb-4'>
                                                    No added media for this company
                                                </h5>
                                        }

                                    </>
                                }
                            </div>
                        }
                        {
                            showCompaniesQuery?.data?.company?.companyFaqs === 0 ?
                                <>
                                    <SingleCompanyRectangleSec showCompaniesQuery={showCompaniesQuery?.data?.company} />
                                </>
                                :
                                ''

                        }


                        {/* <ReadyToBuySec fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} token={token} showCompaniesQuery={showCompaniesQuery} companies={showCompaniesQuery?.data?.company} secMAinTitle={`Ready-To-Buy From ${showCompaniesQuery?.data?.company?.companyName}`} /> */}


                        <SingleCompanyNewsSec token={token} />
                        {/* <SingleCompanyAffiliate /> */}
                        {
                            token &&
                            <BookAppointMentFrom show={show} handleClose={handleClose} token={token} companyId={companyId} company={showCompaniesQuery?.data} />
                        }
                        {
                            <CompanyContact company={showCompaniesQuery} token={token} companyId={companyId} />
                        }

                    </div>
            }
        </>
    );
};