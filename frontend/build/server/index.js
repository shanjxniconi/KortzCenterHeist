import { Form, Outlet, Scripts, ServerRouter, UNSAFE_withComponentProps, useFetcher } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
import * as process from "node:process";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.web.tsx
var entry_server_web_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	let shellRendered = false;
	let userAgent = request.headers.get("user-agent");
	const body = await renderToReadableStream(/* @__PURE__ */ jsx(ServerRouter, {
		context: routerContext,
		url: request.url
	}), {
		signal: AbortSignal.timeout(6e3),
		onError(error) {
			responseStatusCode = 500;
			if (shellRendered) console.error(error);
		}
	});
	shellRendered = true;
	if (userAgent && isbot(userAgent) || routerContext.isSpaMode) await body.allReady;
	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({ default: () => root_default });
var root_default = UNSAFE_withComponentProps(function Root() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "zh-CN",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx("title", { children: "GTAOL Helper" })
		] }), /* @__PURE__ */ jsxs("body", { children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Scripts, {})] })]
	});
});
//#endregion
//#region app/.server/errors.ts
var ServerError = class extends Error {
	httpStatus;
	code;
	constructor(httpStatus, error) {
		super(error ? `${error.code || ""}` || void 0 : void 0);
		this.httpStatus = httpStatus || null;
		this.code = error.code || null;
	}
};
var ClientError = class extends ServerError {
	constructor(httpStatus, error) {
		super(httpStatus, error);
	}
};
var AuthError = class extends ClientError {
	constructor(httpStatus, error) {
		super(httpStatus, error);
	}
};
var ForbiddenError = class extends ClientError {
	constructor(httpStatus, error) {
		super(httpStatus, error);
	}
};
var BadRequestError = class extends ClientError {
	constructor(httpStatus, error) {
		super(httpStatus, error);
	}
};
//#endregion
//#region app/.server/facade.ts
var H;
function initWithHealthHelper(HEALTH) {
	H = HEALTH;
}
var I;
function initWithItemHelper(ITEM) {
	I = ITEM;
}
async function checkHealth() {
	return (await H.checkHealth().catch((reason) => {
		console.error("Failed to do health-check :: ", reason);
		throw new BadRequestError(400, reason);
	})).obj;
}
async function calcItems(itemRequest) {
	const response = (await I.calcItems(itemRequest).catch((reason) => {
		console.error("Failed to do item-calc :: ", reason);
		throw new BadRequestError(400, reason);
	})).obj;
	if (Array.isArray(response) && response.length > 0) return response[0];
	return response;
}
//#endregion
//#region app/routes/common/kortz.tsx
var kortz_exports = /* @__PURE__ */ __exportAll({
	action: () => action,
	default: () => kortz_default,
	loader: () => loader$1
});
var ITEM_LIST = [
	{
		name: "展厅手镯",
		type: "scattered",
		location: "showroom",
		value: 0,
		isAvailable: true
	},
	{
		name: "陨石",
		type: "whole",
		location: "showroom",
		value: 0,
		isAvailable: true
	},
	{
		name: "展厅女神",
		type: "whole",
		location: "showroom",
		value: 0,
		isAvailable: true
	},
	{
		name: "钻石",
		type: "showcase",
		location: "showroom",
		value: 0,
		isAvailable: true
	},
	{
		name: "维纳斯",
		type: "showcase",
		location: "showroom",
		value: 0,
		isAvailable: true
	},
	{
		name: "线条",
		type: "painting",
		location: "showroom",
		value: 0,
		isAvailable: true
	},
	{
		name: "工厂",
		type: "painting",
		location: "showroom",
		value: 0,
		isAvailable: true
	},
	{
		name: "2楼手镯",
		type: "scattered",
		location: "secondFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "2楼蛋",
		type: "whole",
		location: "secondFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "项链",
		type: "showcase",
		location: "secondFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "马",
		type: "showcase",
		location: "secondFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "漫画",
		type: "painting",
		location: "secondFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "枪",
		type: "painting",
		location: "secondFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "1楼探头戒指",
		type: "scattered",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "1楼戒指",
		type: "scattered",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "1楼梯边戒指",
		type: "scattered",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "1楼手镯",
		type: "scattered",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "1楼墙边手镯",
		type: "scattered",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "1楼女神",
		type: "whole",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "蓝底小人",
		type: "painting",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "变形小人",
		type: "painting",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "两个女人",
		type: "painting",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "抽象牛",
		type: "painting",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "橘子树",
		type: "painting",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "人像",
		type: "painting",
		location: "firstFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "0楼手镯",
		type: "scattered",
		location: "groundFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "0楼蛋",
		type: "whole",
		location: "groundFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "骷髅头",
		type: "showcase",
		location: "groundFloor",
		value: 0,
		isAvailable: true
	},
	{
		name: "秋千",
		type: "painting",
		location: "vault",
		value: 0,
		isAvailable: true
	},
	{
		name: "猎人",
		type: "painting",
		location: "vault",
		value: 0,
		isAvailable: true
	},
	{
		name: "仙人掌",
		type: "painting",
		location: "vault",
		value: 0,
		isAvailable: true
	},
	{
		name: "狗",
		type: "painting",
		location: "vault",
		value: 0,
		isAvailable: true
	},
	{
		name: "钱袋",
		type: "showcase",
		location: "vault",
		value: 12.5,
		isAvailable: true
	}
];
var ITEM_VOLUME = {
	scattered: 1,
	whole: 2,
	showcase: 3,
	painting: 5
};
var LOCATION_LABELS = {
	showroom: "展厅",
	secondFloor: "2楼",
	firstFloor: "1楼",
	groundFloor: "0楼",
	vault: "地下室"
};
var TYPE_LABELS = {
	scattered: "零散",
	whole: "整体",
	showcase: "高柜",
	painting: "画"
};
var locations = [
	"showroom",
	"secondFloor",
	"firstFloor",
	"groundFloor",
	"vault"
];
async function action({ request }) {
	const contentType = request.headers.get("content-type");
	let formData = new FormData();
	if (!contentType?.startsWith("application/x-www-form-urlencoded")) return { formData };
	else formData = await request.formData();
	return await calcItems({ ...JSON.parse(formData.get("itemRequest")) });
}
async function loader$1() {
	try {
		await checkHealth();
		return { healthy: true };
	} catch {
		return { healthy: false };
	}
}
var kortz_default = UNSAFE_withComponentProps(function Kortz({ loaderData }) {
	const [items, setItems] = useState(ITEM_LIST);
	const [actionData, setActionData] = useState();
	const fetcher = useFetcher();
	useEffect(() => {
		if (fetcher.data) setActionData(fetcher.data);
	}, [fetcher.data]);
	const getItemsByLocation = (location) => {
		return items.filter((item) => item.location === location);
	};
	const handleValueChange = (index, value) => {
		const currentItems = items || ITEM_LIST;
		if (index < 0 || index >= currentItems.length) return;
		const newItems = [...currentItems];
		const item = newItems[index];
		if (!item) return;
		item.value = value;
		setItems(newItems);
	};
	const handleToggleAvailable = (index) => {
		const currentItems = items || ITEM_LIST;
		if (index < 0 || index >= currentItems.length) return;
		const newItems = [...currentItems];
		const item = newItems[index];
		if (!item) return;
		item.isAvailable = !item.isAvailable;
		setItems(newItems);
	};
	const handleToggleRequired = (index) => {
		const currentItems = items || ITEM_LIST;
		if (index < 0 || index >= currentItems.length) return;
		const newItems = [...currentItems];
		const item = newItems[index];
		if (!item) return;
		item.isRequired = !item.isRequired;
		setItems(newItems);
	};
	const getItemIndex = (location, itemIndex) => {
		const locationIndex = locations.indexOf(location);
		let count = 0;
		for (let i = 0; i < locationIndex; i++) count += ITEM_LIST.filter((item) => item.location === locations[i]).length;
		return count + itemIndex;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const itemRequest = {
			multiPlayer: false,
			items: items.map(({ isRequired, ...item }) => ({
				...item,
				volume: ITEM_VOLUME[item.type || "scattered"] || 0
			})),
			requiredItems: items.filter((item) => item.isRequired).map(({ isRequired, ...item }) => ({
				...item,
				volume: ITEM_VOLUME[item.type || "scattered"] || 0
			}))
		};
		const formData = new FormData();
		formData.set("itemRequest", JSON.stringify(itemRequest));
		fetcher.submit(formData, {
			method: "POST",
			encType: "application/x-www-form-urlencoded"
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		style: { position: "relative" },
		children: [/* @__PURE__ */ jsx("div", { style: {
			position: "fixed",
			top: "20px",
			right: "40px",
			width: "24px",
			height: "24px",
			borderRadius: "50%",
			backgroundColor: loaderData.healthy ? "#27ae60" : "#e74c3c",
			boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
			zIndex: 1e3
		} }), /* @__PURE__ */ jsxs(Form, {
			onSubmit: handleSubmit,
			style: {
				maxWidth: "1400px",
				margin: "0 auto",
				padding: "30px",
				fontFamily: "Arial, sans-serif",
				background: "#f5f7fa"
			},
			children: [
				/* @__PURE__ */ jsx("h1", {
					style: {
						textAlign: "center",
						color: "#2c3e50",
						fontSize: "28px",
						marginBottom: "30px",
						fontWeight: "bold"
					},
					children: "💎 科兹中心豪劫物品价值分析器"
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						gap: "20px",
						justifyContent: "center",
						flexWrap: "wrap"
					},
					children: locations.map((location) => /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							borderRadius: "8px",
							padding: "15px",
							minWidth: "200px",
							boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
							borderTop: "3px solid #3498db"
						},
						children: [/* @__PURE__ */ jsx("h3", {
							style: {
								margin: "0 0 15px 0",
								color: "#2c3e50",
								fontSize: "16px",
								fontWeight: "bold",
								borderBottom: "2px solid #eee",
								paddingBottom: "8px"
							},
							children: LOCATION_LABELS[location]
						}), /* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "6px"
							},
							children: getItemsByLocation(location).map((item, itemIndex) => {
								const index = getItemIndex(location, itemIndex);
								const isRequired = item.isRequired;
								return /* @__PURE__ */ jsxs("div", {
									onClick: () => handleToggleAvailable(index),
									style: {
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										padding: "8px 10px",
										background: item.isAvailable ? isRequired ? "#fff3cd" : "#f8f9fa" : "#f0f0f0",
										borderRadius: "4px",
										opacity: item.isAvailable ? 1 : .5,
										cursor: "pointer",
										transition: "all 0.2s",
										borderLeft: isRequired ? "3px solid #ffc107" : "3px solid transparent"
									},
									children: [/* @__PURE__ */ jsxs("span", {
										style: {
											fontSize: "13px",
											color: "#34495e",
											textDecoration: item.isAvailable ? "none" : "line-through"
										},
										children: [
											item.name,
											" (",
											TYPE_LABELS[item.type || ""] || item.type || "",
											")"
										]
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "6px"
										},
										children: [/* @__PURE__ */ jsx("span", {
											onClick: (e) => {
												e.stopPropagation();
												handleToggleRequired(index);
											},
											style: {
												fontSize: "16px",
												cursor: "pointer",
												transition: "transform 0.2s"
											},
											onMouseOver: (e) => {
												e.currentTarget.style.transform = "scale(1.2)";
											},
											onMouseOut: (e) => {
												e.currentTarget.style.transform = "scale(1)";
											},
											children: isRequired ? "★" : "☆"
										}), /* @__PURE__ */ jsx("input", {
											type: "number",
											step: "0.01",
											min: "0",
											value: item.value || "",
											onChange: (e) => handleValueChange(index, parseFloat(e.target.value) || 0),
											onClick: (e) => e.stopPropagation(),
											disabled: !item.isAvailable || item.name === "钱袋",
											style: {
												width: "70px",
												padding: "4px 8px",
												border: "1px solid #ddd",
												borderRadius: "4px",
												fontSize: "13px",
												textAlign: "center",
												color: item.value > 0 ? "#27ae60" : "#95a5a6",
												fontWeight: "bold",
												cursor: item.isAvailable ? "text" : "not-allowed",
												backgroundColor: item.isAvailable ? "#fff" : "#f5f5f5"
											}
										})]
									})]
								}, index);
							})
						})]
					}, location))
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						textAlign: "center",
						marginTop: "40px"
					},
					children: /* @__PURE__ */ jsx("button", {
						type: "submit",
						style: {
							background: "#3498db",
							color: "white",
							border: "none",
							padding: "14px 50px",
							fontSize: "18px",
							fontWeight: "bold",
							borderRadius: "6px",
							cursor: "pointer",
							boxShadow: "0 4px 12px rgba(52, 152, 219, 0.4)",
							transition: "transform 0.2s, box-shadow 0.2s"
						},
						onMouseOver: (e) => {
							e.currentTarget.style.transform = "translateY(-2px)";
							e.currentTarget.style.boxShadow = "0 6px 16px rgba(52, 152, 219, 0.5)";
						},
						onMouseOut: (e) => {
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.boxShadow = "0 4px 12px rgba(52, 152, 219, 0.4)";
						},
						children: "💎 一键分析最优解"
					})
				}),
				actionData && /* @__PURE__ */ jsxs("div", {
					style: { marginTop: "30px" },
					children: [
						/* @__PURE__ */ jsx("h3", {
							style: {
								textAlign: "center",
								margin: "0 0 20px 0",
								color: "#2c3e50",
								fontSize: "22px",
								fontWeight: "bold"
							},
							children: "📊 分析结果"
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "20px",
								justifyContent: "center",
								flexWrap: "wrap",
								marginBottom: "30px"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										background: "#fff",
										borderRadius: "8px",
										padding: "20px",
										minWidth: "160px",
										textAlign: "center",
										boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
										borderTop: "3px solid #3498db"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "14px",
											color: "#7f8c8d",
											marginBottom: "8px"
										},
										children: "选中物品数"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "32px",
											fontWeight: "bold",
											color: "#2c3e50"
										},
										children: actionData.selectedItemCount
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										background: "#fff",
										borderRadius: "8px",
										padding: "20px",
										minWidth: "160px",
										textAlign: "center",
										boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
										borderTop: "3px solid #e74c3c"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "14px",
											color: "#7f8c8d",
											marginBottom: "8px"
										},
										children: "剩余容量"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "32px",
											fontWeight: "bold",
											color: "#e74c3c"
										},
										children: actionData.remainingVolume
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										background: "#fff",
										borderRadius: "8px",
										padding: "20px",
										minWidth: "160px",
										textAlign: "center",
										boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
										borderTop: "3px solid #27ae60"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "14px",
											color: "#7f8c8d",
											marginBottom: "8px"
										},
										children: "总价值"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "32px",
											fontWeight: "bold",
											color: "#27ae60"
										},
										children: actionData.totalValue
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								gap: "20px",
								justifyContent: "center",
								flexWrap: "wrap"
							},
							children: locations.map((location) => {
								const locationItems = fetcher.data.selectedItems.filter((item) => item.location === location);
								if (locationItems.length === 0) return null;
								return /* @__PURE__ */ jsxs("div", {
									style: {
										background: "#fff",
										borderRadius: "8px",
										padding: "15px",
										minWidth: "200px",
										boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
										borderTop: "3px solid #27ae60"
									},
									children: [/* @__PURE__ */ jsx("h3", {
										style: {
											margin: "0 0 15px 0",
											color: "#2c3e50",
											fontSize: "16px",
											fontWeight: "bold",
											borderBottom: "2px solid #eee",
											paddingBottom: "8px"
										},
										children: LOCATION_LABELS[location]
									}), /* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "6px"
										},
										children: locationItems.map((item, index) => /* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												padding: "10px",
												background: "#f8f9fa",
												borderRadius: "4px"
											},
											children: [/* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: "13px",
													color: "#34495e"
												},
												children: [
													item.name,
													" (",
													TYPE_LABELS[item.type || ""] || item.type || "",
													")"
												]
											}), /* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "10px"
												},
												children: [/* @__PURE__ */ jsxs("span", {
													style: {
														fontSize: "12px",
														color: "#7f8c8d",
														backgroundColor: "#eee",
														padding: "2px 6px",
														borderRadius: "3px"
													},
													children: ["容量: ", item.volume]
												}), /* @__PURE__ */ jsx("span", {
													style: {
														fontSize: "14px",
														color: "#27ae60",
														fontWeight: "bold"
													},
													children: item.value
												})]
											})]
										}, index))
									})]
								}, location);
							})
						})
					]
				})
			]
		})]
	});
});
//#endregion
//#region app/.server/health-helper.ts
function init$2(server) {
	const checkResponse = (response) => {
		const httpStatus = response.status;
		const statusTxt = response.statusText ? `status=[${response.status}]: ${response.statusText}` : `status=[${response.status}]`;
		const contentType = response.headers.get("Content-Type") || "";
		if (httpStatus <= 199 || httpStatus >= 300 && httpStatus <= 399) throw new Error(httpStatus.toString());
		else if (contentType.toLowerCase().startsWith("application/json")) return Promise.all([
			httpStatus,
			statusTxt,
			"",
			response.json()
		]);
		else return Promise.all([
			httpStatus,
			statusTxt,
			response.text(),
			{}
		]);
	};
	const convert = (path, result) => {
		const [httpStatus, statusTxt, text, json] = result;
		console.info(`${(/* @__PURE__ */ new Date()).toISOString()} -- Response from Health-Check Service :: Q[${path}] S[${httpStatus}]`);
		if (httpStatus == 401) throw new AuthError(httpStatus, json);
		else if (httpStatus == 403) throw new ForbiddenError(httpStatus, json);
		else if (httpStatus >= 400 && httpStatus <= 499) throw new BadRequestError(httpStatus, json);
		else if (httpStatus >= 500 && httpStatus <= 599) throw new ServerError(httpStatus, json);
		return {
			status: statusTxt,
			text,
			obj: json
		};
	};
	const checkHealth = async () => {
		const path = "/api/v1/health-check";
		console.info(`[HealthHelper] Fetching health check from: ${server}${path}`);
		return fetch(`${server}${path}`, { method: "GET" }).then((response) => checkResponse(response)).then((result) => convert(path, result));
	};
	console.info(`healthHelper initialized.`);
	return { checkHealth };
}
//#endregion
//#region app/.server/item-helper.ts
function init$1(server) {
	const checkResponse = (response) => {
		const httpStatus = response.status;
		const statusTxt = response.statusText ? `status=[${response.status}]: ${response.statusText}` : `status=[${response.status}]`;
		const contentType = response.headers.get("Content-Type") || "";
		if (httpStatus < 200 || httpStatus >= 300) throw new Error(httpStatus.toString());
		else if (contentType.toLowerCase().startsWith("application/json")) return Promise.all([
			httpStatus,
			statusTxt,
			"",
			response.json()
		]);
		else return Promise.all([
			httpStatus,
			statusTxt,
			response.text(),
			{}
		]);
	};
	const convert = (path, result) => {
		const [httpStatus, statusTxt, text, json] = result;
		console.info(`${(/* @__PURE__ */ new Date()).toISOString()} -- Response from Item Service :: Q[${path}] S[${httpStatus}]`);
		if (httpStatus == 401) throw new AuthError(httpStatus, json);
		else if (httpStatus == 403) throw new ForbiddenError(httpStatus, json);
		else if (httpStatus >= 400 && httpStatus <= 499) throw new BadRequestError(httpStatus, json);
		else if (httpStatus >= 500 && httpStatus <= 599) throw new ServerError(httpStatus, json);
		return {
			status: statusTxt,
			text,
			obj: json
		};
	};
	const calcItems = async (requestBody) => {
		const path = "/api/v1/calcItems";
		const json = JSON.stringify(requestBody);
		console.info(`[ItemHelper] Fetching Items from: ${server}${path}`);
		console.info(`[ItemHelper] Request body: ${json}`);
		return fetch(`${server}${path}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: json
		}).then((response) => checkResponse(response)).then((result) => convert(path, result));
	};
	console.info(`ItemHelper initialized.`);
	return { calcItems };
}
//#endregion
//#region app/.server/helpers.ts
var HEALTH;
var ITEM;
var started = false;
var initializedAt = void 0;
async function init() {
	if (!started) {
		dotenv.config();
		const env = process.env["NODE_ENV"] || "dev";
		const server = process.env["API_BASE_URL"] || process.env["SERVER"] || "http://localhost:8080";
		started = true;
		console.info(`:: CONFIGURATION INFO ::`);
		console.info(`env :: ${env}`);
		console.info(`server :: ${server}`);
		HEALTH = init$2(server);
		initWithHealthHelper(HEALTH);
		console.info(`completed load HEALTH .... ${(/* @__PURE__ */ new Date()).toISOString()}`);
		ITEM = init$1(server);
		initWithItemHelper(ITEM);
		console.info(`completed load ITEM .... ${(/* @__PURE__ */ new Date()).toISOString()}`);
		initializedAt = /* @__PURE__ */ new Date();
	}
	return initializedAt;
}
init().then((initializedAt) => console.info(`Initialized Application Context At ${initializedAt} [${started}]`));
//#endregion
//#region app/routes/common/health-check.tsx
var health_check_exports = /* @__PURE__ */ __exportAll({
	default: () => health_check_default,
	loader: () => loader
});
async function loader() {
	await init().then((datetime) => console.info("[HealthCheck] Initialized Application Context at", datetime));
	const result = await checkHealth();
	console.info("[HealthCheck] Completed health check result:", result);
	return { result };
}
var health_check_default = UNSAFE_withComponentProps(function HealthCheck({ loaderData }) {
	const data = loaderData.result;
	return /* @__PURE__ */ jsxs("div", {
		style: {
			padding: "2rem",
			fontFamily: "Arial, sans-serif"
		},
		children: [/* @__PURE__ */ jsx("h1", {
			style: { color: "#4CAF50" },
			children: "Health Check Status"
		}), /* @__PURE__ */ jsxs("div", {
			style: {
				marginTop: "1rem",
				padding: "1rem",
				border: "1px solid #eee",
				borderRadius: "8px"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: { marginBottom: "0.5rem" },
					children: [/* @__PURE__ */ jsx("strong", { children: "Status:" }), /* @__PURE__ */ jsx("span", {
						style: {
							marginLeft: "0.5rem",
							color: data.status === "UP" ? "#4CAF50" : "#f44336"
						},
						children: data.status
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: { marginBottom: "0.5rem" },
					children: [
						/* @__PURE__ */ jsx("strong", { children: "Service:" }),
						" ",
						/* @__PURE__ */ jsx("span", {
							style: { marginLeft: "0.5rem" },
							children: data.service
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: { marginBottom: "0.5rem" },
					children: [
						/* @__PURE__ */ jsx("strong", { children: "Version:" }),
						" ",
						/* @__PURE__ */ jsx("span", {
							style: { marginLeft: "0.5rem" },
							children: data.version
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("strong", { children: "Timestamp:" }),
					" ",
					/* @__PURE__ */ jsx("span", {
						style: { marginLeft: "0.5rem" },
						children: data.timestamp
					})
				] })
			]
		})]
	});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-DTuPEddf.js",
		"imports": ["/assets/jsx-runtime-CkbQ4PdP.js", "/assets/errorBoundaries-mTfxG9ou.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-DBDQt4Zj.js",
			"imports": ["/assets/jsx-runtime-CkbQ4PdP.js", "/assets/errorBoundaries-mTfxG9ou.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/common/kortz": {
			"id": "routes/common/kortz",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/kortz-CKfa6UyZ.js",
			"imports": ["/assets/jsx-runtime-CkbQ4PdP.js", "/assets/errorBoundaries-mTfxG9ou.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/common/health-check": {
			"id": "routes/common/health-check",
			"parentId": "root",
			"path": "/health-check",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/health-check-16gko-rb.js",
			"imports": ["/assets/jsx-runtime-CkbQ4PdP.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-af0aa4f6.js",
	"version": "af0aa4f6",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_web_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/common/kortz": {
		id: "routes/common/kortz",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: kortz_exports
	},
	"routes/common/health-check": {
		id: "routes/common/health-check",
		parentId: "root",
		path: "/health-check",
		index: void 0,
		caseSensitive: void 0,
		module: health_check_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
