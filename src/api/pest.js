import {get,post,put,_del} from '../util/http'

/**
 * 获取虫害列表
 * @param page
 * @param size
 * @param sort
 * @returns {Promise<any>}
 */
export const getList=(page,size=10,sort="")=>{
    return get('pest',{page:page,size:size,sort:sort},false);
}

/**
 * 根据关键词搜索虫害
 * @param key
 * @param page
 * @param size
 * @param sort
 * @returns {Promise}
 */
export const search=(key,page,size=10,sort="")=>{
    return get('pest/search',{chsName:key,page:page,size:size,sort:sort},false);
}

/**
 * 添加虫害
 * @param pest
 * @returns {Promise}
 */
export const add=(pest)=>{
    return post('pest',pest,false);
}

/**
 * 更新虫害
 * @param pest
 * @returns {Promise}
 */
export const update=(pest)=>{
    return put('pest/'+pest.id,pest,false);
}

/**
 * 删除虫害
 * @param pest
 * @returns {Promise<any>}
 */
export const del=(pest)=>{
    return _del('pest/'+pest.id,{},false);
}

/**
 * 获取数据总数
 * @returns {Promise}
 */
export const count=()=>{
    return get('pest/count',{},false);
}