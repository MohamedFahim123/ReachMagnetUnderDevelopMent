import React from 'react'
import './myContactUs.css'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
export default function MyContactUs() {
    return (
        <div className='myContactUs__handler singleCompanyQuote__handler'>
            <MyMainHeroSec
                heroSecContainerType='singleCompany__quote'
                headText='Contact Us'
            />
            <div className="myContactUs_form_handler container">
                <div className="row justify-content-start">
                    <div className="col-md-12">
                        <div className="contactCompany__form my-5">
                            <form action="" className='p-3'>
                                <div className="mb-4">
                                    <label htmlFor="">
                                        Full Name
                                    </label>
                                    <input type="text" className='w-100' placeholder='Full Name' />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="">
                                        Phone Number
                                    </label>
                                    <input type="text" className='w-100' placeholder='Phone Number' />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="">
                                        Email Address
                                    </label>
                                    <input type="text" className='w-100' placeholder='Email Address' />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="">
                                        Your Message
                                    </label>
                                    <textarea name="" id="" className='w-100' placeholder='Your Message'></textarea>
                                </div>
                                <input type="submit" className='contactCompany__form-submitBtn' />
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
