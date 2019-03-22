<!--施肥属性分析-->
<template>
    <div id="map">
        <div id="popup" class="ol-popup" style="width:500px; padding: 0;">
            <div class="pophead" style="width:500px; height: 30px; background-color:#DCDBDC;">
                <div id="popup-title" style="font:bold 15px sans-serif;align:left;position: absolute;top: 6px;left: 8px;color: #000000">采样点信息</div>
                <a href="#" id="popup-closer" class="ol-popup-closer" style="color:#8e908c;"></a>
            </div>
            <div id="popup-content" style="padding: 0px; width:100%;">
                <div id = "echartsdata" style="width:500px; height:300px;"></div>
            </div>
        </div>
        <div style="width:600px;position:absolute;z-index:200;padding:40px 5px 40px 30px;">
            <Row>
                <i-col span="4">
                    <span style="font-size:17px;text-align: center;"><b>省份：</b></span>
                </i-col>
                <i-col span="7" style="padding-right: 10px;" >
                    <Select v-model="provinceName" filterable >
                        <Option v-for ="item in provinceList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </i-col>
                <i-col span="4">
                    <span style="font-size:17px;text-align: center;"><b>柑橘品种：</b></span>
                </i-col>
                <i-col span="7">
                    <Select v-model="orangeName" style="padding-right: 20px;" filterable >
                        <Option v-for = "item in orangeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </i-col>
                <i-col span="2">
                    <Button type="primary"  @click="search">搜索</Button>
                </i-col>
            </Row>
        </div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import Map from 'ol/map';
    import View from 'ol/view';
    import TileLayer from 'ol/layer/tile';
    import XYZ from 'ol/source/xyz';
    import Style from 'ol/style/style';
    import Icon from 'ol/style/icon';
    import Stroke from 'ol/style/stroke';
    import SourceVector from 'ol/source/vector';
    import LayerVector from 'ol/layer/vector';
    import Overlay from 'ol/overlay';
    import Filter from 'ol/format/filter';
    import GeoJSON from 'ol/format/geojson';
    import WFS from 'ol/format/wfs';

    import echarts from 'echarts';




    const mapMarker=require('../assets/map_marker_1.png');

    export default {
        name: "FertAttrAnalysis",
        data() {
            return{
                provinceList:[
                    {
                        value:'全部',
                        label:'全部',
                    },
                    {
                        value:'广西壮族自治区',
                        label:'广西壮族自治区',
                    },
                    {
                        value:'广东省',
                        label:'广东省',
                    },
                    {
                        value:'四川省',
                        label:'四川省',
                    },
                    {
                        value:'陕西省',
                        label:'陕西省',
                    },
                    {
                        value:'湖北省',
                        label:'湖北省',
                    },
                    {
                        value:'重庆市',
                        label:'重庆市',
                    },
                    {
                        value:'湖南省',
                        label:'湖南省',
                    },
                    {
                        value:'江西省',
                        label:'江西省',
                    },
                    {
                        value:'福建省',
                        label:'福建省',
                    }
                ],
                orangeList:[
                    {
                        value:'全部',
                        label:'全部',
                    },
                    {
                        value:'宽皮柑橘',
                        label:'宽皮柑橘',
                    },
                    {
                        value:'甜橙',
                        label:'甜橙',
                    },
                    {
                        value:'柚',
                        label:'柚',
                    },
                    {
                        value:'柠檬',
                        label:'柠檬',
                    },
                    {
                        value:'桔',
                        label:'桔',
                    },
                ],
                provinceName:'',
                orangeName:'',
                baseLayer:null,
                annorLayer:null,
                map:null,
                WFSVectorLayer:null,
                WFSVectorSource:null,
                popUpOverlay:null,
            }
        },
        mounted() {
            this.drawMap();
        },
        methods: {
            drawMap(){
                //-----------加载天地图底图------------
                this.baseLayer = new TileLayer({
                    title: "天地图路网",
                    source: new XYZ({
                        url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}'
                    })
                });
                this.annorLayer = new TileLayer({
                    title: "天地图文字标注",
                    source: new XYZ({
                        url: 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
                    })
                });
                this.map = new Map({
                    target: 'map',
                    layers: [this.baseLayer, this.annorLayer],
                    view: new View({
                        center: [114.31, 30.65],
                        projection: 'EPSG:4326',
                        zoom: 6
                    })
                });

                //-----------------------弹出框设置--------------------
                let pop_container = document.getElementById('popup');
                let pop_closer = document.getElementById('popup-closer');
                let echartsdata = document.getElementById('echartsdata');
                this.popUpOverlay = new Overlay({
                    //设置弹出框的容器
                    element: pop_container,
                    //是否自动平移，加入标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
                    autoPan: true,
                    positioning:'bottom-center',
                    stopEvent:false,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                pop_closer.onclick = ()=> {
                    this.popUpOverlay.setPosition(undefined);
                    pop_closer.blur();
                    return false;
                };
                //--------------------地图点击事件-------------------
                this.map.on('click', (evt)=> {
                    let coordinate = evt.coordinate;
                    //---判断当前单击处是否有要素，捕获到要素时弹出Popup，pointfeature转化成全局变量
                    //不需要转化为全局变量，直接把properties转化为局部变量soliddata和leafdata供echarts显示即可  ，trojx
                    let feature = this.map.forEachFeatureAtPixel(evt.pixel,  (feature)=> {
                         return feature;
                    });
                    if (feature) {
                        let properties = feature.getProperties();
                        //console.log(keys);
                        //console.log(properties);

                        let soliddata=[properties.solid_n,properties.solid_p,properties.solid_k,properties.solid_ca,
                        properties.solid_mg,properties.solid_fe,properties.solid_mn,properties.solid_cu,
                        properties.solid_b,properties.solid_mo];

                        let leafdata=[properties.leaf_n,properties.leaf_p,properties.leaf_k,properties.leaf_ca,
                            properties.leaf_mg,properties.leaf_fe,properties.leaf_mn,properties.leaf_cu,
                            properties.leaf_b,properties.leaf_mo];

                        //----图表展示----

                        let  echartOption = {
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:['土壤','叶片'],
                                x:5,
                                y:10
                            },
                            toolbox: {
                                show : true,
                                feature : {
                                    dataView : {show: true, readOnly: false},
                                    magicType : {show: true, type: ['bar']},//用柱状图显示土壤、叶片元素含量
                                    restore : {show: true},
                                }
                            },
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : true,
                                    data : ['N','P','K','Ca','Mg','Fe','Mn','Cu','B','Mo']
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    axisLabel : {
                                        formatter: function (value,index) {
                                            return value;
                                        }
                                    }
                                }
                            ],
                            series : [
                                {
                                    name:'土壤',
                                    type:'bar',
                                    data:soliddata,
                                    markLine : false
                                },
                                {
                                    name:'叶片',
                                    type:'bar',
                                    data:leafdata,
                                    markLine :false

                                }
                            ]
                        };
                        let orangechart = echarts.init(echartsdata);
                        orangechart.setOption(echartOption);


                        //设置overlay的显示位置
                        this.popUpOverlay.setPosition(coordinate);
                        //显示overlay
                        this.map.addOverlay(this.popUpOverlay);
                    }
                });
                this.map.on('pointermove',(e)=>{
                    let pixel = this.map.getEventPixel(e.originalEvent);
                    let hit = this.map.hasFeatureAtPixel(pixel);
                    this.map.getTargetElement().style.cursor = hit ? 'pointer':'';
                });

                //--------------采样点样式设置----------------
                this.WFSVectorSource = new SourceVector();
                this.WFSVectorLayer = new LayerVector({
                    source: this.WFSVectorSource,
                    style: new Style({
                        image: new Icon({
                            anchor:[0.5,0],
                            anchorXUnits:'fraction',
                            anchorYUnits:'pixels',
                            scale:0.1,
                            src:mapMarker
                        }),
                        stroke: new Stroke({
                            color: '#0000ff',
                            width: 2
                        })
                    })
                });
                //---------传入空的图层----------
                this.map.addLayer(this.WFSVectorLayer);
            },

            search(){
                if (this.WFSVectorLayer != null) {
                    this.WFSVectorSource.clear();
                }
                if (this.provinceName == null || this.orangeName === '') {
                    this.$Message.error("请输入搜索关键字！");
                    return;
                }
                if(this.provinceName === '全部' && this.orangeName === '全部'){
                    let  url = 'http://geoserver.cfprt.net/geoserver/citrus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=citrus:t_sample_fertilizer&maxFeatures=2000&outputFormat=application/json&srs=EPSG:4326';
                    fetch (url).then ((response)=> {
                        return response.json();
                    }).then ((json)=> {
                        let features = new GeoJSON().readFeatures(json);
                        this.WFSVectorSource.addFeatures(features);
                    })
                }else{
                    //-------------根据关键字发出请求------------------
                    let featureRequest = new WFS().writeGetFeature({
                        srsName: 'EPSG:4326',
                        featureNS: 'localhost:8089/citrus',    //命名空间
                        featurePrefix: 'citrus',               //工作区域
                        featureTypes: ['t_sample_fertilizer'],       //图层名
                        outputFormat: 'application/json',
                        filter: Filter.or(
                            Filter.like('province', '*' + '%' + this.provinceName + '%'),
                            Filter.like('species_id', '*' + '%' + this.orangeName + '%'),
                        )
                    });

                    // -----------------返回请求并添加要素到图层中-----------------
                    fetch('http://geoserver.cfprt.net/geoserver/wfs', {
                        method: 'POST',
                        body: new XMLSerializer().serializeToString(featureRequest)
                    }).then( (response)=> {
                        return response.json();
                    }).then( (json)=> {
                        let features = new GeoJSON().readFeatures(json);
                        if (features.length === 0) {
                            this.$Message.error("未找到该种类型");
                            return;
                        }
                        this.WFSVectorSource.addFeatures(features);
                    });
                }

            },
        }
    }

</script>

<style scoped>
    #map {
        width:100%;
        height:100%;
        position:absolute;
        overflow:hidden;
    }
    li{
        list-style:none;
        float: left;
        margin-left:10px;
    }

    .ol-popup {
        position: absolute;
        background-color: #eeeeee;
        -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
    }
    .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    .ol-popup:after {
        border-top-color: #eeeeee;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }
    .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }
    .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 8px;
        right: 8px;
    }
    .ol-popup-closer:after {
        content: "✖";
    }
</style>
