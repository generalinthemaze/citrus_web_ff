<!--施肥建议计算器-->
<template>
    <div>
        <Form label-position="right" :label-width="100">
            <FormItem label="养分元素">
                <Select v-model="nutrientType">
                    <Option v-for="item in nutrientTypes"
                            :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <Row :gutter="8">
                <i-col :sm="24" :lg="8">
                    <FormItem label="第一年年产量（吨/亩）">
                        <InputNumber v-model="firstYearOutput" placeholder="输入产量" min="0" style="min-width: 100%"/>
                    </FormItem>
                </i-col>
                <i-col :sm="24" :lg="8">
                    <FormItem label="第二年年产量（吨/亩）">
                        <InputNumber v-model="secondYearOutput" placeholder="输入产量" min="0" style="min-width: 100%"/>
                    </FormItem>
                </i-col>
                <i-col :sm="24" :lg="8">
                    <FormItem label="第三年年产量（吨/亩）">
                        <InputNumber v-model="thirdYearOutput" placeholder="输入产量" min="0" style="min-width: 100%"/>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="8">
                <i-col :sm="24" :lg="8">
                    <FormItem label="干果养分含量（%）">
                        <InputNumber v-model="dryFruitContent" placeholder="输入含量" min="0" max="100" style="min-width: 100%"/>
                    </FormItem>
                </i-col>
                <i-col :sm="24" :lg="8">
                    <FormItem label="果实含水量（%）">
                        <InputNumber v-model="fruitWaterContent" placeholder="输入含量" min="0" max="100" style="min-width: 100%"/>
                    </FormItem>
                </i-col>
                <i-col :sm="24" :lg="8">
                    <FormItem label="土壤实测速效养分含量（mg/Kg）">
                        <InputNumber v-model="solidContent" placeholder="输入含量" min="0" max="100" style="min-width: 100%"/>
                    </FormItem>
                </i-col>
            </Row>
        </Form>
        <Row type="flex" justify="center" v-if="output!==null">
            <i-col span="2">目标产量:</i-col>
            <i-col span="2"><CountTo :end="output"/></i-col>
            <i-col span="2">吨/亩</i-col>
        </Row>
        <Row type="flex" justify="center" v-if="minAmount!==null">
            <i-col span="3">{{nutrientType}}  施肥量为:</i-col>
            <i-col span="1"><CountTo :end="minAmount"/></i-col>
            <i-col span="1">至</i-col>
            <i-col span="1"><CountTo :end="maxAmount"/></i-col>
            <i-col span="2">千克/亩</i-col>
        </Row>
        <Row type="flex" justify="center" style="margin-top: 8px">
            <i-col span="8">
                <Button type="primary" :disabled="nutrientType==null" @click="calculate">
                    查询结果
                </Button>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import CountTo from "./CountTo";
    export default {
        name: "FertilizerCalculator",
        components: {CountTo},
        data(){
            return{
                nutrientType:null,
                nutrientTypes:[
                    {
                        value:'N',
                        label:'N',
                    },
                    {
                        value:'P',
                        label:'P',
                    },
                    {
                        value:'K',
                        label:'K',
                    },
                ],
                nutrientRates:{'N':0.16,"P":0.12,"K":0.24},//不同元素转换不同
                nutrientSections:{'N':{'max':200,'min':100},'P':{'max':80,'min':15},'K':{'max':200,'min':100}},
                firstYearOutput:0,
                secondYearOutput:0,
                thirdYearOutput:0,
                dryFruitContent:0,
                fruitWaterContent:0,
                solidContent:0,
                output:null,
                minAmount:null,
                maxAmount:null,
            }
        },
        methods:{
            calculate(){
                this.output=(this.firstYearOutput+this.secondYearOutput+this.thirdYearOutput)/3*1.2;
                let rate=this.nutrientRates[this.nutrientType];
                let min=this.nutrientSections[this.nutrientType].min;
                let max=this.nutrientSections[this.nutrientType].max;
                this.minAmount=this.output*rate*this.dryFruitContent*(1-this.fruitWaterContent/100)+0.15*(min-this.solidContent);
                this.maxAmount=this.output*rate*this.dryFruitContent*(1-this.fruitWaterContent/100)+0.15*(max-this.solidContent);
            }
        }
    }
</script>

<style scoped>

</style>