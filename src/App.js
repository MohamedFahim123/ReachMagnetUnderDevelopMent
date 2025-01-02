import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './pages/myDashboard/companyDashboard.css';
import './App.css';
import MyCatalog from './pages/myInsights/MyCatalog';
import MyOrders from './pages/myOrders/MyOrders';
import MyProducts from './pages/myProductsPage/MyProducts';
import MyQutations from './pages/myQutationsPage/MyQutations';
import NewCatalogItemForm from './components/newCatalogItemFormSec/NewCatalogItemForm';
import Home from './pages/myHome/Home';
import MyNavBar from './components/myNavBarSec/MyNavBar';
import MyFooter from './components/myFooterSec/MyFooter';
import { useEffect, useState } from 'react';
import Discover from './pages/myDiscover/Discover';
import Shop from './pages/myShop/Shop';
import ProductDetails from './pages/myProductDetails/ProductDetails';
import SingleCompany from './pages/singleCompanyPage/SingleCompany';
import PersonalSignUp from './pages/personalSignUp/PersonalSignUp';
import BusinessSignUp from './pages/busnissSignUp/BusinessSignUp';
import { useQuery } from 'react-query';
import { getDataFromAPI } from './functions/fetchAPI';
import MyLogin from './pages/myLoginPage/MyLogin';
import Cookies from 'js-cookie';
import MyMessage from './pages/myMessagePage/MyMessage';
import toast, { Toaster } from 'react-hot-toast';
import CompanyFollowers from './pages/companyFollowersSec/CompanyFollowers';
import CompanyMessage from './pages/companyMessagePage/CompanyMessage';
import EnterUrEmail from './pages/enterUrEmailPage/EnterUrEmail';
import ResetPassword from './pages/resetPasswordPage/ResetPassword';
import OtherCategories from './pages/otherCategoriesPage/OtherCategories';
import SubCategoryMain from './pages/subCategoryMainPage/SubCategoryMain';
import MyProfileSettings from './pages/myProfileSettingsPage/MyProfileSettings';
import MyBussinessSettings from './pages/myBusinessSettingsPage/MyBussinessSettings';
import MyUsersManagement from './pages/myUsersManagementPage/MyUsersManagement';
import SingleCompanyQuote from './pages/singleCompanyQuotePage/SingleCompanyQuote';
import OneClickQuotation from './pages/oneClickQuotationPage/OneClickQuotation';
import MyService from './pages/myServicesPage/MyService';
import NewServiceForm from './components/newServiceFormSec/NewServiceForm';
import ShowSingleQuotation from './components/showSingleQuotationsSec/ShowSingleQuotation';
import OneClickQuotationsDashboard from './pages/oneClickQuotationsDashboardPage/OneClickQuotationsDashboard';
import ShowOneClickQuotation from './components/showOneClickQuotationSec/ShowOneClickQuotation';
import OneClickNegotiationCompanies from './pages/oneClickNegotiationCompaniesPage/OneClickNegotiationCompanies';
import MyFaqs from './pages/myFaqsPage/MyFaqs';
import NewFaqForm from './components/newFaqFromItem/NewFaqForm';
import MyPosts from './pages/myPostsPage/MyPosts';
import NewPostForm from './components/newPostFormItem/NewPostForm';
import MyAllCompanies from './pages/myAllCompaniesPage/MyAllCompanies';
import MyCompaniesInsights from './pages/myCompaniesInsightsPage/MyCompaniesInsights';
import ShowOneOrderInfo from './components/showOneOrderInfoSec/ShowOneOrderInfo';
import { baseURL } from './functions/baseUrl';
import axios from 'axios';
import MyShippingCosts from './pages/myShippingCostsPage/MyShippingCosts';
import NewShippingCostForm from './components/newShippingCostFromItem/NewShippingCostForm';
import ShowOneProductInfoInDash from './components/showOneProductInfoInDashSec/ShowOneProductInfoInDash';
import SearchInHome from './components/searchInHome/SearchInHome';
import UserVirificationSec from './pages/userVirification/UserVirificationSec';
import AboutUs from './pages/aboutUsPage/AboutUs';
import MyContactUs from './pages/myContactUsPage/MyContactUs';
import MyMedia from './pages/myMediaPAge/MyMedia';
import NewMediaForm from './components/newMediaFormSec/NewMediaForm';
import MyAppointements from './pages/myAppointementsPage/MyAppointements';
import NewAppointementFrom from './components/newAppointementFromSec/NewAppointementFrom';
import MyBookedAppointements from './pages/myBookedAppointementsPage/MyBookedAppointements';
import MyComanyForm from './pages/myCompanyFormPage/MyComanyForm';
import NewProductForm from './components/newProductItemForm/NewProductForm';
import ShowOneECommProductInDash from './components/showOneE-commProductInDashSec/ShowOneECommProductInDash';
import useNotifications from './functions/useNotifications';
import MyNotfications from './pages/myNotficationsPage/MyNotfications';
import useMessaging from './functions/useMessaging';
import NotFound from './pages/notFound/NotFound';
import MyNetwork from './pages/myNetwork/MyNetwork';
import NewNetworkForm from './components/newNetworkFormSec/NewNetworkForm';
import MyCatalogDetails from './pages/myCatalogDetailsPage/MyCatalogDetails';
import MyServiceDetails from './pages/myServiceDetailsPage/MyServiceDetails';
import CatalogOptionForm from './components/catalogOptionFormSec/CatalogOptionForm';
import PrevWork from './pages/prevWork/PrevWork';
import AddNewPrevWork from './pages/addNewPrevWork/AddNewPrevWork';


function App() {
  const token = Cookies.get('authToken');
  const [loginType, setLoginType] = useState(localStorage.getItem('loginType'));
  const [totalCartItemsInCart, setTotalCartItemsInCart] = useState(0);
  const [totalWishlistItems, setTotalWishlistItems] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollToggle, setScrollToggle] = useState(false);

  // const fetchCartItems = async () => {
  //   if (token) {
  //     try {
  //       const response = await axios.get(`${baseURL}/${loginType}/my-cart?t=${new Date().getTime()}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       setTotalCartItemsInCart(response?.data?.data?.cart?.total_quantity);
  //     } catch (error) {
  //       toast.error(error?.response?.data.message || 'Faild To get Cart Products!');
  //     };
  //   };
  // };
  // const wishlistItems = async () => {
  //   if (token) {
  //     if (loginType === 'user') {
  //       try {
  //         const response = await axios.get(`${baseURL}/${loginType}/my-wishlist?t=${new Date().getTime()}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         });
  //         setTotalWishlistItems(response?.data?.data?.wish_list?.length);
  //       }
  //       catch (error) {
  //         toast.error(error?.response?.data.message || 'Faild To get Cart Products!');
  //       };
  //     };
  //   };
  // };
  // useEffect(() => {
  //   fetchCartItems();
  //   wishlistItems();
  // }, [loginType, token]);

  useEffect(() => {
    if (token) {
      const restrictedPaths = ['/Login', '/business-signUp', '/personalsignUp', '/forget-password', '/reset-password'];
      if (restrictedPaths.includes(location.pathname)) {
        navigate('/');
      }
    } else if (location.pathname.includes('profile')) {
      navigate('/login');
    }
  }, [token, location.pathname]);

  const [loginnedUserId, setLoginnedUserId] = useState('');

  useEffect(() => {
    const currentUserData = Cookies.get('currentLoginedData');
    if (currentUserData) {
      setLoginnedUserId(JSON.parse(currentUserData)?.id);
    };
  }, []);

  const [fireNotification, setFireNotification] = useState(false);

  useNotifications(token, loginType, loginnedUserId, setFireNotification);

  const [fireMessage, setFireMessage] = useState(false);

  useMessaging(token, loginType, loginnedUserId, setFireMessage);

  return (
    <>

      {
        (location.pathname.includes('profile')) ? <></> : <MyNavBar fireMessage={fireMessage} fireNotification={fireNotification} setFireNotification={setFireNotification} loginType={loginType} token={token} scrollToggle={scrollToggle} />
      }

      <Toaster position="top-right" reverseOrder={false} />

      <Routes>

        {/* HomePage Route */}
        <Route path='/*' element={<NotFound />} />
        <Route path='/' element={<Home
          token={token}
        />} />

        {/* Search Page */}
        <Route path='/reach-magnet' element={<SearchInHome />} />

        {/* Shop Routes */}
        {/* <Route path='/discover' element={<Discover />} /> */}
        {/* <Route path='/shop'
          element={<Shop
            //  fetchCartItems={fetchCartItems}
            // wishlistItems={wishlistItems} 
            token={token} />} /> */}
        {/* <Route path='/shop/:singleProduct'
          element={<ProductDetails
            // fetchCartItems={fetchCartItems}
            //  wishlistItems={wishlistItems} 
            token={token} />} /> */}

        {/* <Route path='/lastMinuteDeals/:singleDeal' element={<LastMinuteDetails token={token} />} /> */}
        <Route path='/About-ReachMagnet' element={<AboutUs />} />
        <Route path='/contact-us' element={<MyContactUs token={token} />} />
        <Route path='/all-companies' element={<MyAllCompanies token={token} />} />
        <Route path='/show-company/:companyId' element={<SingleCompany token={token} />} />
        <Route path='/show-company/:companyId/catalog-details/:catalogId' element={<MyCatalogDetails token={token} />} />
        <Route path='/show-company/:companyId/service-details/:servId' element={<MyServiceDetails token={token} />} />
        <Route path='/:companyName/request-quote' element={<SingleCompanyQuote
          token={token}
        />} />

        <Route path='/one-click-quotation' element={<OneClickQuotation
          token={token}
        />} />

        <Route path='/all-insights' element={<MyCompaniesInsights token={token} />} />

        {/* <Route path='/my-wishlist' element={<MyWishList fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} token={token} />} /> */}

        {/* <Route path='/my-cart' element={<MyCart fetchCartItems={fetchCartItems} token={token} />} /> */}
        {/* <Route path='/check-out/:companyId' element={<MyCheckout token={token} />} /> */}

        {/* all category routes */}
        <Route path='/all-Industries' element={<OtherCategories />} />
        <Route path='/all-Industries/:subIndustryID' element={<SubCategoryMain
        />} />

        {/* Login & Regester Routes */}
        <Route path='/personalsignUp' element={<PersonalSignUp />} />
        <Route path='/business-signUp' element={<BusinessSignUp
        />} />
        <Route path='/login' element={<MyLogin
          type={loginType}
          setType={setLoginType}
        />} />
        <Route path='/forget-password' element={<EnterUrEmail />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/user-verification' element={<UserVirificationSec token={token} />} />

        {/* Profile Routes */}
        <Route path='/profile/followers' element={<CompanyFollowers loginType={loginType} token={token} />} />

        <Route path='/profile/catalog' element={<MyCatalog token={token} />} />
        <Route path='/profile/catalog/addNewItem' element={<NewCatalogItemForm
          token={token} />}
        />
        <Route path='/profile/catalog/edit-item/:id' element={<NewCatalogItemForm
          token={token}
        />} />
        <Route path='/profile/catalog/edit-item/:id/edit-option' element={<CatalogOptionForm
          currPage={'catalog'}
          token={token}
        />} />

        <Route path='/profile/catalogs/show-one/:itemId' element={<ShowOneProductInfoInDash
          token={token}
          show_slug={'show-catalog'}
        />} />

        <Route path='/profile/network' element={<MyNetwork token={token} />} />
        <Route path='/profile/network/addNewItem' element={<NewNetworkForm token={token} />} />
        <Route path='/profile/network/edit-item/:id' element={<NewNetworkForm token={token} />} />

        <Route path='/profile/previous-work' element={<PrevWork token={token} />} />
        <Route path='/profile/previous-work/addNewItem' element={<AddNewPrevWork token={token} />} />
        <Route path='/profile/previous-work/edit-item/:id' element={<AddNewPrevWork token={token} />} />

        <Route path='/profile/service' element={<MyService token={token} />} />
        <Route path='/profile/service/addNewItem' element={<NewServiceForm
          token={token}
        />} />
        <Route path='/profile/service/edit-item/:id' element={<NewServiceForm
          token={token}
        />} />
        <Route path='/profile/service/show-one/:itemId' element={<ShowOneProductInfoInDash
          token={token}
          show_slug={'show-service'}
        />} />
        <Route path='/profile/service/edit-item/:id/edit-option' element={<CatalogOptionForm
          currPage={'service'}
          token={token}
        />} />

        <Route path='/profile/media' element={<MyMedia token={token} />} />
        <Route path='/profile/media/addNewItem' element={<NewMediaForm token={token} />} />
        <Route path='/profile/media/edit-item/:id' element={<NewMediaForm token={token} />} />

        <Route path='/profile/appointments' element={<MyAppointements token={token} />} />
        <Route path='/profile/appointments/addNewAppointment' element={<NewAppointementFrom token={token} />} />

        <Route path='/profile/booked-appointments' element={<MyBookedAppointements token={token} />} />

        <Route path='/profile/contact-form' element={<MyComanyForm token={token} />} />
        <Route path='/profile/products' element={<MyProducts token={token} />} />
        <Route path='/profile/products/addNewItem' element={<NewProductForm
          token={token}
        />} />
        {/* <Route path='/profile/products/edit-item/:id' element={<NewProductForm mainCategories={mainCategoriesQuery?.data?.mainCategories} token={token} />} /> */}
        <Route path='/profile/products/show-one/:itemId' element={<ShowOneECommProductInDash token={token} />} />

        <Route path='/profile/faqs' element={<MyFaqs token={token} />} />
        <Route path='/profile/faqs/addNewItem' element={<NewFaqForm token={token} />} />
        <Route path='/profile/faqs/edit-item/:id' element={<NewFaqForm token={token} />} />

        <Route path='/profile/posts' element={<MyPosts token={token} />} />
        <Route path='/profile/posts/addNewItem' element={<NewPostForm token={token} />} />
        <Route path='/profile/posts/edit-item/:id' element={<NewPostForm token={token} />} />

        {/* <Route path='/profile/shipping-costs' element={<MyShippingCosts token={token} />} /> */}
        {/* <Route path='/profile/shipping-costs/addNewCost' element={<NewShippingCostForm token={token} countries={countriesQuery?.data?.countries} />} /> */}
        {/* <Route path='/profile/shipping-costs/edit-item/:id' element={<NewShippingCostForm token={token} countries={countriesQuery?.data?.countries} />} /> */}



        <Route path='/profile/quotations' element={<MyQutations token={token} />} />
        <Route path='/profile/quotations/:quotationsId' element={<ShowSingleQuotation token={token} />} />

        <Route path='/profile/oneclick-quotations' element={<OneClickQuotationsDashboard token={token} />} />
        <Route path='/profile/companyoneclick-quotations/:quotationsId' element={<ShowSingleQuotation token={token} />} />
        <Route path='/profile/oneclick-quotations/:negotiateId' element={<OneClickNegotiationCompanies token={token} />} />
        <Route path='/profile/oneclick-quotations/:negotiateId/:offerId' element={<ShowOneClickQuotation token={token} />} />

        <Route path='/profile/quotation-orders' element={<MyOrders token={token} />} />
        <Route path='/profile/quotation-orders/:orderId' element={<ShowOneOrderInfo token={token} />} />

        {/* <Route path='/company-messages' element={<CompanyMessage token={token} />} /> */}

        <Route path='/your-messages' element={<MyMessage
          token={token}
          setFireMessage={setFireMessage}
          fireMessage={fireMessage}
        />} />
        <Route path='/your-messages/:activeChatId' element={<MyMessage
          setFireMessage={setFireMessage}
          fireMessage={fireMessage}
          token={token}
        />} />

        <Route path='/profile/notifications' element={<MyNotfications
          fireNotification={fireNotification}
          setFireNotification={setFireNotification}
          token={token}
        />} />

        <Route path='/profile/profile-settings' element={<MyProfileSettings
          token={token}
        />} />
        <Route path='/profile/business-settings' element={<MyBussinessSettings
          token={token}
        />} />
        <Route path='/profile/users-management' element={<MyUsersManagement
          token={token}
        />} />

      </Routes>

      {
        !(location.pathname.includes('profile') || location.pathname.includes('your-messages')) && <MyFooter />
      }

    </>
  );
};
export default App;