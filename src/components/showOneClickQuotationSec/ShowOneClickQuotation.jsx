import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ContentViewHeader from "../contentViewHeaderSec/ContentViewHeader";
import MyNewSidebarDash from "../myNewSidebarDash/MyNewSidebarDash";
import MainContentHeader from "../mainContentHeaderSec/MainContentHeader";
import { Table } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../functions/baseUrl";
import toast from "react-hot-toast";
import MyLoader from "../myLoaderSec/MyLoader";
import UnAuthSec from "../unAuthSection/UnAuthSec";
import Cookies from "js-cookie";

export default function ShowOneClickQuotation({ token }) {
  const loginType = localStorage.getItem("loginType");
  const { offerId } = useParams();
  const [fullData, setFullData] = useState([]);
  const [newData, setNewdata] = useState([]);
  const [acceptedSingleQuotations, setAcceptedSingleQuotations] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingValue, setShippingValue] = useState(0);
  const [offerValidity, setOfferValidity] = useState(0);
  const [taxValue, setTaxValue] = useState(0);
  const [servicesValue, setServicesValue] = useState(0);
  const [currNegotiation, setCurrNegotiation] = useState(0);
  const navigate = useNavigate();
  let negotiationId = undefined;
  const location = useLocation();
  (() => {
    const regex = /oneclick-quotations\/(\d+)/;
    const str = location.pathname;
    const result = str.match(regex)[1];
    negotiationId = result;
  })();
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const [unAuth, setUnAuth] = useState(false);

  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

  const fetchShowQuotations = async () => {
    const slug =
      loginType === "user"
        ? `${loginType}/show-single-one-click-quotation`
        : `${loginType}/show-one-click-quotation`;
    try {
      const response = await axios.get(
        `${baseURL}/${slug}/${negotiationId}?t=${new Date().getTime()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFullData(response?.data?.data?.one_click_quotation);
      setNewdata(response?.data?.data?.one_click_quotation?.negotiate_one_click_quotation);
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data.message || 'Something Went Wrong!');
    };
  };

  useEffect(() => {
    fetchShowQuotations();
  }, [loginType, token]);

  useEffect(() => {
    const currentNegotiationDetails = newData?.find(el => +el?.id === +offerId);
    setCurrNegotiation(currentNegotiationDetails)
    setShippingValue(currentNegotiationDetails?.shipping_price);
    setTaxValue(currentNegotiationDetails?.tax);
    setOfferValidity(currentNegotiationDetails?.offer_validaty);
    setServicesValue(currentNegotiationDetails?.services);
    setTotalPrice(currentNegotiationDetails?.total_price);
    if (currentNegotiationDetails) {
      setAcceptedSingleQuotations(currentNegotiationDetails?.negotiate_one_click_quotation_details)
    };
  }, [newData]);

  const handleRejectAllQuotation = () => {
    const toastId = toast.loading("Loading...");
    const submitData = {
      negotiate_one_click_quotation_id: offerId,
      status: "rejected",
    };
    const slug = loginType === 'user' ? 'update-one-click-quotation-status' : 'update-buy-negotiation-quotation-status'
      (async () => {
        await axios
          .post(
            `${baseURL}/${loginType}/${slug}?t=${new Date().getTime()}`,
            submitData,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            navigate("/profile/oneclick-quotations");
            toast.success(response?.data?.message || "Quotation Rejected!", {
              id: toastId,
              duration: 1000,
            });
          })
          .catch((error) => {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
              setUnAuth(true);
            };
            toast.error(error?.response?.data?.errors?.negotiate_one_click_quotation_id[0] || error?.response?.data?.message || "Error", {
              id: toastId,
              duration: 2000,
            });
          });
      })();
  };

  const handleAcceptQuotation = () => {
    const toastId = toast.loading("Loading...");
    const submitData = {
      negotiate_one_click_quotation_id: offerId,
      status: "accepted",
    };
    const slug = loginType === 'user' ? 'update-one-click-quotation-status' : 'update-buy-negotiation-quotation-status';
    (async () => {
      await axios.post(
        `${baseURL}/${loginType}/${slug}?t=${new Date().getTime()}`,
        submitData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          navigate(`/profile/oneclick-quotations/${negotiationId}`);
          toast.success(response?.data?.message || "Quotation Accepted!", {
            id: toastId,
            duration: 1000,
          });
        })
        .catch((error) => {
          if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
            setUnAuth(true);
          };
          toast.error(
            error?.response?.data?.errors?.shipping_price[0] ||
            error?.response?.data?.errors?.total_price[0] ||
            error?.response?.data?.errors?.status[0] ||
            error?.response?.data?.errors?.quotation_id[0] ||
            error?.response?.data?.errors?.tax[0] ||
            error?.response?.data?.errors?.services[0] ||
            error?.response?.data?.message ||
            "Error!",
            {
              id: toastId,
              duration: 1000,
            }
          );
        });
    })();
  };

  const [loading, setLoading] = useState(true);

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
          <div className="dashboard__handler showSingleQuotation__handler d-flex">
            <MyNewSidebarDash />
            <div className="main__content container">
              <MainContentHeader currentUserLogin={currentUserLogin} />
              {
                unAuth ?
                  <UnAuthSec />
                  :
                  <div className="content__view__handler">
                    <ContentViewHeader title={`Quotation: ${fullData?.code}`} />
                    <div className="quotationTable__content">
                      <Table responsive>
                        <thead>
                          <tr className="table__default__header">
                            <th># Title ( Code )</th>
                            <th className='text-center'>Unit Of Measure</th>
                            <th className='text-center'>QTY</th>
                            <th className='text-center'>Unit Price</th>
                            <th className='text-center'>Tax (xx%)</th>
                            <th className='text-center'>Total Price</th>
                            <th className='text-center'>Duration (##days)</th>
                            <th className='text-center'>Current Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {acceptedSingleQuotations?.map((row, idx) => (
                            <tr className="" key={row?.id}>
                              <td className='text-capitalize'>
                                <span className='me-2 indexOfTheTable'>{idx + 1}</span>
                                <span>{
                                  `${row?.title} (${row?.code ?
                                    `${row?.code}` :
                                    '####'
                                  })`
                                }
                                </span>
                              </td>
                              <td className='text-center text-capitalize'>
                                {
                                  row?.unit_of_measure ? row?.unit_of_measure !== 'N/A' ? row?.unit_of_measure : '' : 'Customized Product'
                                }
                              </td>
                              <td className='text-center text-capitalize'>
                                {row?.quantity !== 'N/A' ? +row?.quantity : 0}
                              </td>
                              <td className='text-center text-capitalize'>
                                {row?.offer_price !== 'N/A' ? +row?.offer_price : 0}
                              </td>
                              <td className='text-center text-capitalize'>
                                {row?.tax !== 'N/A' ? +row?.tax : 0}
                              </td>
                              <td className='text-center text-capitalize'>
                                {row?.total_price !== 'N/A' ? +row?.total_price : 0}
                              </td>
                              <td className='text-center text-capitalize'>
                                {row?.duration !== 'N/A' ? +row?.duration : 0} days
                              </td>
                              <td className='text-center text-capitalize'>
                                <button className={`${row?.status} tableBtnSingleQuote`}>
                                  {row?.status}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    <div className="quoteTotals__handler">
                      <h3>Quote Totals</h3>
                      <div className="row align-items-center">
                        <div className="col-lg-6">
                          <div className="totals__full__info">
                            <div className="totals__text">
                              <h5 className="mb-4">Subtotal (Standard)</h5>
                              <h5 className="mb-4">Offer Validity</h5>
                              <h5 className="mb-4">Tax</h5>
                              {fullData?.include_shipping === 'Yes' && <h5 className="mb-4">Shipping cost</h5>}
                              <h5 className="mb-4">Services</h5>
                              <h5>Total</h5>
                            </div>
                            <div className="totals__prices">
                              <h5 className="mb-4">${+(totalPrice - taxValue - servicesValue - shippingValue) ? (totalPrice - taxValue - servicesValue - shippingValue) : 0}</h5>
                              <h5 className="mb-4">${+offerValidity ? offerValidity : 0}</h5>
                              <h5 className="mb-4">${+taxValue ? taxValue : 0}</h5>
                              {fullData?.include_shipping === 'Yes' && <h5 className="mb-4">
                                ${+shippingValue ? shippingValue : 0}
                              </h5>
                              }
                              <h5 className="mb-4">${+servicesValue ? servicesValue : 0}</h5>
                              <h5>
                                ${+totalPrice ? totalPrice : 0}
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 adjustPositione">
                          <div className="totals__have__problem">
                            <h3>Having a problem?</h3>
                            <button className="updateBtn">
                              <i className="bi bi-wechat fs-4"></i>
                              <span>Chat with requester</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="requesterDetails__handler">
                      <div className="row">
                        {
                          currNegotiation?.company_status === 'Accepted' &&
                          <div className="col-lg-12 d-flex justify-content-around">
                            <span onClick={handleAcceptQuotation} className="updateBtn">
                              Accept Quotation
                            </span>
                            <span
                              onClick={handleRejectAllQuotation}
                              className="updateBtn reject"
                            >
                              Reject Quotation
                            </span>
                          </div>
                        }
                      </div>
                    </div>


                  </div>
              }
            </div>
          </div>
      }
    </>
  );
};
