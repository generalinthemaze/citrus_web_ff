const OSS_HEADER='?x-oss-process=image';

const addHeader=(url)=>{
    if (url.indexOf(OSS_HEADER)===-1){
        url+=OSS_HEADER;
    }
    return url;
}

/**
 * 缩放图片
 * @param url
 * @param width 宽度
 * @param height 高度
 * @returns {*}
 */
export const resize_wh=(url,width,height)=>{
    url=addHeader(url);
    url+='/resize,m_lfit,h_';
    url+=height;
    url+=',w_';
    url+=width;
    return url;
}

/**
 * 缩放图片
 * @param url
 * @param width 宽度
 * @returns {*}
 */
export const resize=(url,width)=>{
    url=addHeader(url);
    url+='/resize,w_';
    url+=width;
    return url;
}
