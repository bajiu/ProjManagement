import { Button, DatePicker, Space, Table, Tag, Upload, Modal, Form, Input, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useAuthButtons from "@/hooks/useAuthButtons";
import type { UploadProps } from "antd";
import { useEffect, useState } from "react";
import "./index.less";
import { downloadFile, getDocumentList, getVersionList, saveVersion } from "@/api/modules/fileManager";

// 整理数据结构
const parseList = (list: any[], options: any[]) => {
	return list.map((item: any, index) => {
		return {
			id: index + 1,
			key: item._id,
			name: item.name,
			version: options.find((version: any) => version._id === item.version)?.name
		};
	});
};

const FileManager = () => {
	// 按钮权限
	// const { BUTTONS } = useAuthButtons();
	// const { RangePicker } = DatePicker;
	const [documentList, setDocumentList] = useState([] as any[]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { Option } = Select;
	const [options, setOptions] = useState([] as any[]);
	const [activeVersion, setActiveVersion] = useState("");
	const [form] = Form.useForm();
	// @ts-ignore
	useEffect(() => {
		const asyncFn = async () => {
			// console.log(BUTTONS);
			// const { data } = await getDocumentList();
			// console.log(data);
			// // getDocumentTree();
			// const a = parseList(data) as any[];
			// setDocumentList(a);
			// console.log(documentList);
			const options: any = await refreshVersionInfo();
			const documentRes: any = await getDocumentList();
			const documentList = parseList(documentRes.data, options) as any[];
			setDocumentList(documentList || []);
		};
		asyncFn();
	}, []);

	const refreshVersionInfo = async () => {
		// 获取版本信息
		const versionRes = await getVersionList();
		setOptions(versionRes.data || []);
		return versionRes.data;
	};
	const refreshDocumentList = async (data: any) => {
		// 根据ID获取文件列表
		const documentRes: any = await getDocumentList(data);
		const documentList = parseList(documentRes.data, options) as any[];
		setDocumentList(documentList || []);
	};
	const showModal = () => {
		setIsModalOpen(true);
	};
	const versionChange = async (value: any) => {
		const item = options.find((item: any) => item._id === value);
		console.log(item);
		setActiveVersion(value);
		await refreshDocumentList({ version: value });
	};

	// 上传文件
	const uploadProps: UploadProps = {
		action: "/v1/file/upload",
		headers: {
			authorization: "authorization-text",
			version: activeVersion || ""
		},
		onChange({ file, fileList }) {
			if (file.status !== "uploading") {
				console.log(file, fileList);
			}
			if (file.status === "done") {
				refreshDocumentList({ version: activeVersion });
			}
		}
	};
	// 下载文件
	const download = async (recordId: any, name: string) => {
		console.log(recordId, name);
		await downloadFile({ id: recordId, name: name });
	};
	// 保存版本信息
	const submitVersion = async () => {
		console.log("submit");
		console.log(form.getFieldsValue());
		try {
			await saveVersion(form.getFieldsValue());
			await refreshVersionInfo();
			setIsModalOpen(false);
		} catch (error) {
			console.error(error);
		}
	};


	const columns: any[] = [
		{
			title: "序号",
			dataIndex: "id",
			key: "id",
			align: "center"
		},
		{
			title: "文件名",
			dataIndex: "name",
			key: "name",
			align: "center",
			width: "50%"
		},
		{
			title: "版本",
			dataIndex: "version",
			key: "version",
			align: "center"
		},
		// {
		// 	title: "标签",
		// 	dataIndex: "tag",
		// 	key: "tag",
		// 	align: "center",
		// 	render: (_: any, { tags }: any) => (
		// 		// TODO 添加容错
		// 		<>
		// 			{tags.map((tag: any) => {
		// 				let color = tag.length > 5 ? "geekblue" : "green";
		// 				if (tag === "loser") {
		// 					color = "volcano";
		// 				}
		// 				return (
		// 					<Tag color={color} key={tag}>
		// 						{tag}
		// 					</Tag>
		// 				);
		// 			})}
		// 		</>
		// 	)
		// },
		{
			title: "操作",
			dataIndex: "address",
			key: "address",
			align: "center",
			render: (_: any, record: any) => (
				<>
					<Button type="link" onClick={() => download(record.key, record.name)}>
						下载
					</Button>
					<Button type="link" onClick={() => message.warn("不让删除")}>
						删除
					</Button>
				</>
			)
		}
	];
	return (
		<div className="card content-box">
			{/*<div className="date">*/}
			{/*	/!*<span>切换国际化的时候看我 😎 ：</span>*!/*/}
			{/*	<RangePicker />*/}
			{/*</div>*/}
			<div className="auth">
				<Select style={{ width: 200 }} placeholder="选择版本" onChange={versionChange} allowClear>
					{options.map((item: any) => (
						<Option key={item._id} value={item._id}>
							{item.name}
						</Option>
					))}
				</Select>
				<Button onClick={showModal} type="primary" style={{ float: "right" }}>
					创建新版本
				</Button>
				{activeVersion && (
					<Upload {...uploadProps}>
						<Button style={{ marginLeft: 20 }} icon={<UploadOutlined />}>
							上传文档
						</Button>
					</Upload>
				)}


			</div>

			{/*<div className="auth">*/}
			{/*	/!*<Space>*!/*/}
			{/*	/!*	{BUTTONS && <Button type="primary">我是 Admin && User 能看到的按钮</Button>}*!/*/}
			{/*	/!*	{BUTTONS && <Button type="primary">我是 Admin 能看到的按钮</Button>}*!/*/}
			{/*	/!*	{BUTTONS && <Button type="primary">我是 User 能看到的按钮</Button>}*!/*/}
			{/*	/!*</Space>*!/*/}
			<Space>


			</Space>
			{/*</div>*/}
			<Table bordered={true} dataSource={documentList} columns={columns} />
			<Modal title="新增版本" open={isModalOpen} onOk={submitVersion} onCancel={() => setIsModalOpen(false)}>
				<div className="card content-box">
					<Form form={form}>
						<Form.Item name="version" label="新增版本">
							<Input placeholder="版本名称" />
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</div>
	);
};

export default FileManager;
