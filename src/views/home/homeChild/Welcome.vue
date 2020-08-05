<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="el-card__body">
          <div class="el-card-i">
            <i class="el-icon-s-custom" style="color:#fff"></i>
          </div>
          <div class="el-card-data">
            <span>客户数</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="el-card__body">
          <div class="el-card-i">
            <i class="el-icon-s-order" style="color:#fff"></i>
          </div>
          <div class="el-card-data">
            <span>支付订单数</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="el-card__body">
          <div class="el-card-i">
            <i class="el-icon-s-ticket" style="color:#fff"></i>
          </div>
          <div class="el-card-data">
            <span>支付金额</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="10" style="margin-top:20px">
        <el-card>
          <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="10"></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  mounted() {
    this.getEcharts();
  },
  methods: {
    getEcharts() {
      let myChart = this.$echarts.init(document.getElementById("main"));
      var option = {
        title: {
          text: "热门产品销量",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.el-card-i {
  width: 30px;
  height: 30px;
  background: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
}
.el-card-data {
  float: right;
  height: 39px;
  line-height: 32px;
}
.el-card__body {
  padding: 10px !important;
  overflow: hidden !important;
}
.main{
  margin-top: 20px;
}
</style>