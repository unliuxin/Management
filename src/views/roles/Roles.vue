<template>
  <div class="roles">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->

    <el-card>
      <div>
        <el-button type="primary">添加角色</el-button>
      </div>
      <el-table border :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row v-for="item in scope.row.children" :key="item.id">
              <!--一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeTag(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级权限-->
              <el-col :span="19">
                <el-row v-for="item2 in item.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeTag(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                  </el-col>
                  <el-col :span="13">
                    <el-tag
                      type="danger"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeTag(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--展开列-->
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column label="角色名称" width="180" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" width="180" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showRightsVisible(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--所有权限列表-->
    <el-dialog title="分配权限" :visible.sync="rightsVisible" width="50%">
      <el-tree
        :data="rightsLists"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="defaultkeys"
        :props="defaultProps"
        default-expand-all
        ref="trees"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributionRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      rightsVisible: false,
      rightsLists: [], //所有权限的数组
      defaultProps: {
        //树形控件绑定的对象
        children: "children",
        label: "authName",
      },
      defaultkeys: [], //默认已经勾选的权限id
      roleId: "", //已经选中要分配权限的id
    };
  },
  created() {
    this.getRolesLists();
  },
  methods: {
    //请求权限列表数据
    async getRolesLists() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.console.error("获取角色权限列表失败");
      } else {
        this.rolesList = res.data;
        // console.log(this.rolesList);
      }
    },

    //删除角色权限tag
    async removeTag(role, rightId) {
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("删除失败");
      } else {
        role.children = res.data;
      }
    },

    //请求所有权限数据
    async showRightsVisible(role) {
      this.rightsVisible = true;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("请求权限列表数据失败");
      } else {
        this.rightsLists = res.data;
        this.getdefaultkeys(role, this.defaultkeys);
        this.roleId = role.id;
      }
    },

    //通过递归函数获取已经被勾选权限列表id push到defaultkeys
    getdefaultkeys(node, arr) {
      if (!node.children) {
        //如果这个是第三级，下面就没有children，否则相反就遍历
        return arr.push(node.id);
      } else {
        node.children.forEach((item) => {
          this.getdefaultkeys(item, arr);
        });
      }
    },

    //分配权限保存
    async distributionRole() {
      //定义一个数组将选要分配的权限的id保存
      const roleKeys = [
        ...this.$refs.trees.getHalfCheckedKeys(),
        ...this.$refs.trees.getCheckedKeys(),
      ];
      const keysStr = roleKeys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keysStr }
      );

      if ((res.meta, status !== 200)) {
        this.$message.error("分配权限失败");
      } else {
        this.$message.success("分配成功");
        this.getRolesLists()
        this.rightsVisible = false;
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
  margin-top: 10px;
}
.el-row {
  margin-bottom: 10px;
  border-bottom: 1px solid #f5f7fa;
}
</style>