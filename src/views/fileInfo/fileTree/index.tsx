import { useEffect, useState } from "react";
import { getDocumentTree } from "@/api/modules/fileManager";
import { Tree } from "antd";
import type { GetProps, TreeDataNode } from "antd";

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

const treeData: TreeDataNode[] = [
	{
		title: "parent 0",
		key: "0-0",
		children: [
			{ title: "leaf 0-0", key: "0-0-0", isLeaf: true },
			{ title: "leaf 0-1", key: "0-0-1", isLeaf: true }
		]
	},
	{
		title: "parent 1",
		key: "0-1",
		children: [
			{ title: "leaf 1-0", key: "0-1-0", isLeaf: true },
			{ title: "leaf 1-1", key: "0-1-1", isLeaf: true }
		]
	}
];

const parseTreeData = (data: any) => {
	const treeData: TreeDataNode[] = [];
	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		const { name, children } = item;
		const node: TreeDataNode = {
			title: name,
			key: name,
			children: [],
			isLeaf: false
		};
		if (children) {
			node.children = parseTreeData(children);
		} else {
			node.isLeaf = true;
		}
		treeData.push(node);
	}
	return treeData;
};

const FileTree = () => {
	const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
	useEffect(() => {
		const asyncFn = async () => {
			const { data } = await getDocumentTree();
			const treeData = parseTreeData(data);
			setTreeData(treeData);
			console.log(data);
		};
		asyncFn();
	}, []);

	return (
		<div className="card content-box">
			<div className="auth">没想好啥功能合适就先只做展示了</div>
			<DirectoryTree treeData={treeData} />
		</div>
	);
};
export default FileTree;
