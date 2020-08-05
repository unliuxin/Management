<template>
  <div class="order">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索款-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" clearable v-model="orderInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="this.getOrderlists()"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单数据-->
      <el-table :data="orderLists" show-header border style="width: 100%">
        <el-table-column type="index" label="#" width="180"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="500"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="80">
          <template v-slot:default="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === 0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot:default="scope">{{scope.row.create_time | showdate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editAddress(scope.row.order_id)"></el-button>
            <el-button type="danger" icon="el-icon-location" @click="lookInfo(scope.row.order_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--修改地址弹窗-->
      <el-dialog title="修改地址" :visible.sync="addressVisible" width="30%">
        <el-cascader
          size="large"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--查看物流信息弹窗-->
      <el-dialog title="修改地址" :visible.sync="infoVisible" width="30%">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in laInfo"
            :key="index"
            :timestamp="item.time"
          >{{item.context}}</el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="infoVisible = false">取 消</el-button>
          <el-button type="primary" @click="infoVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.orderInfo.pagenum"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="this.orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { provinceAndCityData } from "element-china-area-data";
export default {
  name: "Orders",
  data() {
    return {
      orderLists: [],
      total: 0,
      orderInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      addressVisible: false,
      options: provinceAndCityData,
      selectedOptions: [],
      infoVisible: false,
      laInfo: [],
    };
  },
  created() {
    this.getOrderlists();
  },
  filters: {
    //将时间撮转换为正常时间
    showdate(value) {
      var now = new Date(value),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate();
      return (
        y +
        "-" +
        (m < 10 ? "0" + m : m) +
        "-" +
        (d < 10 ? "0" + d : d) +
        " " +
        now.toTimeString().substr(0, 8)
      );
    },
  },
  methods: {
    async getOrderlists() {
      const { data: res } = await this.$http.get("orders", {
        params: this.orderInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败");
      } else {
        this.orderLists = res.data.goods;
        this.total = res.data.total;
      }
    },

    //切换分页显示条数
    handleSizeChange(newsize) {
      this.orderInfo.pagesize = newsize;
      this.getOrderlists();
    },
    //切换上一页下一页
    handleCurrentChange(newpage) {
      this.orderInfo.pagenum = newpage;
      this.getOrderlists();
    },

    handleChange(value) {
      console.log(value);
    },
    //根据id更改地址
    editAddress(id) {
      this.addressVisible = true;
    },

    //查看物流信息
    async lookInfo(id) {
      this.infoVisible = true;
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流信息失败");
      } else {
        this.laInfo = res.data;
      }
    },
  },
};
</script>


<style scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
</style>