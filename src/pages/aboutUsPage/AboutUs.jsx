import React from 'react'
import styles from './aboutUs.module.css'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
export default function AboutUs() {
    return (
        <div className={`aboutUs__handler singleCompanyQuote__handler`}>
            <MyMainHeroSec
            heroSecContainerType='singleCompany__quote'
            headText='About Us'
            />
            <div className="aboutUse_moreInfo_handler container ">
                <p className={`p-5  my-5 ${styles.textStyle}`} >
                ReachMagnet is a cutting-edge platform designed to redefine interactions between businesses and individuals in the digital age. It operates as a dynamic hub where companies can build comprehensive profiles to showcase their services and product catalogs to international buyers, while also providing e-commerce solutions for local customers. Following a careful verification process, businesses gain access to advanced profile features that facilitate smooth in-platform messaging, efficient request
                </p>
            </div>
        </div>
    )
}
