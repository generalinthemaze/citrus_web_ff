import {get,post,put,_del} from '../util/http'

/**
 * 获取采样点列表
 * @param page
 * @param size
 * @param sort
 * @returns {Promise}
 */
export const getList=(page,size=10,sort="")=>{
    return get('diseasePestSample',{page:page,size:size,sort:sort},false);
}

/**
 * 搜索
 * @param sampleId
 * @param province
 * @param location
 * @param page
 * @param size
 * @param sort
 * @returns {Promise}
 */
export const search=(sampleId,province,location,page,size=10,sort="")=>{
    return get('diseasePestSample/search',{sampleId:sampleId,province:province,location:location,
        page:page,size:size,sort:sort},false);
}

/**
 * 添加采样点
 * @param diseasePestSample
 * @returns {Promise}
 */
export const add=(diseasePestSample)=>{
    return post('diseasePestSample',diseasePestSample,true);
}

/**
 * 更新采样点
 * @param diseasePestSample
 * @returns {Promise}
 */
export const update=(diseasePestSample)=>{
    return put('diseasePestSample/'+diseasePestSample.id,diseasePestSample,true);
}

/**
 * 删除采样点
 * @param diseasePestSample
 * @returns {Promise<any>}
 */
export const del=(diseasePestSample)=>{
    return _del('diseasePestSample/'+diseasePestSample.id,false);
}

/**
 * 获取数据总数
 * @returns {Promise}
 */
export const count=()=>{
    return get('diseasePestSample/count',{},false);
}