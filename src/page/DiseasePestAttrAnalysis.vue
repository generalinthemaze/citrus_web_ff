<!--病虫害属性分析-->
<template>
    <div id="map">
        <div id="popup" class="ol-popup" style="padding: 0;">
            <div class="pophead" style="width:100%; height: 40px; background-color:#DCDBDC;">
                <div id="popup-title" style="font:bold 15px sans-serif;align:left;position: absolute;top: 6px;left: 8px;color: #000000">采样点信息</div>
                <a href="#" id="popup-closer" class="ol-popup-closer" style="color:#8e908c;"></a>
            </div>
            <div id="popup-content" style="padding: 10px"></div>
        </div>
        <div style="width:600px;position:absolute;z-index:200;padding:40px 5px 40px 30px;">
            <Row>
                <i-col span="4">
                    <span style="font-size:17px;text-align: center;"><b>柑橘病害：</b></span>
                </i-col>
                <i-col span="7" style="padding-right: 10px;" >
                    <Select v-model="diseaseName" filterable >
                        <Option v-for ="item in disease_data" :value="item.chsName" :key="item.id">{{item.chsName}}</Option>
                    </Select>
                </i-col>
                <i-col span="4">
                    <span style="font-size:17px;text-align: center;"><b>柑橘虫害：</b></span>
                </i-col>
                <i-col span="7">
                    <Select v-model="pestName" style="padding-right: 20px;" filterable >
                        <Option v-for = "item in pest_data" :value="item.chsName" :key="item.id">{{item.chsName}}</Option>
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

    const mapMarker=require('../assets/map_marker_1.png');

    import {getList as getDiseaseList,count as countDisease} from "../api/disease";
    import {getList as getPestList,count as countPest} from "../api/pest";

    export default {
        name: "DiseasePestAttrAnalysis",
        data() {
            return{
                diseaseName:'',
                pestName:'',
                baseLayer:null,
                annorLayer:null,
                map:null,
                WFSVectorLayer:null,
                WFSVectorSource:null,
                popUpOverlay:null,
                pointdata:'',
                disease_data:[{id:'0',chsName:'全部'},],//全部病害数据
                pest_data:[{id:'0',chsName:'全部'},],//全部虫害数据
            }
        },
        mounted() {
            this.drawMap();
            this.getDiseaseData();
            this.getPestData();
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
                let pop_content = document.getElementById('popup-content');
                let pop_closer = document.getElementById('popup-closer');
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
                    //---判断当前单击处是否有要素，捕获到要素时弹出Popup
                    let feature = this.map.forEachFeatureAtPixel(evt.pixel,  (feature)=> {
                        return feature;
                    });
                    if (feature) {
                        let keys = feature.getKeys();
                        let properties = feature.getProperties();
                        pop_content.innerHTML = '';
                        //采样点属性数据
                        let pointdata = new Array( );
                        for(let i = 0; i < keys.length; i++){
                            pointdata[i] = [[keys[i]],[properties[keys[i]]]];
                        }
                        //------------------全部点出现后面字段数值错误------------------------------
                        pop_content.innerHTML= "<table >" +
                            "<tr>" +
                            "<td  width ='80px' align='left'><b>采样点编号： </b></td>" +
                            "<td width ='160px' align='left'> " + pointdata[1][1] + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td  width='80px' align='left'><b>柑橘品种： </b></td>" +
                            "<td width ='160px' align='left'> " + pointdata[6][1] + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td  width='80px' align='left'><b>采样地点： </b></td>" +
                            "<td width ='160px' align='left'> " + pointdata[4][1] + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td  width='80px' align='left'><b>采样时间： </b></td>" +
                            "<td width ='160px' align='left'> " + pointdata[5][1] + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td  width='80px' align='left'><b>灾情级别： </b></td>" +
                            "<td width ='160px' align='left'> " + pointdata[9][1] + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td  width='80px' align='left'><b>发生病害： </b></td>" +
                            "<td width ='160px' align='left'> " + pointdata[13][1] + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td  width='80px' align='left'><b>发生虫害： </b></td>" +
                            "<td width ='160px' align='left'> " + pointdata[14][1] + "</td>" +
                            "</tr>" +
                            "</table>";
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
                if (this.diseaseName == null || this.pestName === '') {
                    this.$Message.error("请输入搜索关键字！");
                    return;
                }
                if(this.diseaseName === '全部' && this.pestName === '全部'){
                    let  url = 'http://geoserver.cfprt.net/geoserver/citrus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=citrus:pest&outputFormat=application/json&srsname=EPSG:4326';
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
                        featureTypes: ['pest1'],       //图层名
                        outputFormat: 'application/json',
                        filter: Filter.or(
                            Filter.like('病害类型', '*' + '%' + this.diseaseName + '%'),
                            Filter.like('虫害类型', '*' + '%' + this.pestName + '%'),
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
            getDiseaseData(){
                countDisease().then(resp=>{
                    if (resp.code===0){
                        return resp.data;
                    }else{
                        reject(resp.code);
                    }}).then(count=>{
                    getDiseaseList(0,count).then(resp=>{
                        if (resp.code===0){
                            this.disease_data.push(...resp.data);
                        } else{
                            reject(resp.code);
                        }
                    })
                }).catch(err=>{
                    console.err('getDiseaseData',err);
                })
            },
            getPestData(){
                countPest().then(resp=>{
                    if (resp.code===0){
                        return resp.data;
                    }else{
                        reject(resp.code);
                    }}).then(count=>{
                    getPestList(0,count).then(resp=>{
                        if (resp.code===0){
                            this.pest_data.push(...resp.data);
                        } else{
                            reject(resp.code);
                        }
                    })
                }).catch(err=>{
                    console.err('getPestData',err);
                })
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
        min-width:320px;
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