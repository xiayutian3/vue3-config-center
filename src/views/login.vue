<template>
  <div class="page">
    <div class="login_warp">
      <div class="title">无账号会自动注册</div>
      <div class="login_box">
        <el-form
          label-width="0"
          :rules="rules"
          :model="loginForm"
          ref="ruleFormRef"
        >
          <!-- <el-form-item prop="userName">
            <div class="input_box">
              <div class="prepend">
                <span>昵 称</span>
              </div>
              <el-input v-model="loginForm.userName" class="a_input"></el-input>
            </div>
          </el-form-item> -->
          <el-form-item prop="acount">
            <div class="input_box">
              <div class="prepend">
                <span>账 号</span>
              </div>
              <el-input v-model="loginForm.acount" class="a_input"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <div class="input_box">
              <div class="prepend">
                <span>密 码</span>
              </div>
              <el-input
                type="password"
                v-model="loginForm.password"
                class="a_input"
              >
              </el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              class="btn_login"
              v-preventReClick
              @click.prevent="loginEvent(ruleFormRef)"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { register, login } from "@/api/login";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const loginForm = reactive({
  userName: "",
  acount: "",
  password: "",
});
const validateAcount = (rule: any, value: any, callback: any) => {
  let reg = new RegExp(
    "[`~!@#$^&*=|{}':;./%',\\[\\]<>?~！@#￥……&*——|{}【】‘；：”“'。，、？ ]"
  );
  if (reg.test(value)) {
    callback(new Error("账号不可包含特殊字符"));
  } else if (/[\u4E00-\u9FA5]/g.test(value)) {
    callback(new Error("账号不可包含汉字"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  userName: [{ required: false, message: "请输入昵称", trigger: "blur" }],
  acount: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { validator: validateAcount, trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
const loginEvent = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      let params = {
        name: loginForm.acount, // 默认昵称为账号
        acount: loginForm.acount,
        password: loginForm.password,
      };
      let { code, data, message } = await login(params);
      if (code === 200) {
        // 有账号直接登录
        window.sessionStorage.setItem("token", data && data.token);
        window.sessionStorage.setItem(
          "userInfo",
          data && data.user && JSON.stringify(data.user)
        );
        router.replace({ name: "project" });
      } else if (code === 404) {
        // 无账号自动注册后登录
        requestAnimationFrame(async () => {
          let { code, message } = await register(params);
          if (code === 200) {
            requestAnimationFrame(async () => {
              let { code, data, message } = await login(params);
              if (code === 200) {
                requestAnimationFrame(() => {
                  window.sessionStorage.setItem("token", data && data.token);
                  window.sessionStorage.setItem(
                    "userInfo",
                    data && data.user && JSON.stringify(data.user)
                  );
                  router.replace({ name: "project" });
                });
              } else {
                ElMessage.info(message);
              }
            });
          } else {
            ElMessage.info(message);
          }
        });
      } else {
        ElMessage.info(message);
      }
    }
  });
};
</script>
<style scoped lang="scss">
.page {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url("../assets/project.png") center center no-repeat;
  background-size: 100% 100%;
}

.login_warp {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: 0px;
  transform: translate(-50%, -50%);
  padding: 0px 60px;
  .title {
    text-align: center;
    color: #dc7a7a;
    font-weight: bold;
    padding: 15px 0;
  }
}

.btn_login {
  display: block;
  width: 372px;
  height: 40px;
  background-color: rgba(4, 139, 66, 0.9);
  color: #fff;
  border: none;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 30px;
}
.btn_login:hover {
  background-color: #00a84d;
}

.input_box {
  display: flex;
  align-items: center;
  background: rgb(29, 45, 61);
  position: relative;
  width: 372px;
  height: 42px;
  border: 1px solid rgb(221, 221, 221);
  padding: 0px 20px;
  border-radius: 20px;
  overflow: hidden;
  box-sizing: border-box;
  margin: 5px 0;
  .prepend {
    display: flex;
    align-items: center;
    width: 80px;
    color: #fff;
    img {
      width: 16px;
      margin: 0 10px 0 0;
    }
  }
  .a_input {
    flex: 1;
    border: 0;
    outline: none;
    height: 40px;
    background-color: transparent;
    color: #fff;
    .el-input__inner {
      background-color: transparent !important;
      border: 0;
    }
  }
}
</style>
