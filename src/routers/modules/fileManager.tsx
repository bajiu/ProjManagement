import { RouteObject } from "@/routers/interface";
import { LayoutIndex } from "@/routers/constant";
import lazyLoad from "@/routers/utils/lazyLoad";
import React from "react";

// mdemo 模块

const fileRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "文件管理"
		},
		children: [
			{
				path: "/file/fileManager",
				element: lazyLoad(React.lazy(() => import("@/views/fileInfo/fileManager/index"))),
				meta: {
					requiresAuth: true,
					title: "文件管理",
					key: "fileManager"
				}
			},
			{
				path: "/file/fileTree",
				element: lazyLoad(React.lazy(() => import("@/views/fileInfo/fileTree/index"))),
				meta: {
					requiresAuth: true,
					title: "文档管理",
					key: "fileTree"
				}
			}
		]
	}
];
export default fileRouter;
