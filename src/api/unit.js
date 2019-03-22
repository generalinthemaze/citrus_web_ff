import {get, post, put, _del} from '../util/http'

/**
 * 获取组织单位列表
 * @param page
 * @param size
 * @param sort
 * @returns {Promise<any>}
 */
export const getList = (page, size = 10, sort = '') => {
  return get('unit',{page:page,size:size,sort:sort},false);
}


/**
 * 根据关键词搜索单位
 * @param name
 * @param page
 * @param size
 * @param sort
 * @returns {Promise}
 */
export const search=(name,page,size=10,sort="")=>{
  return get('unit/search',{name:name,page:page,size:size,sort:sort},false);
};

/**
 * 添加单位
 * @param unit
 * @returns {Promise}
 */
export const add=(unit)=>{
  return post('unit',unit,true);
};

/**
 * 更新单位
 * @param unit
 * @returns {Promise}
 */
export const update=(unit)=>{
  return put('unit/'+unit.id,unit,true);
};

/**
 * 删除单位
 * @param unit
 * @returns {Promise<any>}
 */
export const del=(unit)=>{
  return _del('unit/'+unit.id,false);
};

/**
 * 获取单位总数
 * @returns {Promise}
 */
export const count=()=>{
  return get('unit/count',{},false);
}
