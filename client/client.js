window.__ModuleLoader__.load({
	id: "dsh-plain-plugin-menu",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/locales.ts
		const zh = {
			menu: "插件菜单",
			menuHint: "看看 DSH 还能装什么",
			title: "插件菜单",
			subtitle: "不用懂术语，也能挑到合适的插件",
			browse: "逛插件",
			installed: "已安装",
			search: "搜名字、功能或作者",
			refresh: "刷新公开数据",
			explain: "分类和指标说明",
			sortStars: "Star 多的在前",
			sortRecent: "最近维护的在前",
			sortAdded: "最近收录的在前",
			sortName: "按名字排",
			all: "全部",
			loading: "正在整理插件目录…",
			loadFailed: "目录加载失败，请稍后重试。",
			empty: "没找到符合条件的插件。",
			install: "安装",
			installedTag: "已安装",
			installing: "安装中…",
			confirmInstall: "确认安装",
			cancel: "取消",
			remove: "卸载",
			removing: "卸载中…",
			confirmRemove: "确认卸载",
			restart: "重启 DSH 后完全生效",
			active: "正在运行",
			inactive: "重启后加载",
			noBundle: "普通依赖",
			version: "版本",
			sourceLive: "公开数据已刷新",
			sourceCache: "使用刚才的数据",
			sourceSnapshot: "离线目录",
			curated: "社区清单已收录",
			archived: "仓库已归档",
			noLicense: "未标注 License",
			unknownMaintenance: "维护时间未知",
			safetyNote: "这些是帮助判断的公开信号，不代表代码已经通过安全审计。安装第三方插件前仍应查看源码；插件代码会在 DSH 进程中运行。",
			installWarning: "安装会把第三方代码加入当前 DSH profile。继续前请确认你信任仓库作者和源码。",
			categoryNote: "分类由插件名称、介绍、GitHub topics 和原目录分类的关键词规则得出；一个插件只放进最容易理解的那一类。",
			metricNote: "“最近维护”采用 GitHub pushed_at；Star、License、归档状态也来自 GitHub。它们能提供线索，但不能证明插件安全或质量。",
			details: "查看仓库",
			close: "关闭插件菜单",
			stars: "Star",
			maintained: "维护",
			license: "License",
			dependenciesEmpty: "当前 profile 没有树外插件依赖。",
			operationFailed: "操作失败"
		};
		const en = {
			menu: "Plugin menu",
			menuHint: "See what else DSH can do",
			title: "Plugin menu",
			subtitle: "Pick useful plugins without learning the jargon",
			browse: "Browse",
			installed: "Installed",
			search: "Search names, features, or authors",
			refresh: "Refresh public data",
			explain: "How labels work",
			sortStars: "Most stars",
			sortRecent: "Recently maintained",
			sortAdded: "Recently listed",
			sortName: "Name",
			all: "All",
			loading: "Organizing the plugin catalog…",
			loadFailed: "Could not load the catalog. Try again shortly.",
			empty: "No plugins match these filters.",
			install: "Install",
			installedTag: "Installed",
			installing: "Installing…",
			confirmInstall: "Confirm install",
			cancel: "Cancel",
			remove: "Remove",
			removing: "Removing…",
			confirmRemove: "Confirm removal",
			restart: "Fully applies after restarting DSH",
			active: "Running",
			inactive: "Loads after restart",
			noBundle: "Plain dependency",
			version: "Version",
			sourceLive: "Public data refreshed",
			sourceCache: "Using recent data",
			sourceSnapshot: "Offline catalog",
			curated: "Listed by the community catalog",
			archived: "Repository archived",
			noLicense: "No license declared",
			unknownMaintenance: "Maintenance date unknown",
			safetyNote: "These public signals help with judgment; they are not a security audit. Review third-party source before installing. Plugin code runs inside the DSH process.",
			installWarning: "This adds third-party code to the current DSH profile. Continue only if you trust the author and source.",
			categoryNote: "Categories use a transparent keyword rule over the plugin name, description, GitHub topics, and source catalog category. Each plugin goes into one plain-language bucket.",
			metricNote: "“Maintained” uses GitHub pushed_at. Stars, license, and archived state also come from GitHub. They are clues—not proof of security or quality.",
			details: "View repository",
			close: "Close plugin menu",
			stars: "Stars",
			maintained: "Maintained",
			license: "License",
			dependenciesEmpty: "This profile has no out-of-tree plugin dependencies.",
			operationFailed: "Operation failed"
		};
		//#endregion
		//#region src/client/menu-store.ts
		let open = false;
		const listeners = /* @__PURE__ */ new Set();
		const menuStore = {
			getSnapshot: () => open,
			subscribe(listener) {
				listeners.add(listener);
				return () => {
					listeners.delete(listener);
				};
			},
			setOpen(value) {
				if (value === open) return;
				open = value;
				for (const listener of listeners) listener();
			}
		};
		//#endregion
		//#region \0dsh-css:src/client/PluginMenu.module.css.mjs
		const css = ".E3D0QW_trigger{width:100%;min-height:36px;color:var(--dsw-alias-label-secondary,#626b7f);font:inherit;cursor:pointer;background:0 0;border:0;border-radius:10px;align-items:center;gap:9px;padding:7px 10px;display:flex;overflow:hidden}.E3D0QW_trigger:hover{background:var(--dsw-specific-sidebar-nav-item-hover,#eceff5);color:var(--dsw-alias-label-primary,#171b26)}.E3D0QW_triggerIcon{flex:0 0 18px;justify-content:center;align-items:center;display:inline-flex}.E3D0QW_triggerLabel{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.E3D0QW_backdrop{z-index:1400;box-sizing:border-box;background:color-mix(in srgb, var(--dsw-alias-bg-mask-1,#111827) 48%, transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);pointer-events:auto;place-items:center;padding:18px;animation:.16s ease-out E3D0QW_appear;display:grid;position:fixed;top:0;bottom:0;left:0;right:0}@keyframes E3D0QW_appear{0%{opacity:0}}.E3D0QW_menu{border:1px solid var(--dsw-alias-border-l2,#dfe3eb);background:var(--dsw-alias-bg-base,#fff);width:min(1220px,100%);height:min(840px,100%);min-height:520px;color:var(--dsw-alias-label-primary,#171b26);font-family:var(--dsw-font-family,Inter, ui-sans-serif, system-ui, sans-serif);border-radius:22px;flex-direction:column;animation:.19s cubic-bezier(.2,.8,.2,1) E3D0QW_lift;display:flex;overflow:hidden;box-shadow:0 28px 90px #06122c47}@keyframes E3D0QW_lift{0%{opacity:0;transform:translateY(10px)scale(.992)}}.E3D0QW_header{box-sizing:border-box;border-bottom:1px solid var(--dsw-alias-border-subtle,#edf0f5);flex:none;align-items:center;gap:14px;min-height:76px;padding:13px 18px 12px 22px;display:flex}.E3D0QW_brandIcon{color:#fff;background:linear-gradient(145deg, var(--dsw-static-deepseek-500,#4d6bfe), #7559e8);border-radius:13px;flex:0 0 42px;place-items:center;width:42px;height:42px;display:grid;box-shadow:0 7px 18px #4d6bfe38}.E3D0QW_heading{min-width:0}.E3D0QW_heading h1{letter-spacing:-.02em;margin:0;font-size:19px;line-height:25px}.E3D0QW_heading p{color:var(--dsw-alias-label-tertiary,#7c8598);margin:2px 0 0;font-size:12px}.E3D0QW_headerStats{align-items:center;gap:8px;margin-left:auto;display:flex}.E3D0QW_headerStats span{background:var(--dsw-alias-bg-layer-2,#f3f5f8);color:var(--dsw-alias-label-tertiary,#737d90);white-space:nowrap;border-radius:999px;padding:5px 9px;font-size:11px}.E3D0QW_close{width:36px;height:36px;color:var(--dsw-alias-label-secondary,#5d6678);cursor:pointer;background:0 0;border:0;border-radius:50%;place-items:center;margin-left:4px;padding:0;font-size:25px;line-height:1;display:grid}.E3D0QW_close:hover{background:var(--dsw-alias-interactive-bg-hover,#eef1f5)}.E3D0QW_tabs{box-sizing:border-box;border-bottom:1px solid var(--dsw-alias-border-subtle,#edf0f5);flex:none;align-items:end;gap:5px;min-height:48px;padding:0 22px;display:flex}.E3D0QW_tabs>button{height:48px;color:var(--dsw-alias-label-tertiary,#747e91);font:inherit;cursor:pointer;background:0 0;border:0;padding:0 13px;font-size:13px;position:relative}.E3D0QW_tabs>button[data-active=true]{color:var(--dsw-alias-label-primary,#141925);font-weight:600}.E3D0QW_tabs>button[data-active=true]:after{content:\"\";background:var(--dsw-alias-brand-primary,#4d6bfe);border-radius:2px 2px 0 0;height:2px;position:absolute;bottom:-1px;left:13px;right:13px}.E3D0QW_tabs>button span{background:var(--dsw-alias-bg-layer-2,#edf0f5);border-radius:999px;place-items:center;min-width:18px;height:18px;margin-left:7px;padding:0 5px;font-size:10px;display:inline-grid}.E3D0QW_tabsSpacer{flex:1}.E3D0QW_tabs .E3D0QW_explainButton{color:var(--dsw-alias-label-secondary,#5f697b);font-size:12px}.E3D0QW_explainer{border-bottom:1px solid var(--dsw-alias-border-subtle,#edf0f5);background:color-mix(in srgb, var(--dsw-alias-brand-primary,#4d6bfe) 5%, var(--dsw-alias-bg-base,#fff));flex:none;grid-template-columns:repeat(3,1fr);gap:14px;padding:13px 22px;display:grid}.E3D0QW_explainer p{color:var(--dsw-alias-label-secondary,#5f697b);margin:0;font-size:11px;line-height:1.55}.E3D0QW_notice,.E3D0QW_error{flex:none;align-items:center;gap:8px;padding:9px 18px;font-size:12px;display:flex}.E3D0QW_notice{color:var(--dsw-alias-state-success-primary,#087d52);background:var(--dsw-alias-state-success-tertiary,#e7f8f1)}.E3D0QW_error{color:var(--dsw-alias-state-error-primary,#bd2638);background:var(--dsw-alias-state-error-secondary,#fff0f1)}.E3D0QW_notice button,.E3D0QW_error button{color:inherit;cursor:pointer;background:0 0;border:0;margin-left:auto;font-size:17px}.E3D0QW_content{flex:1;grid-template-columns:205px 1fr;min-height:0;display:grid}.E3D0QW_categories{border-right:1px solid var(--dsw-alias-border-subtle,#edf0f5);background:var(--dsw-specific-sidebar-fill,#f8f9fb);min-height:0;padding:14px 10px;overflow:auto}.E3D0QW_categories button{width:100%;min-height:38px;color:var(--dsw-alias-label-secondary,#626c7e);text-align:left;font:inherit;cursor:pointer;background:0 0;border:0;border-radius:9px;grid-template-columns:25px 1fr auto;align-items:center;margin:1px 0;padding:7px 9px;font-size:12px;display:grid}.E3D0QW_categories button:hover{background:var(--dsw-specific-sidebar-nav-item-hover,#eceff5)}.E3D0QW_categories button[data-active=true]{background:var(--dsw-specific-sidebar-nav-item-active,#e7ebf5);color:var(--dsw-alias-label-primary,#151a26);font-weight:600}.E3D0QW_categories button b{font-family:var(--dsw-font-mono,ui-monospace, monospace);font-size:13px;font-weight:500}.E3D0QW_categories button em{min-width:25px;color:var(--dsw-alias-label-quaternary,#99a1af);text-align:right;font-size:10px;font-style:normal;font-weight:400}.E3D0QW_main{min-width:0;min-height:0;padding:14px 18px 22px;overflow:auto}.E3D0QW_toolbar{z-index:2;background:var(--dsw-alias-bg-base,#fff);grid-template-columns:minmax(220px,1fr) 190px auto;gap:9px;padding:14px 0 11px;display:grid;position:sticky;top:-14px}.E3D0QW_search{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,#dfe3ea);background:var(--dsw-alias-bg-layer-1,#fff);height:38px;color:var(--dsw-alias-label-tertiary,#798295);border-radius:10px;align-items:center;gap:8px;padding:0 10px;display:flex}.E3D0QW_search:focus-within{border-color:var(--dsw-alias-brand-primary,#4d6bfe);box-shadow:0 0 0 3px #4d6bfe1a}.E3D0QW_search input{min-width:0;color:var(--dsw-alias-label-primary,#171b26);font:inherit;background:0 0;border:0;outline:0;flex:1;font-size:12px}.E3D0QW_search button{color:inherit;cursor:pointer;background:0 0;border:0}.E3D0QW_toolbar select,.E3D0QW_refresh{border:1px solid var(--dsw-alias-border-l2,#dfe3ea);background:var(--dsw-alias-bg-layer-1,#fff);height:38px;color:var(--dsw-alias-label-secondary,#5f687b);font:inherit;cursor:pointer;border-radius:10px;padding:0 11px;font-size:11px}.E3D0QW_refresh:hover{background:var(--dsw-alias-interactive-bg-hover,#f0f2f6)}.E3D0QW_grid{opacity:1;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;transition:opacity .12s;display:grid}.E3D0QW_grid[aria-busy=true]{opacity:.7}.E3D0QW_card{border:1px solid var(--dsw-alias-border-l2,#e0e4eb);background:var(--dsw-alias-bg-layer-1,#fff);border-radius:14px;flex-direction:column;min-height:224px;padding:15px;transition:border-color .12s,box-shadow .12s,transform .12s;display:flex;position:relative;box-shadow:0 1px #00000005}.E3D0QW_card:hover{border-color:color-mix(in srgb, var(--dsw-alias-brand-primary,#4d6bfe) 30%, var(--dsw-alias-border-l2,#e0e4eb));transform:translateY(-1px);box-shadow:0 8px 24px #182a5312}.E3D0QW_card[data-archived=true]{opacity:.72}.E3D0QW_cardTop{align-items:center;gap:10px;display:flex}.E3D0QW_avatar{background:linear-gradient(145deg, color-mix(in srgb, var(--dsw-alias-brand-primary,#4d6bfe) 15%, var(--dsw-alias-bg-layer-2,#f0f2f6)), var(--dsw-alias-bg-layer-2,#eef1f5));width:38px;height:38px;color:var(--dsw-alias-brand-primary,#4d6bfe);border-radius:11px;flex:0 0 38px;place-items:center;font-size:15px;font-weight:700;display:grid}.E3D0QW_cardIdentity{flex:1;min-width:0}.E3D0QW_cardIdentity h3,.E3D0QW_installedMain h3{color:var(--dsw-alias-label-primary,#151a25);text-overflow:ellipsis;white-space:nowrap;margin:0;font-size:13px;line-height:19px;overflow:hidden}.E3D0QW_cardIdentity>span{color:var(--dsw-alias-label-quaternary,#949dac);text-overflow:ellipsis;white-space:nowrap;margin-top:1px;font-size:10px;display:block;overflow:hidden}.E3D0QW_categoryBadge{background:var(--dsw-alias-bg-layer-2,#f0f2f6);color:var(--dsw-alias-label-tertiary,#747e90);white-space:nowrap;border-radius:999px;align-items:center;gap:4px;padding:4px 7px;font-size:9px;display:inline-flex}.E3D0QW_categoryBadge b{font-family:var(--dsw-font-mono,ui-monospace, monospace);font-size:10px}.E3D0QW_description{min-height:48px;color:var(--dsw-alias-label-secondary,#5c6678);-webkit-line-clamp:3;-webkit-box-orient:vertical;margin:12px 0;font-size:11px;line-height:1.5;display:-webkit-box;overflow:hidden}.E3D0QW_signalRow{flex-wrap:wrap;gap:5px;margin-top:auto;display:flex}.E3D0QW_signalRow>span{background:var(--dsw-alias-bg-layer-2,#f2f4f7);color:var(--dsw-alias-label-tertiary,#727c8e);border-radius:6px;align-items:center;gap:4px;padding:3px 6px;font-size:9px;display:inline-flex}.E3D0QW_signal i,.E3D0QW_installedSignals i{background:var(--dsw-alias-label-quaternary,#9ba3b0);border-radius:50%;width:6px;height:6px}.E3D0QW_signal[data-tone=good] i{background:#16a56d}.E3D0QW_signal[data-tone=neutral] i{background:#4d6bfe}.E3D0QW_signal[data-tone=warn] i{background:#dc8b16}.E3D0QW_signal[data-tone=danger] i{background:#d83a4d}.E3D0QW_cardFoot{justify-content:space-between;align-items:center;min-height:30px;margin-top:11px;display:flex}.E3D0QW_cardFoot a,.E3D0QW_installedActions a{color:var(--dsw-alias-label-tertiary,#737d90);font-size:10px;text-decoration:none}.E3D0QW_cardFoot a:hover,.E3D0QW_installedActions a:hover{color:var(--dsw-alias-brand-primary,#4d6bfe)}.E3D0QW_primaryButton,.E3D0QW_secondaryButton,.E3D0QW_dangerButton,.E3D0QW_removeButton{height:29px;font:inherit;cursor:pointer;border-radius:8px;padding:0 10px;font-size:10px}.E3D0QW_primaryButton{background:var(--dsw-alias-button-primary-fill,#4d6bfe);color:#fff;border:0}.E3D0QW_primaryButton:hover{background:var(--dsw-alias-button-primary-hover,#405ce4)}.E3D0QW_primaryButton:disabled,.E3D0QW_dangerButton:disabled{opacity:.5;cursor:not-allowed}.E3D0QW_secondaryButton{border:1px solid var(--dsw-alias-border-l2,#dfe3ea);color:var(--dsw-alias-label-secondary,#5d6678);background:0 0}.E3D0QW_dangerButton{background:var(--dsw-alias-state-error-primary,#ca3446);color:#fff;border:0}.E3D0QW_removeButton{color:var(--dsw-alias-label-error,#ca3446);background:0 0;border:1px solid #0000}.E3D0QW_removeButton:hover{background:var(--dsw-alias-interactive-bg-hover-danger,#fff0f2)}.E3D0QW_confirmActions{gap:5px;display:flex}.E3D0QW_installedPill{background:var(--dsw-alias-state-success-tertiary,#e6f7ef);color:var(--dsw-alias-state-success-primary,#087c53);border-radius:999px;padding:4px 8px;font-size:9px}.E3D0QW_warning{background:var(--dsw-alias-state-warn-tertiary,#fff6df);color:var(--dsw-alias-state-warn-label,#8b5d0b);border-radius:8px;margin:8px 0 0;padding:7px 8px;font-size:9px;line-height:1.45}.E3D0QW_state{color:var(--dsw-alias-label-tertiary,#788194);text-align:center;padding:60px 20px;font-size:12px}.E3D0QW_installedPane{background:var(--dsw-alias-bg-layer-2,#f6f7f9);flex:1;min-height:0;padding:24px;overflow:auto}.E3D0QW_installedHeader{justify-content:space-between;align-items:center;max-width:900px;margin:0 auto 16px;display:flex}.E3D0QW_installedHeader h2{margin:0;font-size:17px}.E3D0QW_installedHeader p{color:var(--dsw-alias-label-tertiary,#788194);margin:4px 0 0;font-size:11px}.E3D0QW_installedHeader>span{background:var(--dsw-alias-state-warn-tertiary,#fff6df);color:var(--dsw-alias-state-warn-label,#8b5d0b);border-radius:8px;padding:6px 9px;font-size:10px}.E3D0QW_installedGrid{gap:9px;max-width:900px;margin:0 auto;display:grid}.E3D0QW_installedCard{border:1px solid var(--dsw-alias-border-l2,#e0e4eb);background:var(--dsw-alias-bg-layer-1,#fff);border-radius:13px;grid-template-columns:minmax(260px,1fr) auto minmax(180px,auto);align-items:center;gap:20px;padding:13px 15px;display:grid}.E3D0QW_installedMain{align-items:center;gap:11px;min-width:0;display:flex}.E3D0QW_installedMain>div:last-child{min-width:0}.E3D0QW_installedMain p{color:var(--dsw-alias-label-tertiary,#788194);text-overflow:ellipsis;white-space:nowrap;margin:2px 0 0;font-size:10px;overflow:hidden}.E3D0QW_installedSignals{align-items:center;gap:7px;display:flex}.E3D0QW_installedSignals span{color:var(--dsw-alias-label-tertiary,#788194);align-items:center;gap:5px;font-size:9px;display:inline-flex}.E3D0QW_installedSignals span[data-active=true] i{background:#16a56d}.E3D0QW_installedActions{justify-content:flex-end;align-items:center;gap:8px;display:flex}@media (max-width:900px){.E3D0QW_backdrop{padding:0}.E3D0QW_menu{border:0;border-radius:0;width:100%;height:100%;min-height:0}.E3D0QW_headerStats{display:none}.E3D0QW_content{grid-template-columns:165px 1fr}.E3D0QW_grid{grid-template-columns:1fr}.E3D0QW_toolbar{grid-template-columns:1fr auto}.E3D0QW_toolbar select{display:none}.E3D0QW_explainer{grid-template-columns:1fr}.E3D0QW_installedCard{grid-template-columns:1fr auto}.E3D0QW_installedSignals{display:none}}@media (max-width:620px){.E3D0QW_heading p,.E3D0QW_tabs .E3D0QW_explainButton{display:none}.E3D0QW_content{flex-direction:column;display:flex}.E3D0QW_categories{border-right:0;border-bottom:1px solid var(--dsw-alias-border-subtle,#edf0f5);flex:none;gap:5px;padding:8px 10px;display:flex;overflow-x:auto}.E3D0QW_categories button{width:auto;min-width:max-content;min-height:32px;margin:0;padding:6px 8px;display:flex}.E3D0QW_categories button b{margin-right:4px}.E3D0QW_categories button em{margin-left:6px}.E3D0QW_toolbar{grid-template-columns:1fr}.E3D0QW_refresh{display:none}.E3D0QW_installedPane{padding:15px}.E3D0QW_installedCard{grid-template-columns:1fr;gap:10px}.E3D0QW_installedActions{justify-content:space-between}}@media (prefers-reduced-motion:reduce){.E3D0QW_backdrop,.E3D0QW_menu{animation:none}.E3D0QW_card{transition:none}}";
		const styleId = "dsh-plain-plugin-menu/PluginMenu.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(styleId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plain-plugin-menu";
			tag.dataset.pluginCss = styleId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var PluginMenu_module_css_default = {
			"primaryButton": "E3D0QW_primaryButton",
			"dangerButton": "E3D0QW_dangerButton",
			"cardTop": "E3D0QW_cardTop",
			"confirmActions": "E3D0QW_confirmActions",
			"signal": "E3D0QW_signal",
			"warning": "E3D0QW_warning",
			"signalRow": "E3D0QW_signalRow",
			"lift": "E3D0QW_lift",
			"installedPane": "E3D0QW_installedPane",
			"cardIdentity": "E3D0QW_cardIdentity",
			"toolbar": "E3D0QW_toolbar",
			"installedSignals": "E3D0QW_installedSignals",
			"installedHeader": "E3D0QW_installedHeader",
			"header": "E3D0QW_header",
			"error": "E3D0QW_error",
			"installedGrid": "E3D0QW_installedGrid",
			"tabs": "E3D0QW_tabs",
			"explainButton": "E3D0QW_explainButton",
			"explainer": "E3D0QW_explainer",
			"installedCard": "E3D0QW_installedCard",
			"secondaryButton": "E3D0QW_secondaryButton",
			"card": "E3D0QW_card",
			"triggerIcon": "E3D0QW_triggerIcon",
			"categories": "E3D0QW_categories",
			"grid": "E3D0QW_grid",
			"categoryBadge": "E3D0QW_categoryBadge",
			"installedPill": "E3D0QW_installedPill",
			"installedActions": "E3D0QW_installedActions",
			"appear": "E3D0QW_appear",
			"content": "E3D0QW_content",
			"brandIcon": "E3D0QW_brandIcon",
			"removeButton": "E3D0QW_removeButton",
			"installedMain": "E3D0QW_installedMain",
			"refresh": "E3D0QW_refresh",
			"main": "E3D0QW_main",
			"state": "E3D0QW_state",
			"backdrop": "E3D0QW_backdrop",
			"description": "E3D0QW_description",
			"cardFoot": "E3D0QW_cardFoot",
			"avatar": "E3D0QW_avatar",
			"trigger": "E3D0QW_trigger",
			"headerStats": "E3D0QW_headerStats",
			"tabsSpacer": "E3D0QW_tabsSpacer",
			"triggerLabel": "E3D0QW_triggerLabel",
			"search": "E3D0QW_search",
			"menu": "E3D0QW_menu",
			"close": "E3D0QW_close",
			"heading": "E3D0QW_heading",
			"notice": "E3D0QW_notice"
		};
		//#endregion
		//#region src/client/PluginMenu.tsx
		const CATEGORIES = [
			{
				id: "skin",
				icon: "◐",
				zh: "皮肤和界面",
				en: "Looks & layout"
			},
			{
				id: "research",
				icon: "⌕",
				zh: "查资料",
				en: "Research"
			},
			{
				id: "code",
				icon: "</>",
				zh: "写代码",
				en: "Coding"
			},
			{
				id: "vision",
				icon: "◉",
				zh: "看图做图",
				en: "Images & design"
			},
			{
				id: "memory",
				icon: "◇",
				zh: "记住事情",
				en: "Memory"
			},
			{
				id: "automation",
				icon: "↻",
				zh: "自动干活",
				en: "Automation"
			},
			{
				id: "messages",
				icon: "↗",
				zh: "发消息",
				en: "Notifications"
			},
			{
				id: "files",
				icon: "▱",
				zh: "管文件",
				en: "Files & docs"
			},
			{
				id: "models",
				icon: "◎",
				zh: "接模型",
				en: "Models"
			},
			{
				id: "safety",
				icon: "⬡",
				zh: "安全守门",
				en: "Safety"
			},
			{
				id: "skills",
				icon: "✦",
				zh: "小技能",
				en: "Skills"
			},
			{
				id: "chat",
				icon: "◌",
				zh: "聊得更顺",
				en: "Chat helpers"
			},
			{
				id: "fun",
				icon: "☺",
				zh: "玩点花的",
				en: "Just for fun"
			},
			{
				id: "plugins",
				icon: "▦",
				zh: "管插件",
				en: "Plugin tools"
			},
			{
				id: "other",
				icon: "…",
				zh: "其他",
				en: "Other"
			}
		];
		let cachedCatalog = null;
		let cachedInstalled = null;
		function menuIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 20 20",
				width: "18",
				height: "18",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "2",
						y: "2",
						width: "6",
						height: "6",
						rx: "2",
						fill: "currentColor"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "12",
						y: "2",
						width: "6",
						height: "6",
						rx: "2",
						fill: "currentColor",
						opacity: ".55"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "2",
						y: "12",
						width: "6",
						height: "6",
						rx: "2",
						fill: "currentColor",
						opacity: ".55"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M15 11v7m-3.5-3.5h7",
						stroke: "currentColor",
						strokeWidth: "1.8",
						strokeLinecap: "round"
					})
				]
			});
		}
		function PluginMenuTrigger({ wide, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				className: PluginMenu_module_css_default.trigger,
				type: "button",
				title: t("menuHint"),
				onClick: () => menuStore.setOpen(true),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: PluginMenu_module_css_default.triggerIcon,
					children: menuIcon()
				}), wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: PluginMenu_module_css_default.triggerLabel,
					children: t("menu")
				}) : null]
			});
		}
		function request(path, init) {
			return fetch(path, {
				cache: "no-store",
				...init
			}).then(async (response) => {
				const body = await response.json();
				if (!response.ok) throw new Error(body.message ?? `HTTP ${response.status}`);
				return body;
			});
		}
		function mutate(path, body) {
			return request(path, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-dsh-plugin-menu": "1"
				},
				body: JSON.stringify(body)
			});
		}
		function repoFromSpec(spec) {
			return /github:([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)/i.exec(spec)?.[1]?.toLocaleLowerCase() ?? null;
		}
		function installedMatch(plugin, installed) {
			if (plugin.npm !== null) {
				const exact = installed.find((item) => item.name.toLocaleLowerCase() === plugin.npm?.toLocaleLowerCase());
				if (exact !== void 0) return exact;
			}
			const repo = plugin.repo.toLocaleLowerCase();
			return installed.find((item) => repoFromSpec(item.spec) === repo || item.name.toLocaleLowerCase() === plugin.name.toLocaleLowerCase());
		}
		function compactNumber(value, language) {
			return new Intl.NumberFormat(language, {
				notation: "compact",
				maximumFractionDigits: 1
			}).format(value);
		}
		function maintenanceLabel(value, language, t) {
			if (value === null) return t("unknownMaintenance");
			const days = Math.max(0, Math.floor((Date.now() - Date.parse(value)) / 864e5));
			if (language === "zh") {
				if (days === 0) return "今天维护";
				if (days < 30) return `${days} 天前维护`;
				if (days < 365) return `${Math.floor(days / 30)} 个月前维护`;
				return `${Math.floor(days / 365)} 年前维护`;
			}
			if (days === 0) return "Maintained today";
			if (days < 30) return `Maintained ${days}d ago`;
			if (days < 365) return `Maintained ${Math.floor(days / 30)}mo ago`;
			return `Maintained ${Math.floor(days / 365)}y ago`;
		}
		function signal(plugin, language) {
			if (plugin.archived) return {
				tone: "danger",
				label: language === "zh" ? "已归档" : "Archived"
			};
			if (plugin.maintenanceAt === null) return {
				tone: "muted",
				label: language === "zh" ? "信息不全" : "Limited data"
			};
			const days = (Date.now() - Date.parse(plugin.maintenanceAt)) / 864e5;
			if (days <= 90) return {
				tone: "good",
				label: language === "zh" ? "最近有人维护" : "Recently maintained"
			};
			if (days <= 365) return {
				tone: "neutral",
				label: language === "zh" ? "还在维护" : "Maintained"
			};
			return {
				tone: "warn",
				label: language === "zh" ? "很久没更新" : "Quiet for a while"
			};
		}
		function categoryMeta(id, language) {
			const value = CATEGORIES.find((item) => item.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
			return {
				...value,
				zh: language === "zh" ? value.zh : value.en
			};
		}
		function PluginCard({ plugin, dependency, language, t, busy, armed, onArm, onInstall }) {
			const status = signal(plugin, language);
			const category = categoryMeta(plugin.category, language);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: PluginMenu_module_css_default.card,
				"data-archived": plugin.archived ? "true" : void 0,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginMenu_module_css_default.cardTop,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: PluginMenu_module_css_default.avatar,
								children: plugin.name.replace(/^dsh[-_]/i, "").charAt(0).toUpperCase() || "P"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: PluginMenu_module_css_default.cardIdentity,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
									title: plugin.name,
									children: plugin.name
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: plugin.owner })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: PluginMenu_module_css_default.categoryBadge,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: category.icon }), category.zh]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: PluginMenu_module_css_default.description,
						children: language === "zh" ? plugin.description.zh : plugin.description.en
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginMenu_module_css_default.signalRow,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: PluginMenu_module_css_default.signal,
								"data-tone": status.tone,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}), status.label]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["★ ", compactNumber(plugin.stars, language)] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: maintenanceLabel(plugin.maintenanceAt, language, t) }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: plugin.license ?? t("noLicense") })
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginMenu_module_css_default.cardFoot,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
							href: plugin.url,
							target: "_blank",
							rel: "noreferrer",
							children: [t("details"), " ↗"]
						}), dependency !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: PluginMenu_module_css_default.installedPill,
							children: ["✓ ", t("installedTag")]
						}) : armed ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: PluginMenu_module_css_default.confirmActions,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: PluginMenu_module_css_default.secondaryButton,
								onClick: onArm,
								children: t("cancel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: PluginMenu_module_css_default.primaryButton,
								disabled: busy,
								onClick: onInstall,
								children: busy ? t("installing") : t("confirmInstall")
							})]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: PluginMenu_module_css_default.primaryButton,
							disabled: plugin.installTarget === null || plugin.archived || busy,
							onClick: onArm,
							children: t("install")
						})]
					}),
					armed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: PluginMenu_module_css_default.warning,
						children: t("installWarning")
					}) : null
				]
			});
		}
		function InstalledCard({ dependency, t, armed, busy, onArm, onRemove }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: PluginMenu_module_css_default.installedCard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginMenu_module_css_default.installedMain,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: PluginMenu_module_css_default.avatar,
							children: dependency.name.replace(/^@.*\//, "").charAt(0).toUpperCase()
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: dependency.name }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: dependency.version === null ? dependency.spec : `${t("version")} ${dependency.version}` })] })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginMenu_module_css_default.installedSignals,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							"data-active": dependency.active ? "true" : "false",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}), dependency.active ? t("active") : t("inactive")]
						}), !dependency.bundle ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("noBundle") }) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginMenu_module_css_default.installedActions,
						children: [dependency.repository !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
							href: dependency.repository.replace(/^git\+/, "").replace(/\.git$/, ""),
							target: "_blank",
							rel: "noreferrer",
							children: [t("details"), " ↗"]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {}), armed ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: PluginMenu_module_css_default.confirmActions,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: PluginMenu_module_css_default.secondaryButton,
								onClick: onArm,
								children: t("cancel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: PluginMenu_module_css_default.dangerButton,
								disabled: busy,
								onClick: onRemove,
								children: busy ? t("removing") : t("confirmRemove")
							})]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: PluginMenu_module_css_default.removeButton,
							disabled: busy,
							onClick: onArm,
							children: t("remove")
						})]
					})
				]
			});
		}
		function PluginMenu({ t, locale, store }) {
			const subscribeToMenu = (0, react.useCallback)((listener) => store.subscribe(listener), [store]);
			const readMenu = (0, react.useCallback)(() => store.getSnapshot(), [store]);
			const subscribeToLocale = (0, react.useCallback)((listener) => locale.subscribe(listener), [locale]);
			const readLocale = (0, react.useCallback)(() => locale.getSnapshot(), [locale]);
			const open = (0, react.useSyncExternalStore)(subscribeToMenu, readMenu);
			const language = (0, react.useSyncExternalStore)(subscribeToLocale, readLocale).active.toLocaleLowerCase().startsWith("zh") ? "zh" : "en";
			const [catalog, setCatalog] = (0, react.useState)(cachedCatalog);
			const [installed, setInstalled] = (0, react.useState)(cachedInstalled);
			const [loading, setLoading] = (0, react.useState)(cachedCatalog === null);
			const [error, setError] = (0, react.useState)(null);
			const [tab, setTab] = (0, react.useState)("browse");
			const [query, setQuery] = (0, react.useState)("");
			const [category, setCategory] = (0, react.useState)("all");
			const [sort, setSort] = (0, react.useState)("stars");
			const [armed, setArmed] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(null);
			const [notice, setNotice] = (0, react.useState)(null);
			const [showExplain, setShowExplain] = (0, react.useState)(false);
			const searchRef = (0, react.useRef)(null);
			const refreshInstalled = (0, react.useCallback)(() => request("/dsh-plugin-menu/installed").then((value) => {
				cachedInstalled = value;
				setInstalled(value);
			}), []);
			const refresh = (0, react.useCallback)((force = false) => {
				setLoading(true);
				setError(null);
				return Promise.all([request(`/dsh-plugin-menu/catalog${force ? "?refresh=1" : ""}`), request("/dsh-plugin-menu/installed")]).then(([nextCatalog, nextInstalled]) => {
					cachedCatalog = nextCatalog;
					cachedInstalled = nextInstalled;
					setCatalog(nextCatalog);
					setInstalled(nextInstalled);
				}).catch((reason) => {
					setError(reason instanceof Error ? reason.message : t("loadFailed"));
				}).finally(() => setLoading(false));
			}, [t]);
			(0, react.useEffect)(() => {
				if (!open) return;
				refresh(false);
				const previous = document.body.style.overflow;
				document.body.style.overflow = "hidden";
				const onKey = (event) => {
					if (event.key === "Escape") store.setOpen(false);
				};
				document.addEventListener("keydown", onKey);
				window.setTimeout(() => searchRef.current?.focus(), 0);
				return () => {
					document.body.style.overflow = previous;
					document.removeEventListener("keydown", onKey);
				};
			}, [
				open,
				refresh,
				store
			]);
			const dependencies = installed?.dependencies ?? [];
			const counts = (0, react.useMemo)(() => {
				const map = /* @__PURE__ */ new Map();
				for (const plugin of catalog?.plugins ?? []) map.set(plugin.category, (map.get(plugin.category) ?? 0) + 1);
				return map;
			}, [catalog]);
			const visible = (0, react.useMemo)(() => {
				const normalized = query.trim().toLocaleLowerCase();
				return [...(catalog?.plugins ?? []).filter((plugin) => {
					if (category !== "all" && plugin.category !== category) return false;
					if (normalized === "") return true;
					return [
						plugin.name,
						plugin.owner,
						plugin.repo,
						plugin.description.zh,
						plugin.description.en,
						...plugin.topics
					].some((value) => value.toLocaleLowerCase().includes(normalized));
				})].sort((a, b) => {
					if (sort === "stars") return b.stars - a.stars;
					if (sort === "recent") return Date.parse(b.maintenanceAt ?? "1970-01-01") - Date.parse(a.maintenanceAt ?? "1970-01-01");
					if (sort === "added") return Date.parse(b.addedAt ?? "1970-01-01") - Date.parse(a.addedAt ?? "1970-01-01");
					return a.name.localeCompare(b.name);
				});
			}, [
				catalog,
				category,
				query,
				sort
			]);
			const install = (plugin) => {
				setBusy(plugin.id);
				setError(null);
				mutate("/dsh-plugin-menu/install", { id: plugin.id }).then((result) => {
					setNotice(result.message);
					setArmed(null);
					return refreshInstalled();
				}).catch((reason) => setError(reason instanceof Error ? reason.message : t("operationFailed"))).finally(() => setBusy(null));
			};
			const remove = (dependency) => {
				setBusy(dependency.name);
				setError(null);
				mutate("/dsh-plugin-menu/remove", { packageName: dependency.name }).then((result) => {
					setNotice(result.message);
					setArmed(null);
					return refreshInstalled();
				}).catch((reason) => setError(reason instanceof Error ? reason.message : t("operationFailed"))).finally(() => setBusy(null));
			};
			if (!open) return null;
			const sourceLabel = catalog === null ? "" : t(`source${catalog.source[0].toUpperCase()}${catalog.source.slice(1)}`);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: PluginMenu_module_css_default.backdrop,
				role: "presentation",
				onMouseDown: (event) => {
					if (event.target === event.currentTarget) store.setOpen(false);
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					className: PluginMenu_module_css_default.menu,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "plugin-menu-title",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
							className: PluginMenu_module_css_default.header,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: PluginMenu_module_css_default.brandIcon,
									children: menuIcon()
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: PluginMenu_module_css_default.heading,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", {
										id: "plugin-menu-title",
										children: t("title")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("subtitle") })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: PluginMenu_module_css_default.headerStats,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [catalog?.plugins.length ?? 0, " plugins"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: sourceLabel })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									className: PluginMenu_module_css_default.close,
									type: "button",
									"aria-label": t("close"),
									onClick: () => store.setOpen(false),
									children: "×"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: PluginMenu_module_css_default.tabs,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"data-active": tab === "browse",
									onClick: () => setTab("browse"),
									children: t("browse")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-active": tab === "installed",
									onClick: () => setTab("installed"),
									children: [t("installed"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: dependencies.length })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: PluginMenu_module_css_default.tabsSpacer }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: PluginMenu_module_css_default.explainButton,
									onClick: () => setShowExplain((value) => !value),
									children: ["ⓘ ", t("explain")]
								})
							]
						}),
						showExplain ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
							className: PluginMenu_module_css_default.explainer,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("categoryNote") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("metricNote") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("safetyNote") })
							]
						}) : null,
						notice !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: PluginMenu_module_css_default.notice,
							children: [
								"✓ ",
								notice,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setNotice(null),
									children: "×"
								})
							]
						}) : null,
						error !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: PluginMenu_module_css_default.error,
							role: "alert",
							children: [
								t("operationFailed"),
								": ",
								error,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setError(null),
									children: "×"
								})
							]
						}) : null,
						tab === "browse" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: PluginMenu_module_css_default.content,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
								className: PluginMenu_module_css_default.categories,
								"aria-label": "Plugin categories",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-active": category === "all",
									onClick: () => setCategory("all"),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "▦" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("all") }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: catalog?.plugins.length ?? 0 })
									]
								}), CATEGORIES.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-active": category === item.id,
									onClick: () => setCategory(item.id),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: item.icon }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: language === "zh" ? item.zh : item.en }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: counts.get(item.id) ?? 0 })
									]
								}, item.id))]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("main", {
								className: PluginMenu_module_css_default.main,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: PluginMenu_module_css_default.toolbar,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
												className: PluginMenu_module_css_default.search,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "⌕" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
														ref: searchRef,
														type: "search",
														value: query,
														placeholder: t("search"),
														onChange: (event) => setQuery(event.currentTarget.value)
													}),
													query !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setQuery(""),
														children: "×"
													}) : null
												]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
												value: sort,
												"aria-label": "Sort plugins",
												onChange: (event) => setSort(event.currentTarget.value),
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "stars",
														children: t("sortStars")
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "recent",
														children: t("sortRecent")
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "added",
														children: t("sortAdded")
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "name",
														children: t("sortName")
													})
												]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
												className: PluginMenu_module_css_default.refresh,
												type: "button",
												disabled: loading,
												onClick: () => {
													refresh(true);
												},
												children: ["↻ ", t("refresh")]
											})
										]
									}),
									loading && catalog === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: PluginMenu_module_css_default.state,
										children: t("loading")
									}) : null,
									!loading && catalog === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: PluginMenu_module_css_default.state,
										children: t("loadFailed")
									}) : null,
									catalog !== null && visible.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: PluginMenu_module_css_default.state,
										children: t("empty")
									}) : null,
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: PluginMenu_module_css_default.grid,
										"aria-busy": loading,
										children: visible.map((plugin) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PluginCard, {
											plugin,
											dependency: installedMatch(plugin, dependencies),
											language,
											t,
											busy: busy === plugin.id,
											armed: armed === plugin.id,
											onArm: () => setArmed((value) => value === plugin.id ? null : plugin.id),
											onInstall: () => install(plugin)
										}, plugin.id))
									})
								]
							})]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("main", {
							className: PluginMenu_module_css_default.installedPane,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: PluginMenu_module_css_default.installedHeader,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("installed") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
										installed?.profile ?? "web",
										" profile · ",
										dependencies.length,
										" plugins"
									] })] }), installed?.restartRequired ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["↻ ", t("restart")] }) : null]
								}),
								dependencies.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: PluginMenu_module_css_default.state,
									children: t("dependenciesEmpty")
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: PluginMenu_module_css_default.installedGrid,
									children: dependencies.map((dependency) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstalledCard, {
										dependency,
										t,
										armed: armed === dependency.name,
										busy: busy === dependency.name,
										onArm: () => setArmed((value) => value === dependency.name ? null : dependency.name),
										onRemove: () => remove(dependency)
									}, dependency.name))
								})
							]
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/index.ts
		const NS = "plain-plugin-menu";
		const name = "plain-plugin-menu";
		const inject = ["slots", "locale"];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "plain-plugin-menu: dictionaries");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "plain-plugin-menu",
				order: 30,
				locale: NS
			}, (props) => (0, react.createElement)(PluginMenuTrigger, {
				wide: props.wide === true,
				t
			})));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "plain-plugin-menu-overlay",
				order: 30,
				locale: NS
			}, () => (0, react.createElement)(PluginMenu, {
				t,
				locale: ctx.locale,
				store: menuStore
			})));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map