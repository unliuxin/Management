<template>
  <div class="cart">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <el-button type="primary" @click="addCate">添加分类</el-button>

      <!--添加分类弹窗-->
      <el-dialog title="添加分类" :visible.sync="dialogVisible" width="30%">
        <el-form ref="addCateRef" :rules="addCateRules" :model="addCateForm" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="cateKeys"
              :options="categoriesParentList"
              :props="cateProps"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateDate" @close="resetForm">确 定</el-button>
        </span>
      </el-dialog>

      <!--表格-->
      <table-tree
        :data="categoriesList"
        :columns="columns"
        :show-row-hover="true"
        :show-index="true"
        :selection-type="false"
        :expand-type="false"
        border
        class="table-tree"
      >
        <template v-slot:yesok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:green"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!--排序-->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">标签一</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">标签二</el-tag>
          <el-tag type="info" v-else>标签三</el-tag>
        </template>

        <!--编辑-->
        <template v-slot:edit="scope">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
      </table-tree>
      <!--分页-->
      <el-pagination
        @size-change="cateSizeChange"
        @current-change="cateCurrentChange"
        :current-page="this.categoriesInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="this.categoriesInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>
  </div>
</template>
     
<!--添加分类-->


<script>
export default {
  name: "Cart",
  data() {
    return {
      dialogVisible: false,
      categoriesList: [],
      categoriesInfo: {
        //分页
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      addCateForm: {
        cat_name: "",
        cat_id: 0,
        cat_level: 0,
      },
      //校验规则
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template", //使用插槽作用域
          template: "yesok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "编辑",
          type: "template",
          template: "edit",
        },
      ],
      total: 0, //总条数
      categoriesParentList: [], //父级分类数据列表
      cateKeys: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    async getCategoriesList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.categoriesInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求商品分类数据失败");
      } else {
        this.categoriesList = res.data.result;
        this.total = res.data.total;
      }
    },

    //添加分类
    addCate() {
      this.dialogVisible = true;
      this.getCategoriesParent();
    },

    cateSizeChange(newSize) {
      this.categoriesInfo.pagesize = newSize;
      this.getCategoriesList();
    },

    //监听页数改变
    cateCurrentChange(newCurrent) {
      this.categoriesInfo.pagenum = newCurrent;
      this.getCategoriesList();
    },

    //请求父级分类数据渲染到添加分类窗口里
    async getCategoriesParent() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求商品分类数据失败");
      } else {
        this.categoriesParentList = res.data;
        console.log(res);
      }
    },

    handleChange(value) {
      console.log(value);
    },
    //重置添加fenlei框
    resetForm() {
      this.$refs.addCateRef.resetFields();
      this.cateKeys = [];
    },

    //将添加的商品分类数据发送到数据库
    addCateDate() {
      this.$refs.addCateRef.validate(async (valit) => {
        if (!valit) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品分类数据失败");
        } else {
          this.$message.success("添加商品分类数据成功");
          this.getCategoriesList();
          this.dialogVisible = false;
        }
      });
    },

    //删除分类
    async removeCate(cateId) {
      const { data: res } = await this.$http.delete("categories/" + cateId);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      } else {
        this.$message.success("删除成功");
        this.getCategoriesList();
      }
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.table-tree {
  margin-top: 15px;
}
</style>