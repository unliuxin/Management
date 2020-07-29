<template>
  <div class="Home">
    <el-container class="home_container">
      <el-header class="home_container_header">
        <div class="home_header_title">
          <h1>后台管理系统</h1>
        </div>
        <div class="user_avatar">
          <div class="user_avatar_search user_avatar_i"><i class="el-icon-search"></i></div>
          <div class="user_avatar_bell user_avatar_i"><el-badge is-dot class="item"><i class="el-icon-bell"></i></el-badge></div>
          <div class="user_avatar_message user_avatar_i"><el-badge is-dot class="item" type="primary"><i class="el-icon-message"></i></el-badge></div>
          <el-dropdown>
            <el-avatar class="user_avatar_img">
              <img src="../../assets/images/home/admin.jpg" alt />
            </el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span>我的文件</span></el-dropdown-item>
              <el-dropdown-item><span>设置</span></el-dropdown-item>
              <el-dropdown-item><span @click="loginout">退出</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="home_container">
        <!--侧边栏-->

        <el-aside width="200px" class="home_aside">
          <el-menu :default-active="activepath" class="el-menu-vertical-demo" background-color="#414a60" text-color="#fff" 
          :collapse="iscollapse" :collapse-transition="false" router>
            <div class="collapse_button" @click="handlecollapse"><span>|||</span></div>
            <el-submenu :index="item.path + ''" v-for="item in menus" :key="item.id">
              <template slot="title">
                <i class="el-icon-s-cooperation"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item
                :index="'/'+subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="getActivePath('/'+subitem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main class="home_main">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menus: [],
      iscollapse:false,//侧边栏是否折叠
      activepath:''
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    //侧边栏是否折叠
    handlecollapse(){
      this.iscollapse = !this.iscollapse
    },
    //获取二级菜单下标，存储到sessiongstorage
    getActivePath(activepath){
      window.sessionStorage.setItem("activepath",activepath)
      this.activepath = window.sessionStorage.getItem('activepath')

    },
    //退出登录功能
    loginout() {
      this.$confirm('您是否确定退出登录', '退出登录',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          window.sessionStorage.removeItem('token');
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //请求左侧列表数据
    async getMenuList() {
      const menusdata = await this.$http.get("menus");
      const menusdatas = menusdata.data;
      this.menus = menusdatas.data;

      if (menusdatas.meta.status !== 200) {
        this.$message.error(menusdatas.meta.msg);
      } else {
        this.$message.success(menusdatas.meta.msg);
      }
      // console.log(this.menus);
    },
  },
};
</script>

<style scoped>
.Home {
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: block;
}
.home_main {
  background-color: #eff0f5;
}
.home_aside {
  background-color: rgb(238, 241, 246);
}
.home_container_header {
  display: flex;
  justify-content: space-between;
  margin: 0 15px;
}
.home_header_title h1 {
  color: rgb(32 36 42);
  align-content: center;
}
.user_avatar {
  align-items: center;
  display: flex;
  position: relative;
  cursor: pointer;
}
.home_container_header {
  align-items: center;
  display: flex;
}
.user_avatar::after {
  content: "";
  width: 5px;
  height: 5px;
  background-color: #49a342;
  position: absolute;
  border-radius: 50%;
  right: 4px;
  bottom: 0px;
  border-radius: 50%;
}
.home_aside ul {
  height: 100vh;
}
.home_container {
  height: 100vh;
}
.el-menu {
  border-right: none !important;
}
.collapse_button {
  background: #28283b;
  color: white;
  text-align: center;
  letter-spacing: 2px;
  padding: 5px 0;
  cursor: pointer;
}
.collapse_button span{
  padding-left: 12px;
}
.user_avatar_i {
    width: 50px;
    font-size: 23px;
    color: #272626;
}
.user_avatar_i span {
    color: red;
    font-size: 10px;
    position: absolute;
    text-align: center;
    display: inline-grid;
    font-weight: 900;
}
</style>