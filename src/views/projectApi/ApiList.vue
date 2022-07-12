<template>
  <div class="api-list">
    <h3>项目接口</h3>
    <el-table border :data="tableData" stripe style="width: 100%">
      <el-table-column prop="method" label="method" />
      <el-table-column prop="url" label="url" />
      <el-table-column prop="remark" label="remark" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            v-preventReClick
            @click.prevent="editorRow(scope.row)"
          >
            {{ disabled ? "查看" : "编辑" }}
          </el-button>
          <el-button
            type="text"
            size="small"
            v-preventReClick
            :disabled="disabled"
            @click.prevent="deleteRow(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddButton :isDisabled="disabled" v-preventReClick @click="addFn" />
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import router from "@/router";
import { ProjectApi } from "@/type/index";
import { useRoute } from "vue-router";
import { getProjectApiList, projectApiDel } from "@/api/projectApi";

// interface ProjectApi {
//   id: string;
//   method: string;
//   url: string;
//   content: string;
//   remark: string;
// }

export default {
  name: "ApiList",
  setup() {
    //获取路由对象
    const route = useRoute();
    //获取路由参数
    let routerParams = route.query;
    // let keysLength = Object.keys(routerParams).length;
    // if (keysLength > 0) {
    //   //编辑
    // }
    const userInfo =
      window.sessionStorage.getItem("userInfo") &&
      JSON.parse(window.sessionStorage.getItem("userInfo") || "");
    // 是否管理员
    const isAdmin = userInfo && userInfo.roleId === 1 ? true : false;
    const disabled = routerParams.projectId === "1" && !isAdmin ? true : false;
    const tableData = ref([
      {
        id: 1,
        projectId: 1,
        baseUrl: "",
        reateDate: new Date(),
        updateDate: new Date(),
        method: "get",
        url: "baseurl",
        content: "huwei",
        remark: "California remark",
      },
      {
        id: 2,
        projectId: 2,
        baseUrl: "",
        createDate: new Date(),
        updateDate: new Date(),
        method: "get",
        url: "baseurl",
        content: "huwei",
        remark: "California remark",
      },
    ]);
    window.sessionStorage.removeItem("editApiItem");
    const addFn = (flag = true, editorItem?: ProjectApi) => {
      // 判断是编辑还是新增
      if (flag) {
        //新增
        router.push({
          name: "addapi",
          query: {
            projectId: routerParams.projectId,
            baseUrl: routerParams.baseUrl,
          },
        });
      } else {
        //编辑
        router.push({
          name: "addapi",
        });
        window.sessionStorage.setItem(
          "editApiItem",
          JSON.stringify(editorItem)
        );
      }
    };
    const editorRow = (editorRow: ProjectApi) => {
      // console.log("editorRow: ", editorRow);
      addFn(false, editorRow);
    };
    const deleteRow = (editorRow: ProjectApi) => {
      console.log("editorRow: ", editorRow);
      ElMessageBox.confirm("您确定要删除吗?", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //删除接口
          let { code } = await projectApiDel({ id: editorRow.id as number });
          if (code === 200) {
            //获取数据
            getdata();
            ElMessage({
              type: "success",
              message: "删除成功",
            });
          }
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消删除",
          });
        });
    };
    //请求数据
    const getdata = async () => {
      let params = {
        projectId: routerParams.projectId as unknown as number,
      };
      let { code, data } = await getProjectApiList(params);
      if (code === 200) {
        tableData.value = data;
      }
    };
    getdata();

    return {
      tableData,
      editorRow,
      deleteRow,
      addFn,
      disabled,
    };
  },
};
</script>

<style lang="scss">
.api-list {
  padding: 40px 20px 20px;
  h3 {
    margin-bottom: 20px;
    text-align: center;
  }
}
</style>
