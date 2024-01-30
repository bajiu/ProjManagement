import { RouteObject } from "@/routers/interface";
import { LayoutIndex } from "@/routers/constant";
import lazyLoad from "@/routers/utils/lazyLoad";
import React from "react";

// mdemo 模块

const demoRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "文件管理"
		},
		children: [
			{
				path: "/menu/menu1",
				element: lazyLoad(React.lazy(() => import("@/views/menu/menu1/index"))),
				meta: {
					requiresAuth: true,
					title: "菜单1",
					key: "menu1"
				}
			},
			{
				path: "/demo/fileManager",
				element: lazyLoad(React.lazy(() => import("@/views/demo/fileManager/index"))),
				meta: {
					requiresAuth: true,
					title: "文件管理",
					key: "fileManager"
				}
			}
		]
	}
];
export default demoRouter;
