import streamlit as st
import pandas as pd

# --- 页面全局配置 ---
st.set_page_config(page_title="AI 生产力显卡天梯榜", layout="wide")

st.title("📊 AI 显卡性能与性价比天梯榜")
st.markdown("专为本地 AI 部署（文生图、LLM 推理）打造。告别游戏跑分，专注真实生产力。")

# --- 模拟后端静态 JSON 数据 (符合加拿大市场价格) ---
mock_data = [
    {"GPU": "RTX 4090", "架构": "Ada", "显存": "24GB", "市价(CAD)": 2499, "Flux_Dev(it/s)": 5.2, "Llama3_70B(tok/s)": 18.5},
    {"GPU": "RTX 3090 (二手)", "架构": "Ampere", "显存": "24GB", "市价(CAD)": 899, "Flux_Dev(it/s)": 3.1, "Llama3_70B(tok/s)": 12.0},
    {"GPU": "RTX 4080 Super", "架构": "Ada", "显存": "16GB", "市价(CAD)": 1399, "Flux_Dev(it/s)": 4.1, "Llama3_70B(tok/s)": 0}, # 模拟 16G 跑 70B OOM
    {"GPU": "RTX 4060 Ti", "架构": "Ada", "显存": "16GB", "市价(CAD)": 649, "Flux_Dev(it/s)": 1.5, "Llama3_70B(tok/s)": 0},
    {"GPU": "RTX 4060", "架构": "Ada", "显存": "8GB", "市价(CAD)": 399, "Flux_Dev(it/s)": 0, "Llama3_70B(tok/s)": 0}, # 模拟 8G 跑 Flux OOM
]

df = pd.DataFrame(mock_data)

# --- 侧边栏：AI 攒机助手 ---
st.sidebar.header("🤖 AI 攒机助手")
budget = st.sidebar.slider("你的最高预算 (CAD)", min_value=300, max_value=3000, value=1500, step=100)
target_model = st.sidebar.selectbox("你最想流畅运行的模型", ["Flux.1 [Dev] (文生图)", "Llama-3 70B (大语言模型)"])

st.sidebar.markdown("---")
st.sidebar.success("💡 **提示**: 在 AI 场景下，旧架构的大显存显卡往往比新架构的小显存显卡更具性价比。")

# --- 核心逻辑：计算性价比与 OOM 状态 ---
def calculate_metrics(data, task):
    df_temp = data.copy()
    if task == "Flux.1 [Dev] (文生图)":
        target_col = "Flux_Dev(it/s)"
        # 计算每 100 加元能买到的算力
        df_temp["性价比得分"] = (df_temp[target_col] / df_temp["市价(CAD)"] * 100).round(2)
    else:
        target_col = "Llama3_70B(tok/s)"
        df_temp["性价比得分"] = (df_temp[target_col] / df_temp["市价(CAD)"] * 100).round(2)
    
    # 处理 OOM (Out of Memory)
    df_temp["运行状态"] = df_temp[target_col].apply(lambda x: "❌ 爆显存 (OOM)" if x == 0 else "✅ 支持")
    df_temp[target_col] = df_temp[target_col].apply(lambda x: "OOM" if x == 0 else x)
    
    return df_temp.sort_values(by="性价比得分", ascending=False)

# --- 主展示区：动态排行榜 ---
st.subheader(f"🏆 {target_model} 性能排行榜")

# 获取处理后的数据
display_df = calculate_metrics(df, target_model)

# 在表格中高亮满足预算的推荐显卡
def highlight_budget(row):
    if row["市价(CAD)"] <= budget and row["运行状态"] != "❌ 爆显存 (OOM)":
        return ['background-color: rgba(46, 204, 113, 0.2)'] * len(row)
    elif row["运行状态"] == "❌ 爆显存 (OOM)":
        return ['background-color: rgba(231, 76, 60, 0.1); color: #e74c3c'] * len(row)
    return [''] * len(row)

# 渲染数据表
st.dataframe(
    display_df.style.apply(highlight_budget, axis=1),
    use_container_width=True,
    hide_index=True,
    column_config={
        "市价(CAD)": st.column_config.NumberColumn(format="$%d"),
        "性价比得分": st.column_config.ProgressColumn(
            "性价比指数 (每百元算力)",
            help="数值越高，每一块钱换来的速度越快",
            min_value=0,
            max_value=max(display_df["性价比得分"].max(), 1)
        )
    }
)

st.caption("注：标红行表示显存不足以运行该模型；绿色高亮表示符合你左侧预算的推荐型号。")