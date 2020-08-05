<template>
  <div class="login_item">
    <div class="login_title">
      <h1>富婆街管理系统</h1>
    </div>
    <div class="login_form">
      <h3>系统登录</h3>
      <el-form ref="ruleForm" :model="loginForm" class="login-page" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i class="el-icon-user" slot="prefix"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password v-model="loginForm.password">
            <i class="el-icon-suitcase-1" slot="prefix"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="form_button">
          <el-button type="primary" @click="loginform">登录</el-button>
          <el-button type="info" @click="resetform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
<script>
        ! function() {

            //canvas元素相关
            //创建canvas元素，并设置canvas元素的id
            var canvas = document.createElement("canvas"),
                context = canvas.getContext("2d"),
                attr = getAttr();

            //设置创建的canvas的相关属性
            canvas.id = "c_n" + attr.length;
            canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + attr.z + ";opacity:" + attr.opacity;
            //将canvas元素添加到body元素中
            document.getElementsByTagName("body")[0].appendChild(canvas);
            //该函数设置了canvas元素的width属性和height属性
            getWindowWH();
            //onresize 事件会在窗口或框架被调整大小时发生
            //此处即为当窗口大小改变时，重新获取窗口的宽高和设置canvas元素的宽高
            window.onresize = getWindowWH;


            //该函数会得到引用了本文件的script元素，
            //因为本文件中在赋值时执行了一次getScript函数，html文件引用本文件时，本文件之后的script标签还没有被浏览器解释，
            //所以得到的script数组中，引用了本文的script元素在该数组的末尾
            //该函数的用意为使开发者能直接修改在html中引入该文件的script元素的属性来修改画布的一些属性，画布的z-index，透明度和小方块数量，颜色
            //与前面往body元素添加canvas元素的代码配合，当开发者想要使用该特效作为背景时，只需在html文件中添加script元素并引用本文件即可
            function getAttr() {
                let scripts = document.getElementsByTagName("script"),
                    len = scripts.length,
                    script = scripts[len - 1]; //v为最后一个script元素，即引用了本文件的script元素
                return {
                    length: len,
                    z: script.getAttribute("zIndex") || 99,
                    opacity: script.getAttribute("opacity") || 0.8,
                    color: script.getAttribute("color") || "255,255,255",
                    count: script.getAttribute("count") || 150
                }
            }
            //获得窗口宽高，并设置canvas元素宽高
            function getWindowWH() {
                W = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                    H = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            }





            //生成随机位置的小方块
            var random = Math.random,
                squares = []; //存放小方块

            //往squares[]数组放小方块
            for (let p = 0; p < attr.count; p++) {
                var square_x = random() * W, //横坐标
                    square_y = random() * H, //纵坐标
                    square_xa = 2 * random() - 1, //x轴位移 -1,1
                    square_ya = 2 * random() - 1; //y轴位移
                squares.push({
                    x: square_x,
                    y: square_y,
                    xa: square_xa,
                    ya: square_ya,
                    max: 6000
                })
            }

            //生成鼠标小方块
            var mouse = {
                x: null,
                y: null,
                max: 20000
            };
            //获取鼠标所在坐标
            window.onmousemove = function(i) {
                    //i为W3C DOM，window.event 为 IE DOM，以实现兼容IE
                    //不过目前似乎IE已经支持W3C DOM，我用的是IE11，我注释掉下一句代码也能实现鼠标交互效果，
                    //网上说7/8/9是不支持的，本人没有试验，
                    //当然加上是没有错的
                    i = i || window.event;
                    mouse.x = i.clientX;
                    mouse.y = i.clientY;
                }
                //鼠标移出窗口后，消除鼠标小方块
            window.onmouseout = function() {
                mouse.x = null;
                mouse.y = null;
            }


            //绘制小方块，小方块移动(碰到边界反向移动)，小方块受鼠标束缚
            var animation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(i) {
                window.setTimeout(i, 1000 / 45)
            }; //各个浏览器支持的requestAnimationFrame有所不同，兼容各个浏览器

            function draw() {
                //清除画布
                context.clearRect(0, 0, W, H);

                var w = [mouse].concat(squares); //连接(合并)鼠标小方块数组和其他小方块数组
                var x, v, A, B, z, y;


                //square属性表：x，y，xa，ya，max
                squares.forEach(function(i) {

                    //实现小方块定向移动
                    i.x += i.xa;
                    i.y += i.ya;

                    // 控制小方块移动方向
                    // 当小方块达到窗口边界时，反向移动
                    i.xa = i.xa * (i.x > W || i.x < 0 ? -1 : 1);
                    i.ya = i.ya * (i.y > H || i.y < 0 ? -1 : 1);

                    //fillRect前两个参数为矩形左上角的x，y坐标，后两个分别为宽度和高度
                    //绘制小方块
                    context.fillRect(i.x - 0.5, i.y - 0.5, 1, 1);

                    //遍历w中所有元素
                    for (let n = 0; n < w.length; n++) {
                        x = w[n];
                        //如果x与i不是同一个对象实例且x的xy坐标存在
                        if (i !== x && null !== x.x && null !== x.y) {
                            x_diff = i.x - x.x; //i和x的x坐标差
                            y_diff = i.y - x.y; //i和x的y坐标差
                            distance = x_diff * x_diff + y_diff * y_diff; //斜边平方
                            if (distance < x.max) {
                                //使i小方块受鼠标小方块束缚，即如果i小方块与鼠标小方块距离过大，i小方块会被鼠标小方块束缚,
                                //造成 多个小方块以鼠标为圆心，mouse.max/2为半径绕成一圈
                                if (x === mouse && distance > x.max / 2) {
                                    i.x = i.x - 0.03 * x_diff;
                                    i.y = i.y - 0.03 * y_diff;
                                }
                                A = (x.max - distance) / x.max;
                                context.beginPath();
                                //设置画笔的画线的粗细与两个小方块的距离相关，范围0-0.5，两个小方块距离越远画线越细，达到max时画线消失
                                context.lineWidth = A / 2;
                                //设置画笔的画线颜色为s.c即画布颜色，透明度为(A+0.2)即两个小方块距离越远画线越淡
                                context.strokeStyle = "rgba(" + attr.color + "," + (A + 0.2) + ")";
                                //设置画笔的笔触为i小方块
                                context.moveTo(i.x, i.y);
                                //使画笔的笔触移动到x小方块
                                context.lineTo(x.x, x.y);
                                //完成画线的绘制，即绘制连接小方块的线 
                                context.stroke();
                            }
                        }
                    }
                    //把i小方块从w数组中去掉
                    //防止两个小方块重复连线
                    w.splice(w.indexOf(i), 1);
                });

                //window.requestAnimationFrame与setTimeout相似，形成递归调用，
                //不过window.requestAnimationFrame采用系统时间间隔，保持最佳绘制效率,提供了更好地优化，使动画更流畅
                //经过浏览器优化，动画更流畅；
                //窗口没激活时，动画将停止，省计算资源;
                animation(draw);
            }

            //此处是等待0.1秒后，执行一次draw()，真正的动画效果是用window.requestAnimationFrame实现的
            setTimeout(function() {
                draw();
            }, 100)

        }();
    </script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        // username: [
        //   { message: "请输入用户名", trigger: "blur" },
        //   { min: 2, max: 4, message: "长度在 3 到 5 个字符", trigger: "blur" }
        // ],
        // password: [
        //   { message: "请输入正确的密码", trigger: "blur" },
        //   { min: 6, max: 11, message: "密码长度6-11位", trigger: "blur" }
        // ]
      }
    };
  },
  methods: {
    
    loginform() {
      this.$refs.ruleForm.validate(async valid => {
        // console.log(valid);
        if (!valid) return;
        //通过axios发送的网络请求开始得到的result是promise对象，需要通过async和await转化为正常的对象
        const result = await this.$http.post("login", this.loginForm);//通过main.js中定义的$http，发送axios网络请求得到数据
        const resdata = result.data;
        if(resdata.meta.status == 200){
          this.$message.success("登录成功")
        }else{
          this.$message.error("登录失败")
        }
        // console.log(resdata);
        //1、第一次登录的时候，前端调后端的登陆接口，发送用户名和密码
        // 2、后端收到请求，验证用户名和密码，验证成功，就给前端返回一个token
        // 3、前端拿到token，将token存储到sessionStorage和vuex中，并跳转路由页面
        // 4、前端每次跳转路由，就判断 sessionStroage 中有无 token ，没有就跳转到登录页面，有则跳转到对应路由页面
        // 5、每次调后端接口，都要在请求头中加token
        // 6、后端判断请求头中有无token，有token，就拿到token并验证token，验证成功就返回数据，验证失败（例如：token过期）就返回401，请求头中没有token也返回401
        // 7、如果前端拿到状态码为401，就清除token信息并跳转到登录页面
        window.sessionStorage.setItem('token',resdata.data.token);
        this.$router.push('/home')
      });
    },

    //重置数据方法，resetFields是element重置表单的方法
    resetform() {
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style scoped>
.login_item {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-image: url("../../assets/images/login/loginbg.jpg");
  background-size: cover;
  overflow: hidden;
}
.login_form {
  width: 500px;
  height: 300px;
  display: block;
  margin: 0 auto;
  position: relative;
  top: 50%;
  background-color: white;
  margin-top: -250px;
  border-radius: 5px;
  z-index: 999;
}
.login-page {
  position: relative;
  border-radius: 5px;
  margin: 10px auto;
  width: 400px;
  padding: 10px 15px 5px;
  background: #fff;
  border: 1px solid #eaeaea;
}
.login_form h3 {
  color: black;
  margin-left: 50px;
  padding-top: 50px;
}
.login_title {
  position: relative;
  top: 18%;
  margin-top: -150px;
  display: block;
  margin: 0 auto;
}
.login_title h1 {
  color: #fff;
  text-align: center;
  letter-spacing: 2px;
}
.form_button {
  display: flex;
  flex-flow: row-reverse;
}
</style>