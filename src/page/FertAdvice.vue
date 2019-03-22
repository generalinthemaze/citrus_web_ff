<!--施肥推荐-->
<template>
    <div style="background-color: #f5f7f9;min-height: 600px">
        <Row :gutter="16">
            <i-col :sm="24" :lg="8">
                <Card>
                    <p slot="title">养分丰缺计算器</p>
                    <Alert show-icon closable>
                        丰缺计算
                        <p slot="desc">柑橘的营养丰缺计算对柑橘生产来说具有重要的意义，通过柑橘营养诊断可以判断柑橘生产发育情况。利用生物、化学这两个方法，来研究影响植物正常生长发育的营养元素丰缺并协调。</p>
                    </Alert>
                    <NutrientCalculator/>
                </Card>
            </i-col>
            <i-col :sm="24" :lg="16">
                <Card>
                    <p slot="title">推荐施肥计算器</p>
                    <Alert show-icon closable>
                        推荐施肥
                        <p slot="desc">推荐施肥计算器依据作物的需肥规律，土壤供肥性能和肥料利用率，植物的吸收率，提出氮、磷、钾等元素的肥料使用量。本研究使用养分平衡法来计算施肥量。养分平衡法是以测试的土壤养分含量为依据决定植物的施肥量。参考历年的产量，结合实地测试，提出目标产量。</p>
                    </Alert>
                    <FertilizerCalculator/>
                </Card>

            </i-col>
        </Row>
    </div>
</template>

<script>
    import NutrientCalculator from "../components/NutrientCalculator";
    import FertilizerCalculator from "../components/FertilizerCalculator";
    export default {
        name: "FertAdvice",
        components: {FertilizerCalculator, NutrientCalculator}
    }
</script>

<style scoped>

</style>