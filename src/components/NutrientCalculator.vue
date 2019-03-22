<!--养分丰缺计算器-->
<template>
    <div>
        <Form label-position="right" :label-width="100">
            <FormItem label="样本类型">
                <Select v-model="sampleType">
                    <Option v-for="item in sampleTypes"
                            :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="样本指标">
                <Select v-model="nutrientType">
                    <Option v-for="item in nutrientTypes"
                            :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="输入值">
                <InputNumber v-model="inputNutrient" placeholder="输入养分含量" style="min-width: 100%"/>
            </FormItem>
        </Form>
        <p style="text-align: center">{{result}}</p>
        <Row type="flex" justify="center" style="margin-top: 16px">
            <i-col span="8">
                <Button type="primary" :disabled="sampleType==null||nutrientType==null" @click="calculate">
                    开始计算
                </Button>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "NutrientCalculator",
        data(){
            return{
                sampleTypes:[
                    {
                        value:'solid',
                        label:'土壤',
                    },
                    {
                        value:'leaf',
                        label:'叶片',
                    },
                    {
                        value:'peel',
                        label:'果皮',
                    },
                    {
                        value:'pulp',
                        label:'果肉',
                    },
                    {
                        value:'fruit',
                        label:'果实',
                    }
                ],
                sampleType:null,
                nutrientTypes:[
                    {
                        value:'N',
                        label:'碱解氮(mg/kg)',
                    },
                    {
                        value:'P',
                        label:'速效磷(mg/kg)',
                    },
                    {
                        value:'K',
                        label:'速效钾(mg/kg)',
                    },
                    {
                        value:'Ca',
                        label:'有效钙(mg/kg)',
                    },
                    {
                        value:'Mg',
                        label:'有效镁(mg/kg)',
                    },
                    {
                        value:'Fe',
                        label:'有效铁(mg/kg)',
                    },
                    {
                        value:'Mn',
                        label:'有效锰(mg/kg)',
                    },
                    {
                        value:'Cu',
                        label:'有效铜(mg/kg)',
                    },
                    {
                        value:'Zn',
                        label:'有效锌(mg/kg)',
                    },
                    {
                        value:'B',
                        label:'有效硼(mg/kg)',
                    },
                    {
                        value:'Mo',
                        label:'有效钼(mg/kg)',
                    }
                ],
                nutrientType:null,
                inputNutrient:0,
                nutrientIndexes:{
                    'N':[50,100,200,10000,0],
                    'P':[5,15,80,10000,0],
                    'K':[50,100,200,10000,0],
                    'Ca':[200,1000,2000,3000,10000],
                    'Mg':[80,150,300,500,10000],
                    'Fe':[5,10,20,50,10000],
                    'Mn':[2,5,20,50,10000],
                    'Cu':[0.3,0.5,1,2,10000],
                    'Zn':[0.5,1,5,10,10000],
                    'B':[0,0.5,1,0,0],
                    'Mo':[0,0.05,0.2,0.3,10000]
                },
                resultTypes:[
                    '极缺','缺乏','适量','高量','过量'
                ],
                result:' ',
            }
        },
        methods:{
            calculate(){
                if (this.sampleType===null){
                    this.$Message.error("请选择样本类型");
                    return;
                }
                if (this.nutrientType===null) {
                    this.$Message.error("请选择样本指标");
                    return;
                }
                let index=this.nutrientIndexes[this.nutrientType];
                console.log(index);
                for(let i=0;i<5;i++){
                    console.log(this.inputNutrient,index[i]);
                    if(this.inputNutrient<index[i]){
                        this.result=this.resultTypes[i];
                        break;
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>