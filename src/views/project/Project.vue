<template>
  <div class="project">
    <h3>项目环境配置</h3>
    <el-row :gutter="20">
      <el-col
        v-for="item in projectList"
        :key="item.id"
        :xs="12"
        :sm="9"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <el-card
          :body-style="{ padding: '0px' }"
          shadow="hover"
          v-preventReClick
          @click="goToList(item)"
        >
          <img
            style="width: 100%; height: 240px"
            src="../../assets/project.png"
            class="image"
          />
          <div style="padding: 14px">
            <span>项目名称：{{ item.name }}</span>
            <div>项目备注：{{ item.remark }}</div>
            <div class="bottom">
              <el-button
                class="button"
                v-preventReClick
                :disabled="item.disabled"
                type="text"
                @click.stop="editFn(item)"
                >编辑</el-button
              >
              <el-button
                class="button"
                v-preventReClick
                :disabled="item.disabled"
                type="text"
                @click.stop="deleteFn(item)"
                >删除</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <h3>项目环境判断</h3>
    <el-row :gutter="20">
      <el-col
        v-for="item in conditionList"
        :key="item.id"
        :xs="12"
        :sm="9"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <el-card
          :body-style="{ padding: '0px' }"
          shadow="hover"
          @click="goToEdit(item)"
        >
          <img
            style="width: 100%; height: 240px"
            src="../../assets/project.png"
            class="image"
          />
          <div style="padding: 14px">
            <span>项目环境：{{ item.name }}</span>
            <div class="bottom">
              <el-button type="text" class="button">查看</el-button>
              <!-- <el-button
                type="text"
                class="button"
                @click.stop="editConditionFn(item)"
                >编辑</el-button
              >
              <el-button
                type="text"
                class="button"
                @click.stop="deleteConditionFn(item)"
                >删除</el-button
              > -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <AddButton @click="handerAddFn" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import AddButton from "@/components/AddButton.vue";
import router from "@/router";
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import { getProjectList, projectDel } from "@/api/project";
import { getConfig } from "@/api/config";
import { getConditionList } from "@/api/condition";
import { ProjectItem, ConditionItem } from "@/type/index";

interface DataType {
  projectList: ProjectItem[];
  conditionList: ConditionItem[];
  [property: string]: any;
}
export default defineComponent({
  name: "Project",
  setup() {
    const state = reactive<DataType>({
      projectList: [],
      conditionList: [
        {
          id: 1,
          name: "production",
          content: "(() => {})()",
        },
        {
          id: 2,
          name: "test/develop",
          content: "(() => {})()",
        },
      ],
    });
    const userInfo =
      window.sessionStorage.getItem("userInfo") &&
      JSON.parse(window.sessionStorage.getItem("userInfo") || "");
    // 是否管理员
    const isAdmin = userInfo && userInfo.roleId === 1 ? true : false;
    const addFn = (flag = true, editorItem?: ProjectItem) => {
      // 判断是编辑还是新增
      if (flag) {
        //新增
        router.push({ name: "addproject" });
      } else {
        //编辑
        router.push({ name: "addproject", params: { ...editorItem } });
        window.sessionStorage.setItem(
          "editProjectItem",
          JSON.stringify(editorItem)
        );
      }
    };
    const handerAddFn = () => {
      addFn();
    };
    const deleteFn = (item: ProjectItem) => {
      console.log("item: ", item);
      ElMessageBox.confirm("您确定要删除吗?", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //请求删除
          let id = item.id as number;
          let { code } = await projectDel({ id });
          if (code === 200) {
            //获取数据
            getData();
            ElMessage({
              type: "success",
              message: "删除成功",
            });
          } else {
            ElMessage({
              type: "error",
              message: "删除失败",
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
    const editFn = (item: ProjectItem) => {
      // console.log("editFn", item);
      addFn(false, item);
    };
    const goToList = (item: ProjectItem) => {
      router.push({
        name: "apilist",
        query: { projectId: item.id, baseUrl: item.addr },
      });
    };

    //项目环境判断
    const editConditionFn = async (item: ConditionItem) => {
      console.log("item: ", item);
      // const res = await conditionEdit(item);
      // console.log("res: ", res);
    };
    const deleteConditionFn = (item: ConditionItem) => {
      console.log("item: ", item);
    };
    const goToEdit = (item: ConditionItem) => {
      // console.log("item: ", item);
      router.push({
        name: "conditioneditor",
      });
      window.sessionStorage.setItem("conditionItem", JSON.stringify(item));
    };
    // 获取数据
    const getData = async () => {
      let {
        code,
        data: { rows },
      } = await getProjectList();
      if (code === 200) {
        rows.forEach((val: any) => {
          val.disabled = val.id === 1 && !isAdmin ? true : false;
        });
        state.projectList = rows;
      }
      //设置test，develop环境选择
      const envOption = rows
        .map((item: ProjectItem) => {
          let temp = {} as { label: string; value: string };
          temp.value = item.name;
          temp.label = item.name;
          return temp;
        })
        .filter(
          (item: { label: string; value: string }) =>
            item.label !== "production"
        );
      sessionStorage.setItem("envOption", JSON.stringify(envOption));

      //获取条件判断
      let res = await getConditionList();
      if (res.code === 200) {
        state.conditionList = res.data.rows;
      }

      //获取config
      let params = { moduleUrl: "base" };
      let result = await getConfig(params);
      console.log("result: ", result);
    };
    getData();

    return {
      ...toRefs(state),
      editFn,
      deleteFn,
      handerAddFn,
      goToList,
      editConditionFn,
      deleteConditionFn,
      goToEdit,
    };
  },
  components: {
    AddButton,
  },
});
</script>
<style lang="scss">
.project {
  padding-top: 20px;
  h3 {
    text-align: center;
    margin-bottom: 20px;
  }
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .el-card {
    margin-bottom: 20px;
  }
}
</style>
