import {get,post,put,_del} from '../util/http'

/**
 * 获取采样点列表
 * @param page
 * @param size
 * @param sort
 * @returns {Promise}
 */
export const getList=(page,size=10,sort='')=>{
    return get('fertilizerSample',{page:page,size:size,sort:sort},false);
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
export const search=(sampleId,province,location,page,size=10,sort='')=>{
    console.log(sampleId, province, location);
    return get('fertilizerSample/search',{sampleId:sampleId,province:province,location:location,
        page:page,size:size,sort:sort},false);
}

/**
 * 添加采样点
 * @param fertilizerSample
 * @returns {Promise}
 */
export const add=(fertilizerSample)=>{
    return post('fertilizerSample',fertilizerSample,true);
}

/**
 * 更新采样点
 * @param fertilizerSample
 * @returns {Promise}
 */
export const update=(fertilizerSample)=>{
    return put('fertilizerSample/'+fertilizerSample.id,fertilizerSample,true);
}

/**
 * 删除采样点
 * @param fertilizerSample
 * @returns {Promise<any>}
 */
export const del=(fertilizerSample)=>{
    return _del('fertilizerSample/'+fertilizerSample.id,false);
}

/**
 * 获取数据总数
 * @returns {Promise}
 */
export const count=()=>{
    return get('fertilizerSample/count',{},false);
}

/**
 * 属性-中文名
 * @type {{}}
 */
export const propNames={
    'sample_id': '样本编号',
    'province': '省',
    'location': '地址',
    'time': '采样时间',
    'species_id': '品种编号',
    'lng': '经度',
    'lat': '纬度',
    'weight_single': '单果重量',
    'shape_index': '果形指数',
    'edible_rate': '可食率',
    'ta': '可滴定酸',
    'ssc': '可溶性固形物',
    'sar': '固酸比',
    'vc': 'VC含量',
    'solid_n': '土壤碱解氮',
    'solid_p': '土壤有效磷',
    'solid_k': '土壤速效钾',
    'solid_mg': '土壤交换性镁',
    'solid_ca': '土壤交换性钙',
    'solid_fe': '土壤有效铁',
    'solid_mn': '土壤有效锰',
    'solid_cu': '土壤有效铜',
    'solid_zn': '土壤有效锌',
    'solid_b': '土壤水溶态硼',
    'solid_mo': '土壤有效钼',
    'solid_ph': '土壤pH',
    'solid_organic': '土壤有机质',
    'leaf_n': '叶片氮',
    'leaf_p': '叶片磷',
    'leaf_k': '叶片钾',
    'leaf_ca': '叶片镁',
    'leaf_mg': '叶片钙',
    'leaf_fe': '叶片铁',
    'leaf_mn': '叶片锰',
    'leaf_cu': '叶片铜',
    'leaf_zn': '叶片锌',
    'leaf_b': '叶片硼',
    'leaf_mo': '叶片钼',
    'peel_n': '果皮氮',
    'peel_p': '果皮磷',
    'peel_k': '果皮钾',
    'peel_ca': '果皮镁',
    'peel_mg': '果皮钙',
    'peel_fe': '果皮铁',
    'peel_mn': '果皮锰',
    'peel_cu': '果皮铜',
    'peel_zn': '果皮锌',
    'peel_b': '果皮硼',
    'peel_mo': '果皮钼',
    'pulp_n': '果肉氮',
    'pulp_p': '果肉磷',
    'pulp_k': '果肉钾',
    'pulp_ca': '果肉镁',
    'pulp_mg': '果肉钙',
    'pulp_fe': '果肉铁',
    'pulp_mn': '果肉锰',
    'pulp_cu': '果肉铜',
    'pulp_zn': '果肉锌',
    'pulp_b': '果肉硼',
    'pulp_mo': '果肉钼',
    'fruit_n': '果实氮',
    'fruit_p': '果实磷',
    'fruit_k': '果实钾',
    'fruit_ca': '果实镁',
    'fruit_mg': '果实钙',
    'fruit_fe': '果实铁',
    'fruit_mn': '果实锰',
    'fruit_cu': '果实铜',
    'fruit_zn': '果实锌',
    'fruit_b': '果实硼',
    'fruit_mo': '果实钼',
    'survey_inquirer': '调查人',
    'survey_unit': '调查单位',
    'survey_suite': '随同调查人',
}