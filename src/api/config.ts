import request from "@/api/request";
import qs from "qs";

const serverUrl = {
  config: "/glsxAdmin/config",
};

export const getConfig = (params: { moduleUrl: string }) => {
  return request.get(serverUrl.config + "?" + qs.stringify(params));
};
