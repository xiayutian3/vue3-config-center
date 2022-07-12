import request from "@/api/request";
import qs from "qs";
import { ProjectApi } from "@/type/index";

const serverUrl = {
  list: "/projectApi/list",
  add: "/projectApi/add",
  edit: "/projectApi/edit",
  del: "/projectApi/delete",
};

export const getProjectApiList = (params: { projectId: number }) => {
  return request.get(serverUrl.list + "?" + qs.stringify(params));
};
export const projectApiAdd = (params: ProjectApi) => {
  return request.post(serverUrl.add, params);
};
export const projectApiEdit = (params: ProjectApi) => {
  return request.post(serverUrl.edit, params);
};
export const projectApiDel = (params: { id: number }) => {
  return request.post(serverUrl.del, params);
};
