# 项目总览

```text
hardware-compare/
├── index.html                          # 主排行榜 (Chart.js)
├── graphcard-productivity-rank.html    # 旧排行榜（可废弃）
├── vram-calc.html                      # 显存计算器
├── app.py                              # Streamlit 版
├── styles/
│   ├── index.css
│   ├── graphcard-productivity-rank.css
│   └── vram-calc.css
├── scripts/
│   └── vram-calc.js
└── resources/
    └── fiveserver.js        
    
```

# Live Server 注入，非项目代码

需要完善的地方

🔴 高优先级
1. 数据重复 —— 3 份数据源，极易不一致

同一个 GPU 数据集分别在 index.html:72-80、graphcard-productivity-rank.html、scripts/vram-calc.js、app.py 里写了四遍。新增一张显卡要改四个地方，迟早会漏。

建议：抽一个 data/gpu-data.js 或 data/gpu-data.json，所有人 HTML `<script src>` 引用，app.py 也走同一个数据源（或至少导出为 JSON）。

2. graphcard-productivity-rank.html 有严重 Bug

第 118 行：


row.get_personal_context_or_null_if_not_present_in_context_datavidText === "显存不足"
这是 AI 生成代码时遗留的侵入变量，永远为 false，导致 row.vidText 从未生效。这个页面和 index.html 功能高度重叠，建议直接废弃，或至少修复后统一到 index.html。

3. README 过于简单

只有一句话。对于开源项目，缺少：功能说明、截图、如何启动、数据来源、贡献指南。

4. app.py 数据老旧且功能滞后

只有 5 张卡（且没有 RTX 5090、RX 9070 XT），没有和 HTML 页面对齐。Streamlit 版本可以成为很好的交互式工具，但目前被忽略了。

5. 导航栏没有统一

index.html 导航是 <button> 列表，"显存计算器" 用 window.location.href 跳转
vram-calc.html 导航是 <header> + <nav><ul> 结构
两个页面的导航样式、HTML 结构不同，维护时容易不一致
建议：统一成公共导航组件（哪怕只是所有页面共用同一段 HTML 结构）。

🟡 中等优先级
6. CSS 重复，没有公共主题文件

index.css 和 vram-calc.css 各自定义了 --accent: #2D68D9、字体、颜色等变量，但互不相干。修改品牌色要改两个文件。

建议：抽一个 styles/theme.css 公共 CSS 变量文件，所有页面 @import 或 <link> 引用。

7. 数据是 Mock 的，没有标注

页面给人的感觉像是真实测试数据，但没有任何来源说明或数据更新时间标注。长期维护容易失去可信度。

8. 移动端体验不够完善

index.html 没有 media query，大表格在手机上会溢出
vram-calc.html 虽然有响应式布局，但细节（如导航 padding、按钮组换行）可以优化
没有 viewport 相关的额外优化（触摸友好间距等）
9. 缺少 favicon / PWA 支持

页面在浏览器标签页上没有图标，也没有离线支持。

🟢 低优先级 / 锦上添花
10. 缺少搜索/筛选功能

GPU 排行榜没有搜索框、没有按价格/VRAM/性能排序点击表头的功能。

11. Chart.js 散点图只有一个维度

index.html 的图表只做了"LLM 推理速度 vs 价格"。如果能加上文生图、文生视频的可切换维度会更完整。

12. 没有构建/自动化流程

目前是纯静态文件，无需构建——这是优势，但也没有 lint、format、live reload（除了 Five Server 的注入）。

13. 缺少 CI/CD

没有 GitHub Actions 来自动测试或部署到 GitHub Pages。

总结优先级建议
优先级	项	工作量
🔴	统一数据源，消除重复	小
🔴	废弃或修复 graphcard-productivity-rank.html	小
🔴	完善 README	小
🔴	app.py 与 HTML 页面对齐	中
🟡	抽公共 CSS 主题变量文件	小
🟡	统一导航组件	小
🟡	补充数据来源说明	小
🟡	优化移动端体验	中
🟢	搜索/筛选/排序功能	中
🟢	添加 favicon	小
要不要我帮你先处理哪几项？比如统一数据源 + 废弃旧页面这两个最直接影响维护的，我可以马上改。

