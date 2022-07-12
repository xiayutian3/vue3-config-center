<template>
  <div>
    <div id="wrap" class="wrap">
      <!-- 主体 -->
      <div class="topbar">
        <img
          src="../assets/logo.png"
          v-preventReClick
          @click="goPage"
          class="logo"
        />
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ userName }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a" @click="change"
                >编辑资料</el-dropdown-item
              >
              <el-dropdown-item command="b" @click="logout"
                >退出登录</el-dropdown-item
              >
              <!-- <el-dropdown-item command="b" @click="delUser"
                >注销账号</el-dropdown-item
              > -->
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <editUerMessage
        v-if="editUerMessageModalVisible"
        v-model="editUerMessageModalVisible"
      />
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import editUerMessage from "./editUerMessage.vue";
import { userDel } from "@/api/login";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const router = useRouter();
const editUerMessageModalVisible = ref(false);
const userName = `${
  sessionStorage.getItem("userInfo") &&
  JSON.parse(sessionStorage.getItem("userInfo") || "").name
}(${
  sessionStorage.getItem("userInfo") &&
  JSON.parse(sessionStorage.getItem("userInfo") || "").acount
})`;
// 登出
const logout = () => {
  sessionStorage.clear();
  setTimeout(() => {
    window.location.reload();
  }, 300);
};
// 回到首页
const goPage = () => {
  router.replace({ name: "project" });
};
// 修改密码
const change = () => {
  editUerMessageModalVisible.value = true;
};
// 注销账号
const delUser = async () => {
  ElMessageBox.confirm("您确定要注销当前账号吗?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let id =
        sessionStorage.getItem("userInfo") &&
        JSON.parse(sessionStorage.getItem("userInfo") || "").id;
      let { code, message } = await userDel({ id });
      if (code === 200) {
        sessionStorage.clear();
        ElMessage({
          type: "success",
          message: "注销成功",
        });
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        ElMessage.info(message);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消注销",
      });
    });
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  .topbar {
    min-height: 50px;
    align-items: center;
    padding: 5px 10px;
    background: #f0f2f5;
    display: flex;
    justify-content: space-between;
    .logo {
      width: 30px;
      height: 30px;
    }
    .el-dropdown-link {
      color: #666;
      font-size: 14px;
      margin-right: 20px;
      line-height: 30px;
      display: inline-block;
      height: 30px;
      text-decoration: none;
    }
  }
  .main-content {
    overflow-y: auto;
    flex: 1;
  }
}
</style>
