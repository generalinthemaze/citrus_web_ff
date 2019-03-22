<!--病虫害空间分析-->
<template>
    <div id="map">
        <Row style="position:absolute;top:50px;left:80px;height:100px;z-index:200;border: none; padding: 1em;">
            <i-col span ="11">
                <Input v-model="distance" size="small" placeholder="缓冲距离：km"/>
            </i-col>
            <i-col span ="2" offset ="2">
                <Button type="primary" size="small" @click="buffering">缓冲区分析</Button>
            </i-col>
            <i-col span ="2" offset="6" >
                <Button type="primary" size="small" @click="heatmap">热点图</Button>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import Map from 'ol/map';
    import View from 'ol/view';
    import TileLayer from 'ol/layer/tile';
    import XYZ from 'ol/source/xyz';
    import LayerVector from 'ol/layer/vector';
    import SourceVector from 'ol/source/vector';
    import Geojson from 'ol/format/geojson';
    import Style from 'ol/style/style';
    import Icon from 'ol/style/icon';
    import Stroke from 'ol/style/stroke';
    import Fill from 'ol/style/fill';
    import Heatmap from 'ol/layer/heatmap';
    import * as turf from "@turf/turf";

    const mapMarker=require('../assets/map_marker_1.png');

    export default {
        name: "DiseasePestSpatialAnalysis",
        data(){
            return{
                distance:'',
                baselayer:null,
                annorlayer:null,
                map:null,
                pt:null,
                ptsource:null,
                ptvector:null,
                buffervector:null,
                buffersource:null,
                heatvector:null,
            }
        },
        mounted(){
            this.drawMap();
        },
        methods:{
            drawMap() {
                //-------------设置地图底图-------------
                this.baselayer = new TileLayer({
                    title: "天地图路网",
                    source: new XYZ({
                        url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}'
                    })
                });
                this.annorlayer = new TileLayer({
                    title: "天地图文字标注",
                    source: new XYZ({
                        url: 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
                    })
                });
                this.map = new Map({
                    target: 'map',
                    layers: [this.baselayer, this.annorlayer],
                    view: new View({
                        center: [114.31, 26.65],
                        projection: 'EPSG:4326',
                        zoom: 6
                    })
                });

                //-----------------添加所有采样点数据-------------------
                this.ptsource = new SourceVector();
                this.buffersource = new SourceVector();
                let url = 'http://geoserver.cfprt.net/geoserver/citrus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=citrus:pest&outputFormat=application/json&srsname=EPSG:4326';
                fetch(url).then((response) => {
                    return response.json();
                }).then((json) => {
                    let format = new Geojson();
                    let features = format.readFeatures(json);
                    console.log(features);
                    this.ptsource.addFeatures(features);
                    this.pt = format.writeFeaturesObject(features);
                    console.log(this.pt);
                });
                //-----------------缓冲区图层----------------
                this.buffervector = new LayerVector({
                    source: this.buffersource,
                    style: new Style({
                        stroke: new Stroke({
                            color: '#cf5a34',
                            width: 1
                        }),
                        fill: new Fill({
                            color: '#cf5a34'
                        })
                    }),
                    opacity: 0.5,
                });
                this.map.addLayer(this.buffervector);
                //----------------叠加采样点图层-------------------
                this.ptvector = new LayerVector({
                    source: this.ptsource,
                    style: new Style({
                        image: new Icon({
                            //图标偏移
                            anchor:[0.5,100],
                            anchorXUnits:'fraction',
                            anchorYUnits:'pixels',
                            //图标缩放比例
                            scale:0.07,
                            src:mapMarker
                        })
                    })
                });
                this.map.addLayer(this.ptvector);
            },

            buffering(){
                if(this.heatvector != null){
                    this.map.removeLayer(this.heatvector);
                }
                if (this.buffersource != null) {
                    this.buffersource.clear();
                }
                let buffer = turf.buffer(this.pt, this.distance, {units: 'kilometers'});
                let buffered = new Geojson().readFeatures(buffer);
                this.buffersource.addFeatures(buffered);
            },
            heatmap(){
                if (this.buffersource != null) {
                    this.buffersource.clear();
                }
                this.heatvector = new Heatmap({
                    source: this.ptsource,
                    radius: 30,
                    blur: 40,
                });
                this.map.addLayer(this.heatvector);
            }
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

</style>
