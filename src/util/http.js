import axios from 'axios'
import {getCookie} from './util'

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://citrus.cfprt.net/'; //这是调用数据接口

// http request 拦截器，通过这个，我们就可以把Cookie传到后台
// axios.interceptors.request.use(
//     config => {
//         const token = getCookie('Authorization'); //获取Cookie
//         config.data = JSON.stringify(config.data);
//         config.headers = {
//             'Content-Type':'application/json',
//         };
//         if (token!=null){
//             config.headers['Authorization']=token
//         }
//         console.log(config.headers.toString());
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     }
// );


// http response 拦截器
axios.interceptors.response.use(
    response => {
        if(response.data.code !== 0) {
            // console.error(response.data);
        }
        return response;
    },
    error => {
        return Promise.reject(error)
    });

export default axios;

/**
 * get 请求方法
 * @param url
 * @param params
 * @param token 是否需要带上token
 * @returns {Promise}
 */
export function get(url, params = {},token=false) {
    let headers={};
    headers['Content-Type']= 'application/json';
    if (token){
        headers['Authorization']=getCookie('Authorization');
    }
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
            headers:headers
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @param token 是否需要带上token
 * @returns {Promise}
 */
export function post(url, data = {},token=false) {
    let headers={};
    headers['Content-Type']= 'application/json';
    if (token){
        headers['Authorization']=getCookie('Authorization');
    }
    return new Promise((resolve, reject) => {
        axios.post(url, data,{headers:headers})
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @param token 是否需要带上token
 * @returns {Promise}
 */
export function patch(url, data = {},token=false) {
    let headers={};
    headers['Content-Type']= 'application/json';
    if (token){
        headers['Authorization']=getCookie('Authorization');
    }
    return new Promise((resolve, reject) => {
        axios.patch(url, data,{headers:headers})
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @param token 是否需要带上token
 * @param headers
 * @returns {Promise}
 */
export function put(url, data = {},token=false,headers={}) {
    headers['Content-Type']= 'application/json';
    if (token){
        headers['Authorization']=getCookie('Authorization');
    }
    return new Promise((resolve, reject) => {
        axios.put(url, data,{headers:headers})
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}

/**
 * delete 方法封装
 * @param url
 * @param params
 * @param token
 * @returns {Promise<any>}
 */
export function _del(url, params = {}, token = false) {
    let headers = {};
    headers['Content-Type'] = 'application/json';
    if (token) {
        headers['Authorization'] = getCookie('Authorization');
    }
    return new Promise((resolve, reject) => {
        axios.delete(url, {
            params: params,
            headers: headers
        }).then(response => {
            resolve(response.data);
        }, err => {
            reject(err);
        })
    })
}