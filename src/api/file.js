import {get, post} from '../util/http'

const OSS = require('ali-oss');
const ENDPOINT = 'cdn.cfprt.net';
const BUCKET = 'hzau-citrus';

/*
获取上传所需Token
 */
function getToken() {
    return new Promise((resolve, reject) => {
        get('OSS_STS', {}, false)
            .then(response => {
                if (response.code === 0) {
                    resolve(response.data);
                } else {
                    reject("err,response code is " + response.code);
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

/*
将文件读取为base64
 */
function readFileAsBase64(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result.replace(/^data:\w+\/\w+;base64,/, ''))
        }
    })
}

/**
 * 向OSS上传文件
 * @param object_key
 * @param file
 * @param progress
 * @returns {Promise<*[]>}
 */
export function uploadFile(object_key, file, progress) {
    return Promise.all([readFileAsBase64(file), getToken()])
        .then(([base64, token]) => {
            let client = new OSS({
                endpoint: ENDPOINT,
                accessKeyId: token.accessKeyId,
                accessKeySecret: token.accessKeySecret,
                stsToken: token.securityToken,
                bucket: BUCKET,
                cname: true
            });
            return client.put(object_key, new OSS.Buffer(base64, 'base64'), {
                progress: progress,
                mime: file.type
            })
        });
}
