import {get,post,put,_del} from '../util/http'


/**
 * 获取品种列表
 * @param page
 * @param size
 * @param sort
 * @returns {Promise<any>}
 */
export const getList=(page,size=10,sort="")=>{
    return get('citrus',{page:page,size:size,sort:sort},false);
}

/**
 * 根据关键词搜索品种
 * @param key
 * @param page
 * @param size
 * @param sort
 * @returns {Promise}
 */
export const search=(key,page,size=10,sort="")=>{
    return get('citrus/search',{key:key,page:page,size:size,sort:sort},false);
}

/**
 * 添加品种
 * @param citrus
 * @returns {Promise}
 */
export const add=(citrus)=>{
    return post('citrus',citrus,true);
}

/**
 * 更新品种
 * @param citrus
 * @returns {Promise}
 */
export const update=(citrus)=>{
    return put('citrus/'+citrus.id,citrus,true);
}

/**
 * 删除品种
 * @param citrus
 * @returns {Promise<any>}
 */
export const del=(citrus)=>{
    return _del('citrus/'+citrus.id,false);
}

/**
 * 获取数据总数
 * @returns {Promise}
 */
export const count=()=>{
    return get('citrus/count',{},false);
}