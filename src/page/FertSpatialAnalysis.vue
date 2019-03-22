<!--施肥空间分析-->
<template>
    <div>
        <div id="map" style="position: relative">
                    <div style="width:50%;position:absolute;z-index:200;margin:40px 5px 40px 30px;">
                        <Row :gutter="8" type="flex">
                            <i-col :span="6">
                                <Select v-model="currentFeature" @on-change="search" placeholder="选择插值属性">
                                    <Option v-for="item in featureOptions" :value="item.key" :key="item.key">
                                        {{item.value}}
                                    </Option>
                                </Select>
                            </i-col>
                            <i-col :span="2">
                                <Button @click="showSetting">参数设置</Button>
                            </i-col>
                        </Row>
                    </div>
                    <div style="position: absolute;bottom: 0;left: 0;
            width: 15%;z-index: 200;background-color: white"
                         :style="{height:20*scales.length+'px'}" v-if="canvasLayer!==null">
                        <div v-for="(item,index) in colorsReverse" style="width:100% ;height: 20px;">
                            <Row type="flex">
                                <i-col :span="10">
                                    <div :style="{backgroundColor:item}" style="width: 100%;height: 100%"></div>
                                </i-col>
                                <i-col :span="14">
                                    {{scales[colorsReverse.length-1-index][0]}}~{{scales[colorsReverse.length-1-index][1]}}
                                </i-col>
                            </Row>
                        </div>
                    </div>
                </div>
        <Modal
                v-model="krigingModalShow"
                title="插值预测结果"
                draggable>
            <p slot="footer"></p>
            <Tabs type="card">
                <TabPane label="结果概要">
                    <CellGroup>
                        <Cell title="插值属性" :extra="currentFeatureName" />
                        <Cell title="样本个数" :extra="''+selectedFeatures.array_.length" v-if="selectedFeatures!==null"/>
                        <Cell title="采样范围" :extra="currentBox" v-if="currentBox!==null"/>
                    </CellGroup>
                </TabPane>
                <TabPane label="采样点统计">
                    <div id = "sampleStatChart" style="width:480px; height:300px;"></div>
                </TabPane>
            </Tabs>
        </Modal>
        <Modal
            v-model="settingModalShow"
            title="参数设置"
            draggable>
            <p slot="footer"></p>
            <Alert show-icon closable>
                克里金插值
                <p slot="desc">也称作空间局部插值法，或空间自协方差最佳插值法，它以变异函数理论和结构分析为基础，
                    在特定区域内对区域化变量进行无偏最优估计，被广泛应用于土壤制图领域，是一种非常重要的地统计学方法。</p>
            </Alert>
            <Form>
                <FormItem label="Modal" label-position="left">
                    <Select v-model="krigingModel">
                        <Option value="gaussian">gaussian</Option>
                        <Option value="exponential">exponential</Option>
                        <Option value="spherical">spherical</Option>
                    </Select>
                </FormItem>
                <FormItem label="Sigma^2">
                    <InputNumber :min="0" :max="1" v-model="krigingSigma2"/>
                </FormItem>
                <FormItem label="Alpha">
                    <InputNumber :min="0" :max="10000" v-model="krigingAlpha"/>
                </FormItem>
                <FormItem label="图层透明度">
                    <Slider v-model="canvasAlpha" :min="0" :max="1" :step="0.05" style="margin-left: 80px"/>
                </FormItem>
            </Form>
            <div style="text-align: center">
                <Button type="primary" @click="saveSetting">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import Map from 'ol/map';
    import View from 'ol/view';
    import TileLayer from 'ol/layer/tile';
    import Image from 'ol/layer/image';
    import ImageCanvas from 'ol/source/imagecanvas';
    import XYZ from 'ol/source/xyz';
    import Style from 'ol/style/style';
    import Icon from 'ol/style/icon';
    import Stroke from 'ol/style/stroke';
    import SourceVector from 'ol/source/vector';
    import LayerVector from 'ol/layer/vector';
    import Overlay from 'ol/overlay';
    import GeoJSON from 'ol/format/geojson';
    import WFS from 'ol/format/wfs';
    //框选功能相关依赖 示例 https://openlayers.org/en/latest/examples/box-selection.html
    import Condition from 'ol/events/condition';
    import DragBox from 'ol/interaction/dragbox';
    import Select from 'ol/interaction/select';

    import kriging from '../util/kriging';
    const Rainbow=require('rainbowvis.js');
    import {propNames} from '../api/fertilizer_sample';
    import echarts from 'echarts';


    const mapMarker=require('../assets/map_marker_1.png');

    export default {
        name: "FertSpatialAnalysis",
        data(){
            return{
                baseLayer:null,
                annorLayer:null,
                map:null,
                mapWidth:null,
                WFSVectorLayer:null,
                WFSVectorSource:null,
                selectedFeatures:null,
                colors:["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf",
                    "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"],
                scales:[],//图示的值域划分
                extent:null,
                canvas:null,
                canvasAlpha:0.6,//克里金插值图层的透明度
                canvasLayer:null,
                currentFeature:'',
                currentBox:null,//当前框选采样点的经纬度范围
                krigingModalShow:false,//是否显示预测结果弹窗
                settingModalShow:false,//是否显示参数设置弹窗
                krigingModel:'exponential',//克里金插值参数
                krigingSigma2:0,//克里金插值参数
                krigingAlpha:100,//克里金插值参数
            }
        },
        methods:{
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
                //--------------采样点样式设置----------------
                this.WFSVectorSource = new SourceVector();
                this.WFSVectorLayer = new LayerVector({
                    source: this.WFSVectorSource,
                    style: new Style({
                        image: new Icon({
                            anchor:[0.5,1],
                            anchorXUnits:'fraction',
                            anchorYUnits:'fraction',
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

                let select = new Select();
                this.map.addInteraction(select);
                let dragBox = new DragBox({
                    condition: Condition.platformModifierKeyOnly
                });
                this.map.addInteraction(dragBox);

                this.selectedFeatures = select.getFeatures();

                dragBox.on('boxend', ()=>{
                    if (this.currentFeature===''){//未选择插值属性
                        this.$Message.error("请先选择插值属性");
                        return;
                    }
                    let extent = dragBox.getGeometry().getExtent();//extend=[115, 26, 117, 27]
                    this.WFSVectorSource.forEachFeatureIntersectingExtent(extent, (feature)=> {
                        this.selectedFeatures.push(feature);
                    });
                    this.extent=extent;
                    this.drawKriging(extent);
                    this.drawSampleStatChart();
                });
                dragBox.on('boxstart', ()=>{
                    this.selectedFeatures.clear();
                });
            },
            search(){
                if (this.WFSVectorLayer != null) {
                    this.WFSVectorSource.clear();
                }
                if (this.canvasLayer !== null){
                    this.map.removeLayer(this.canvasLayer);
                    this.canvasLayer=null;
                }
                let  url = 'http://geoserver.cfprt.net/geoserver/citrus/ows?service=WFS&version=1.0.0' +
                    '&request=GetFeature&typeName=citrus:t_sample_fertilizer&maxFeatures=2000' +
                    '&outputFormat=application/json&srs=EPSG:4326';
                fetch (url).then ((response)=> {
                    return response.json();
                }).then ((json)=> {
                    let features = new GeoJSON().readFeatures(json);
                    features.forEach(feature=>{
                        //筛选当前属性不为空的采样点
                        if (this.currentFeature!==''){
                            if (feature.values_[this.currentFeature]!==null){
                                this.WFSVectorSource.addFeature(feature);
                            }
                        } else{
                            this.WFSVectorSource.addFeature(feature);
                        }
                    })
                })
            },
            drawKriging(extent){
                console.log('drawKriging');
                let values=[],lngs=[],lats=[];
                this.selectedFeatures.forEach(feature=>{
                    if (feature.values_[this.currentFeature]!==null){
                        //用于插值的数值来自于采样点的一个用户选择的属性
                        values.push(feature.values_[this.currentFeature]);
                        lngs.push(feature.values_.lng);
                        lats.push(feature.values_.lat);
                    }
                });
                if (values.length>3){
                    let variogram=kriging.train(values,lngs,lats,
                        this.krigingModel,this.krigingSigma2,this.krigingAlpha);
                    console.log('variogram:',variogram);

                    let step=(variogram.t.max()-variogram.t.min())/this.colors.length;
                    let start=variogram.t.min();
                    this.scales=[];
                    for (let i=0;i<this.colors.length;i++){
                        let lmin=start+i*step;
                        let lmax=start+i*step+step;
                        this.scales.push([lmin<10?lmin.toFixed(2):Math.round(lmin),
                            lmax<10?lmax.toFixed(2):Math.round(lmax)]);
                    }

                    let polygons=[];
                    polygons.push([[extent[0],extent[1]],[extent[0],extent[3]],
                        [extent[2],extent[3]],[extent[2],extent[1]]]);
                    let grid=kriging.grid(polygons,variogram,(extent[2]-extent[0])/200);
                    //console.log('grid:',grid);

                    console.log('dragbox extent:',extent);
                    let dragboxExtent=extent;
                    //移除已有图层
                    if (this.canvasLayer !== null){
                        this.map.removeLayer(this.canvasLayer);
                    }
                    //创建新图层
                    this.canvasLayer=new Image({
                        source: new ImageCanvas({
                            canvasFunction:(extent, resolution, pixelRatio, size, projection) =>{
                                //extent=>projection?
                                let canvas = document.createElement('canvas');
                                canvas.width = size[0];
                                canvas.height = size[1];
                                canvas.style.display='block';
                                canvas.getContext('2d').globalAlpha=this.canvasAlpha;//设置canvas透明度

                                //注：如果浏览器在当前路由/#/FertSpatialAnalysis下刷新页面，
                                // 将导致当前routerview与父布局错位，使得dragbox框选区域与canvas绘制区域不完全一致,具体原因未知，trojx
                                console.log('canvas extent:',extent);

                                //使用渐变色彩渲染
                                // let rainbow=new Rainbow();
                                // rainbow.setNumberRange(0,1);
                                // kriging.plot_rainbow(canvas,grid,[extent[0],extent[2]],[extent[1],extent[3]],rainbow);

                                //使用分层设色渲染
                                kriging.plot(canvas,grid,
                                    [extent[0],extent[2]],[extent[1],extent[3]],this.colors);

                                return canvas;
                            },
                            projection: 'EPSG:4326'
                        })
                    })
                    //向map添加图层
                    this.map.addLayer(this.canvasLayer);
                    //显示结果弹窗
                    this.krigingModalShow=true;
                }else {
                    this.$Message.error("有效样点个数不足，无法插值");
                }
                this.currentBox=extent.flatMap(e=>{
                    return e.toFixed(2);
                }).toString();
            },
            drawSampleStatChart(){
                let sampleStatChart = document.getElementById('sampleStatChart');
                let chartOption = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:[this.currentFeatureName],
                        x:5,
                        y:10
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : true,
                            data:this.selectedFeatures.array_.flatMap(f=>{
                                return f.values_.sample_id;
                            })
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
                            name:this.currentFeatureName,
                            type:'bar',
                            data:this.selectedFeatures.array_.flatMap(f=>{
                                return f.values_[this.currentFeature];
                            }),
                            markLine :false
                        }
                    ]
                };
                let chart = echarts.init(sampleStatChart);
                chart.setOption(chartOption);
            },
            showSetting(){
                this.settingModalShow=true;
            },
            saveSetting(){
                this.settingModalShow=false;
                this.drawKriging(this.extent);
            },
            showNotice(){
                this.$Notice.info({
                    title: '操作提示',
                    desc:'按住Ctrl键，使用鼠标框选采样点'
                });
            }
        },
        mounted(){
            this.drawMap();
            this.search();
            this.showNotice();
        },
        computed:{
            /**
             * @description 可以选择的采样点属性选项
             * @returns {Array}
             */
            featureOptions(){
                let options=[];
                let excludeProps=['sample_id','province','location','time','species_id','lng','lat',
                'survey_inquirer','survey_unit','survey_suite'];
                for(let p in propNames){
                    //排除不可用于插值分析的非数值属性
                    if (!excludeProps.includes(p)){
                        options.push({
                            key:p,
                            value:propNames[p],
                        })
                    }
                }
                return options;
            },
            /**
             * @description 分层设色的色谱的逆序数组，用于顺序渲染比色卡项
             * @returns {Array}
             */
            colorsReverse(){
                let colors=[];
                for (let i=this.colors.length-1;i>=0;i--){
                    colors.push(this.colors[i]);
                }
                return colors;
            },
            /**
             * @description 当前选择的采样点属性的中文名称，根据选择的属性而定
             * @returns {string}
             */
            currentFeatureName(){
                if (this.currentFeature===''){
                    return ''
                } else {
                    let name='';
                    this.featureOptions.forEach(o=>{
                        if (o.key===this.currentFeature) {
                            name=o.value;
                        }
                    })
                    return name;
                }
            }
        }
    }
</script>

<style scoped>

</style>