import request from "@/api/request";
import { ConditionItem } from "@/type/index";

const serverUrl = {
  list: "/condition/list",
  edit: "/condition/edit",
};

export const getConditionList = () => {
  return request.get(serverUrl.list);
};
export const conditionEdit = (params: ConditionItem) => {
  return request.post(serverUrl.edit, params);
};
