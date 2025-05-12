import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MyLoader from '../myLoaderSec/MyLoader';
import { useLatestPackageStore } from '../../store/LatestCompanyPackageStore';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { scrollToTop } from '../../functions/scrollToTop';
import { Table } from 'react-bootstrap';
import { useCurrentPackageDetails } from '../../store/CurrentPackageDetails';
import PackageTransactionsTable from '../packageTransactionsTableSec/PackageTransactionsTable';
import MyPackagePayment from '../myPackagePaymentSec/MyPackagePayment';
import { useSidebarStatus } from '../../store/SidebarStatusStore';

export default function MyPackagesSettings({ token }) {
    const loginType = localStorage.getItem('loginType');
    const cookiesData = Cookies.get("currentLoginedData");
    const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;
    const navigate = useNavigate();
    const {
        loading,
        companyPackageStatus,
        currentPackage,
        packages,
        message,
        unAuth,
        fetchLatestCompanyPackage,
    } = useLatestPackageStore();
    const {
        companyCurrPackages,
        fetchCurrCompanyPackage,
    } = useCurrentPackageDetails();
        const {
            ShowStatus,
            fetchSidebarStatus,
        } = useSidebarStatus();
    const [selectedPackageId, setSelectedPackageId] = useState(null);
    const [actionType, setActionType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeRole, setActiveRole] = useState('package details')
    const [paymentMethod, setPaymentMethod] = useState('');
    const [attachment, setAttachment] = useState(null);
    useEffect(() => {
        fetchLatestCompanyPackage(loginType);
        fetchCurrCompanyPackage(loginType);
        fetchSidebarStatus(loginType);
        if (currentPackage !== null) {
            setSelectedPackageId(currentPackage);
        }
    }, [loginType, fetchLatestCompanyPackage, currentPackage]);
    console.log(companyCurrPackages);

    const handleSelectPackage = (id) => {
        setSelectedPackageId(id); // Update the selected package ID
    };
    const handleFileChange = (event) => {
        setAttachment(event.target.files[0]);
    };
    const handleSubmit = async () => {
        if (!selectedPackageId && actionType !== 'renew') {
            toast.error('Please select a package before proceeding.');
            return;
        }
        if (!paymentMethod) {
            toast.error('Please select a payment method.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('type', actionType);
            formData.append('package', selectedPackageId?.toString());
            formData.append('payment_method', paymentMethod);
            formData.append('attachment', attachment || '');
            formData.append('payment_type', 'offline');
            const response = await axios.post(
                `${baseURL}/${loginType}/control-packages`,
                formData,
                // {
                //     type: actionType,
                //     package: actionType === 'renew' ? null : selectedPackageId?.toString(),
                //     payment_method: '', //cash || bank_transfer || payment_link
                //     attachment: '', // png . jpg , jpeg , jfif , pdf
                //     payment_type: 'offline',
                // },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                toast.success('Changes submitted successfully!');
                fetchLatestCompanyPackage(loginType);
                scrollToTop();
            } else {
                throw new Error(response.data?.message || 'Submission failed');
            }
            console.log(actionType);
    console.log(selectedPackageId);
            
        } catch (error) {
            console.log(actionType);
    console.log(selectedPackageId);
            
            console.error('Error submitting changes:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };
    // console.log(selectedPackageId);

    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className="dashboard__handler d-flex">
                    <MyNewSidebarDash />
                    <div className="main__content container">
                        <MainContentHeader
                            currentUserLogin={currentUserLogin}
                        />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className="content__view__handler">
                                <ContentViewHeader title="Packages Settings" />
                                <div className="row">
                                    <div className="col-12 ">
                                        <div className="my__roles__actions mt-4">
                                            <button
                                                className={`def__btn ${activeRole === "package details" ? "rolesActiveBtn" : ""}`}
                                                onClick={() => setActiveRole("package details")}
                                            >
                                                package details
                                            </button>
                                            <button
                                                className={`cust__btn ${activeRole === "transactions" ? "rolesActiveBtn" : ""}`}
                                                onClick={() => setActiveRole("transactions")}
                                            >
                                                transactions
                                            </button>
                                           { 
                                           ShowStatus === 'package_settings_and_transactions' &&
                                            <button
                                                className={`cust__btn ${activeRole === "payment methods" ? "rolesActiveBtn" : ""}`}
                                                onClick={() => setActiveRole("payment methods")}
                                            >
                                                payment methods
                                            </button>}
                                        </div>
                                    </div>
                                </div>

                                {activeRole === 'package details' &&
                                    <>
                                        <div className="row">
                                            <div className="col-12 mt-4">
                                                <h3 className=' text-capitalize my-3 fs-5 fw-bold'>
                                                    current package details:
                                                </h3>
                                                <Table responsive>
                                                    <thead>
                                                        <tr className='table__default__header'>
                                                            <th className='text-center'>Start Date</th>
                                                            <th className='text-center'>End Date</th>
                                                            <th className='text-center'>Price</th>
                                                            <th className='text-center'>Discount Price</th>
                                                            <th className='text-center'>Payment Status</th>
                                                            <th className='text-center'>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='text-center p-3'>
                                                                {companyCurrPackages?.start_date}
                                                            </td>
                                                            <td className='text-center p-3'>
                                                                {companyCurrPackages?.end_date}
                                                            </td>
                                                            <td className='text-center p-3'>
                                                                {companyCurrPackages?.price}
                                                            </td>
                                                            <td className='text-center p-3'>
                                                                {companyCurrPackages?.discount_price}
                                                            </td>
                                                            <td className='text-center p-3'>
                                                                {companyCurrPackages?.payment_status}
                                                            </td>
                                                            <td className='text-center p-3'>
                                                                {companyCurrPackages?.status}
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                        <div className="content__card__list mt-3">
                            {packages?.length !== 0 ?
                                <div className='row business-signUp__packages'>
                                    <h3 className=' text-capitalize my-3 fs-5 fw-bold'>
                                        upgrade or renew package:
                                    </h3>
                                    {packages.map((pack) => (
                                        <div
                                            className={`col-lg-5 col-md-5 col-sm-10 m-auto p-4`}
                                            key={pack.id}
                                        >
                                            <div
                                                className={`packageCard ${selectedPackageId === pack.id
                                                        ? 'selectedPackage'
                                                        : 'notSelectedPackage'
                                                    }`}
                                            >
                                                <h5>{pack.name}</h5>
                                                <p className='price'>{pack.price}</p>
                                                {pack.discountPrice && (
                                                    <p className='discount-price'>
                                                        Discount Price: {pack.discountPrice}
                                                    </p>
                                                )}
                                                <ul>
                                                    {Object.entries(pack?.data)?.map(([key, value]) => (
                                                        <li key={key}>
                                                            <span>
                                                                <i className='bi bi-check-lg'></i>
                                                            </span>
                                                            {key.replace(/_/g, ' ')}: {value}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div
                                                    onClick={() => handleSelectPackage(pack.id)}
                                                    className={`text-center d-flex justify-content-center packageBtn ${selectedPackageId === pack.id
                                                            ? 'selectedPackageBtn'
                                                            : 'notSelectedPackageBtn'
                                                        }`}
                                                >
                                                    {selectedPackageId === pack.id ? 'Selected' : 'Select'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                :
                                <h3 className='text-danger'>
                                    {message}
                                </h3>
                            }
                            {(packages?.length !== 0 || companyPackageStatus?.length !== 0) &&
                                <div className="action-selector mt-4">
                                    <h4>Choose Action</h4>
                                    <select
                                        value={actionType}
                                        onChange={(e) => setActionType(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="" disabled>choose type</option>
                                        {
                                            companyPackageStatus?.map((status) => (
                                                <option value={status} key={status}>
                                                    {status}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            }
                            {packages?.length !== 0 && (
                            <div className="action-selector mt-4">
                                <h4>Choose Payment Method</h4>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="" disabled>
                                        Select Payment Method
                                    </option>
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="payment_link">Payment Link</option>
                                </select>
                                <p>
                                    {}
                                </p>
                                <h4 className="mt-4">Attach File</h4>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={handleFileChange}
                                    accept=".png, .jpg, .jpeg, .jfif, .pdf"
                                />
                            </div>
                        )}
                                            {(packages?.length !== 0 || companyPackageStatus?.length !== 0) &&
                                                <button
                                                    className="btn btn-primary mt-4"
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Submitting...' : 'Submit Changes'}
                                                </button>
                                            }
                                        </div>
                                    </>

                                }
                                {activeRole === 'transactions' &&
                                    <>
                                        <div className="row">
                                            <div className="col-12 mt-4">
                                                <PackageTransactionsTable token={token} loginType={loginType} />
                                            </div>
                                        </div>
                                    </>
                                }
                                {
                                activeRole === 'payment methods' &&
                                    <>
                                        <div className="row">
                                            <div className="col-12 mt-4">
                                                <MyPackagePayment token={token} loginType={loginType} />
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
