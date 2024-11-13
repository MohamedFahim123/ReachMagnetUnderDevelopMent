import React, { useEffect, useState } from 'react';
import './myLogin.css';
import SignInFormMainSec from '../../components/signInFormMainSec/SignInFormMainSec';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function MyLogin({type,setType}) {
    const [loading, setLoading] = useState(true);
    const [loginType , setLoginType] = useState(localStorage.getItem('loginType'));

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    useEffect(()=>{
        setType(loginType);
    },[type,loginType])

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='signUp__page'>
                        <SignInFormMainSec loginType={loginType} setLoginType={setLoginType} />
                    </div>
            }
        </>
    );
};
