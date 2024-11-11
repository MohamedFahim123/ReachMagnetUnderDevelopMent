export const scrollToTop = (num)=>{
    window.scrollTo({
        top: num ? num : 0,
    });
};