import {get,post,put,_del} from '../util/http'

/**
 * 获取病害列表
 * @param page
 * @param size
 * @param sort
 * @returns {Promise<any>}
 */
export const getList=(page,size=10,sort="")=>{
    return get('disease',{page:page,size:size,sort:sort},false);
}

/**
 * 根据关键词搜索病害
 * @param key
 * @param page
 * @param size
 * @param sort
 * @returns {Promise}
 */
export const search=(key,page,size=10,sort="")=>{
    return get('disease/search',{chsName:key,page:page,size:size,sort:sort},false);
}

/**
 * 添加病害
 * @param disease
 * @returns {Promise}
 */
export const add=(disease)=>{
    return post('disease',disease,false);
}

/**
 * 更新病害
 * @param disease
 * @returns {Promise}
 */
export const update=(disease)=>{
    return put('disease/'+disease.id,disease,false);
}

/**
 * 删除病害
 * @param disease
 * @returns {Promise<any>}
 */
export const del=(disease)=>{
    return _del('disease/'+disease.id,{},false);
}

/**
 * 获取数据总数
 * @returns {Promise}
 */
export const count=()=>{
    return get('disease/count',{},false);
}