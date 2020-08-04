<template>
  <div class="goods">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--搜索框-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" clearable v-model="goodsListInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsLists()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addGoods= true">添加商品</el-button>
        </el-col>
      </el-row>
      <!--商品数据-->
      <el-table :data="goodsLists" show-header border style="width: 100%">
        <el-table-column type="index" label="#" width="180"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column prop="add_time | showdate" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.goodsListInfo.pagenum"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="this.goodsListInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      addGoods: false,
      goodsLists: [],
      goodsListInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0, //总条数
    };
  },
  created() {
    this.getGoodsLists();
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
    //请求商品数据
    async getGoodsLists() {
      const { data: res } = await this.$http.get("goods", {
        params: this.goodsListInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表数据失败");
      } else {
        this.goodsLists = res.data.goods;
        this.total = res.data.total;
      }
    },

    //切换分页显示条数
    handleSizeChange(newsize) {
      this.goodsListInfo.pagesize = newsize;
      this.getGoodsLists();
    },
    //切换上一页下一页
    handleCurrentChange(newpage) {
      this.goodsListInfo.pagenum = newpage;
      this.getGoodsLists();
    },

    //查询商品数据

    //删除商品数据
    async removeGoods(id) {
      const {data:res} = await this.$http.delete('goods/'+id)
      if(res.meta.status !== 200){
          return this.$message.error("删除失败")
      }else{
          this.$message.success("删除成功")
          this.getGoodsLists()
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