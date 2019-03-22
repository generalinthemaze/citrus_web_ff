import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/Login'
import Manage from '@/page/Manage'
import Explore from '@/page/Explore'
import FertAttrAnalysis from '@/page/FertAttrAnalysis'
import DiseasePestAttrAnalysis from '@/page/DiseasePestAttrAnalysis'
import FertSpatialAnalysis from '@/page/FertSpatialAnalysis'
import DiseasePestSpatialAnalysis from '@/page/DiseasePestSpatialAnalysis'
import FertAdvice from '@/page/FertAdvice'
import DiseasePestAdvice from '@/page/DiseasePestAdvice'
import FertSampleData from '@/page/FertSampleData'
import DiseasePestSampleData from '@/page/DiseasePestSampleData'
import CitrusData from '@/page/CitrusData'
import DiseaseData from '@/page/DiseaseData'
import PestData from '@/page/PestData'
import UserAdmin from '@/page/UserAdmin'
import UnitAdmin from '@/page/UnitAdmin'

Vue.use(Router)

export default new Router({
    // mode:'history',//去掉url路径中的"#"
    // bash:'/',
  routes: [
      {
          path: '/Login',
          name: 'Login',
          component: Login
      },
      {
          path:'/',
          name:'Manage',
          component:Manage,
          children:[
              {
                  path:'',
                  component:Explore,
                  meta:['总览']
              },
              {
                  path:'FertAttrAnalysis',
                  component:FertAttrAnalysis,
                  meta:['统计分析','施肥属性分析']
              },
              {
                  path:'DiseasePestAttrAnalysis',
                  component:DiseasePestAttrAnalysis,
                  meta:['统计分析','病虫害属性分析']
              },
              {
                  path:'FertSpatialAnalysis',
                  component:FertSpatialAnalysis,
                  meta:['空间分析','施肥空间分析']
              },
              {
                  path:'DiseasePestSpatialAnalysis',
                  component:DiseasePestSpatialAnalysis,
                  meta:['空间分析','病虫害空间分析']
              },
              {
                  path:'FertAdvice',
                  component:FertAdvice,
                  meta:['专业推荐','施肥推荐']
              },
              {
                  path:'DiseasePestAdvice',
                  component:DiseasePestAdvice,
                  meta:['专业推荐','病虫害防治']
              },
              {
                  path:'FertSampleData',
                  component:FertSampleData,
                  meta:['基础数据','施肥采样点']
              },
              {
                  path:'DiseasePestSampleData',
                  component:DiseasePestSampleData,
                  meta:['基础数据','病虫害采样点']
              },
              {
                  path:'CitrusData',
                  component:CitrusData,
                  meta:['基础数据','柑橘种类']
              },
              {
                  path:'DiseaseData',
                  component:DiseaseData,
                  meta:['基础数据','柑橘病害']
              },
              {
                  path:'PestData',
                  component:PestData,
                  meta:['基础数据','柑橘虫害']
              },
              {
                  path:'UserAdmin',
                  component:UserAdmin,
                  meta:['系统管理','用户管理']
              },
              {
                  path:'UnitAdmin',
                  component:UnitAdmin,
                  meta:['系统管理','组织管理']
              }
          ]
      }
  ]
})
