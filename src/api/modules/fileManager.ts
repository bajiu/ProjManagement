import http from "@/api";
import { PORT3 } from "@/api/config/servicePort";

/**
 * 获取文件列表
 */
export const getDocumentList = (data?: any) => {
	return http.get<any[]>(PORT3 + `/documents/versions`, data);
};

/**
 * 获取文件树
 */
export const getDocumentTree = () => {
	return http.get<any[]>(PORT3 + `/documents/tree`);
};

/**
 * 获取版本列表
 */
export const getVersionList = () => {
	return http.get<any[]>(PORT3 + `/version/list`);
};

/**
 * 保存版本
 * @param data
 */
export const saveVersion = (data: any) => {
	return http.get<any>(PORT3 + `/version/save`, data);
};

/**
 * 下载文件
 * @param data
 */
export const downloadFile = (data: any) => {
	fetch(PORT3 + `/download/${data.id}`)
		.then(response => response.blob())
		.then(blob => {
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = data.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch(e => console.error("下载出错:", e));
};
