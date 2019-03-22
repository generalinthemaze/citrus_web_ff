import {get, post,_del,put} from '../util/http'
import {getCookie} from '../util/util'

/**
 * 登录
 * @param username
 * @param password
 * @returns {Promise<any>}
 */
export const login = (username,password) => {
    return new Promise((resolve, reject) => {
        post('user/login', {username:username,password:password},false)
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 验证用户token
 * @param token
 * @returns {Promise<any>}
 */
export const verify=(token)=>{
    return new Promise((resolve,reject)=>{
        get('user/verify',{'token':token})
            .then(response=>{
                if (response.code===0){
                    resolve(response.data)
                } else {
                    reject('code='+response.code)
                }
            })
            .catch(err=>{
                reject(err)
            })
    })
}

/**
 * 获取用户列表
 * @param page
 * @param size
 * @param sort
 * @returns {Promise<any>}
 */
export const getList=(page,size=10,sort="")=>{
  return get('user',{page:page,size:size,sort:sort},false);
}

/**
 * 根据关键词搜索用户
 * @param name
 * @param page
 * @param size
 * @param sort
 * @returns {Promise}
 */
export const search=(name,page,size=10,sort="")=>{
  return get('user/search',{name:name,page:page,size:size,sort:sort},false);
}


/**
 * 添加用户
 * @param user
 * @returns {Promise}
 */
export const add=(user)=>{
  return post('user',user,true);
}

/**
 * 更新用户(需要鉴权)
 * @param user
 * @returns {Promise}
 */
export const update=(user)=>{
  return put('user/'+user.id,user,true);
}

/**
 * 更新用户自身(当前用户更新自己信息，不需要鉴权)
 * @param user
 * @returns {Promise}
 */
export const updateSelf=(user)=>{
    return put('user/self/'+user.id,user,false,{token:getCookie('Authorization')});
}

/**
 * 删除用户
 * @param user
 * @returns {Promise<any>}
 */
export const del=(user)=>{
  return _del('user/'+user.id,false);
}

/**
 * 获取用户总数
 * @returns {Promise}
 */
export const count=()=>{
  return get('user/count',{},false);
}
