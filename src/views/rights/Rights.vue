<template>
  <div class="rights">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card class="box-card">
      <el-table :data="rightsLists" border style="width: 100%">
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column property="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column property="path" label="路径" width="180"></el-table-column>
        <el-table-column property="level" label="权限等级">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.level == 0">等级一</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">等级二</el-tag>
            <el-tag v-else type="info">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Authority",
  data() {
    return {
      rightsLists: [],
    };
  },
  created() {
    this.getRightsLists();
  },
  methods: {
    async getRightsLists() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
       return this.$message.console.error("获取用户权限列表失败");
      } else {
        this.rightsLists = res.data;
      }
    },
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 15px;
}
</style>