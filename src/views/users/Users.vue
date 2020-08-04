<template>
  <div class="users">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getUserList()"
            v-model="paramsUserInfo.query"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addUser= true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表数据-->
      <el-table :data="userlists" border style="width: 1342px">
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="create_time | showdate" label="创建时间" width="180">
          <template v-slot:default="scope">{{scope.row.create_time | showdate}}</template>
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <template v-slot:default="scope">
            <!--利用作用域插槽-->
            <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="180">
          <template v-slot:default="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" @click="showUserEdit(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色权限" placement="top">
              <el-button type="warning" icon="el-icon-setting" @click="editUserRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="分配用户权限" :visible.sync="dialogVisible" width="30%">
        <div>
          <p>用户名：{{userInfo.username}}</p>
          <p>角色：{{userInfo.role_name}}</p>
          <p>
            <el-select placeholder="请选择" v-model="selectRoleID">
              <el-option
                v-for="item in userInfoData"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUserRole">确 定</el-button>
        </span>
      </el-dialog>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsUserInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="paramsUserInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--编辑用户信息窗口-->
    <el-dialog title="编辑用户信息" :visible.sync="userEditVisible" width="30%" @close="resetEditForm">
      <el-form
        ref="editUserformRef"
        :model="editUserform"
        :rules="editUserformRules"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUserform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="userEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加用户窗口-->
    <el-dialog title="添加用户" :visible.sync="addUser" width="30%" @close="resetForm">
      <el-form ref="ruleForm" label-width="70px" :model="addForm" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUser = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };

    return {
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },

      //添加用户校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 4, message: "长度在 2 到 4 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile },
        ],
      },

      //编辑用户校验规则
      editUserformRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile },
        ],
      },
      userlists: [],
      addUser: false, //
      userEditVisible: false, //编辑用户窗口
      editUserform: {},
      total: 0, //用户列表总条数
      paramsUserInfo: {//分页
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      userInfo: "",
      userInfoData: [],
      dialogVisible: false,
      selectRoleID: "",
    };
  },
  created() {
    this.getUserList(); //请求用户列表数据
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
    //添加用户
    addUsers() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);

        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        } else {
          this.$message.success("添加用户成功");
          //关闭添加用户框
          this.addUser = false;
          //刷新用户列表
          this.getUserList();
        }
      });
    },

    //校验修改用户信息
    userEdit() {
      this.$refs.editUserformRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editUserform.id,
          {
            email: this.editUserform.email,
            mobile: this.editUserform.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }

        this.userEditVisible = false;
        this.getUserList();
        this.$message.success("用户信息修改成功");
      });
    },

    //删除用户信息
    async deleteUser(id) {
      const { data: res } = await this.$http.delete("users/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("删除用户信息失败");
      } else {
        this.$message.success("删除用户信息成功");
        this.getUserList();
      }
    },

    //查询根据id查询用户信息
    async showUserEdit(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editUserform = res.data;
      this.userEditVisible = true;
    },

    //重置添加用户框
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    //重置编辑用户框
    resetEditForm() {
      this.$refs.editUserformRef.resetFields();
    },

    //监控用户列表状态的改变
    async changeUserState(userState) {
      const userinfo = await this.$http.put(
        `users/${userState.id}/state/${userState.mg_state}`
      );
      if (userinfo.data.meta.status !== 200) {
        userState.mg_state = !userState.mg_state;
        this.$message.error("更新用户状态失败");
      }
    },

    //分页的方法
    //监听显示条数的改变
    handleSizeChange(newSize) {
      this.paramsUserInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页数改变
    handleCurrentChange(newCurrent) {
      this.paramsUserInfo.pagenum = newCurrent;
      this.getUserList();
    },

    //请求用户列表数据
    async getUserList() {
      const userslist = await this.$http.get("users", {
        params: this.paramsUserInfo,
      });
      this.userlists = userslist.data.data.users;
      this.total = userslist.data.data.total;
      if (userslist.data.meta.status !== 200) {
        this.$message.error("获取用户列表失败");
      }
    },

    //给用户分配角色权限
    async editUserRole(userRoles) {
      const { data: res } = await this.$http.get("roles");
      this.userInfoData = res.data;
      this.userInfo = userRoles;

      if (res.meta.status !== 200) {
        this.$message.error("请求失败");
      } else {
        this.dialogVisible = true;
      }
    },

    //保存用户重新分配的角色
    async saveUserRole() {
      if (!this.selectRoleID) {
        return this.$message.error("请分配用户角色");
      }
      const {
        data: res,
      } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleID,
      });
      console.log(this.selectRoleID);
      if (res.meta.status !== 200) {
        this.$message.error("请求失败");
      } else {
        this.$message.success("分配角色成功");
        this.getUserList()
        this.dialogVisible = false;
      }
    },
  },
};
</script>

<style scoped>
.box-card {
  width: 86vw;
  margin-top: 20px;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>