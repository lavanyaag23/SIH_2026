import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# =========================================================
# PAGE CONFIG
# =========================================================

st.set_page_config(
    page_title="AI Block Planner",
    page_icon="🚆",
    layout="wide",
    initial_sidebar_state="expanded"
)

# =========================================================
# CUSTOM CSS
# =========================================================

st.markdown("""
<style>

    /* Main background */
    .stApp {
        background-color: #0b0f14;
        color: #f5f5f5;
    }

    /* Hide default Streamlit elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}

    /* Sidebar */
    section[data-testid="stSidebar"] {
        background-color: #10151c;
        border-right: 1px solid #252c35;
    }

    /* Main title */
    .main-title {
        font-size: 30px;
        font-weight: 700;
        margin-bottom: 5px;
    }

    .subtitle {
        color: #8f9aaa;
        font-size: 14px;
        margin-bottom: 25px;
    }

    /* KPI Cards */
    .kpi-card {
        background: #121820;
        border: 1px solid #252d38;
        border-radius: 12px;
        padding: 18px;
        min-height: 115px;
    }

    .kpi-title {
        color: #8f9aaa;
        font-size: 13px;
        margin-bottom: 8px;
    }

    .kpi-value {
        font-size: 28px;
        font-weight: 700;
    }

    .kpi-change {
        color: #67d391;
        font-size: 12px;
        margin-top: 5px;
    }

    /* Section headers */
    .section-title {
        font-size: 18px;
        font-weight: 600;
        margin-top: 10px;
        margin-bottom: 12px;
    }

    /* Recommendation */
    .recommendation {
        background: #111923;
        border: 1px solid #354352;
        border-radius: 12px;
        padding: 20px;
    }

    .recommendation-title {
        font-size: 17px;
        font-weight: 700;
        margin-bottom: 15px;
    }

    .recommendation-value {
        font-size: 24px;
        font-weight: 700;
    }

    .success {
        font-size: 22px;
        font-weight: 700;
    }

    .reason {
        color: #aeb8c5;
        font-size: 13px;
        margin: 5px 0;
    }

    /* Network */
    .network-box {
        background: #11161d;
        border: 1px solid #252d38;
        border-radius: 12px;
        padding: 25px;
        height: 100%;
    }

    .station {
        display: inline-block;
        background: #1b232d;
        border: 2px solid #5d6875;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        text-align: center;
        line-height: 31px;
        font-weight: 700;
    }

    .track-green {
        display: inline-block;
        height: 5px;
        width: 75px;
        background: #55d68a;
        vertical-align: middle;
    }

    .track-yellow {
        display: inline-block;
        height: 5px;
        width: 75px;
        background: #e4bd50;
        vertical-align: middle;
    }

    .track-red {
        display: inline-block;
        height: 5px;
        width: 75px;
        background: #e35d6a;
        vertical-align: middle;
    }

    /* Info boxes */
    .info-box {
        background: #111820;
        border: 1px solid #252d38;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 10px;
    }

    /* Small text */
    .muted {
        color: #8f9aaa;
    }

    /* Status */
    .critical {
        color: #ff5d6c;
        font-weight: 700;
    }

    .high {
        color: #ff9d4d;
        font-weight: 700;
    }

    .medium {
        color: #e8c84a;
        font-weight: 700;
    }

    .low {
        color: #61d98c;
        font-weight: 700;
    }

</style>
""", unsafe_allow_html=True)


# =========================================================
# SIDEBAR
# =========================================================

with st.sidebar:

    st.markdown("## 🚆 AI BLOCK PLANNER")
    st.caption("Indian Railway Maintenance Intelligence")

    st.divider()

    page = st.radio(
        "Navigation",
        [
            "Command Center",
            "Block Planning",
            "Asset Priority",
            "What-if Simulation",
            "Recovery"
        ]
    )

    st.divider()

    st.markdown("### System Status")

    st.success("AI Engine Online")
    st.success("Optimizer Online")
    st.info("Data Updated: 12:15 PM")

    st.divider()

    st.caption("SIH 2026 Prototype")
    st.caption("AI-Powered Automatic Block Planning")


# =========================================================
# DATA
# =========================================================

assets = pd.DataFrame({
    "Job": ["M001", "M002", "M003", "M004", "M005"],
    "Asset": ["Track A12", "Signal S07", "OHE O21", "Track B18", "Point P09"],
    "Risk": [94, 82, 68, 54, 41],
    "Priority": ["CRITICAL", "HIGH", "MEDIUM", "MEDIUM", "LOW"]
})

blocks = pd.DataFrame({
    "Block": ["B101", "B102", "B103", "B104"],
    "Section": ["A-B", "B-C", "C-D", "D-E"],
    "Time": ["02:00–04:00", "01:00–04:00", "03:00–05:00", "00:30–03:30"],
    "Success": [91, 67, 82, 76],
    "Train Impact": ["LOW", "HIGH", "LOW", "MEDIUM"],
    "Jobs": [3, 2, 3, 2]
})

conflicts = pd.DataFrame({
    "Maintenance": ["M004", "M007", "M009"],
    "Train": ["T102", "T205", "T118"],
    "Severity": ["HIGH", "MEDIUM", "LOW"]
})


# =========================================================
# HEADER
# =========================================================

st.markdown(
    '<div class="main-title">🚆 AI BLOCK PLANNER</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="subtitle">AI-powered maintenance block planning and asset availability optimization</div>',
    unsafe_allow_html=True
)


# =========================================================
# COMMAND CENTER
# =========================================================

if page == "Command Center":

    # -----------------------------------------------------
    # KPI CARDS
    # -----------------------------------------------------

    c1, c2, c3, c4, c5 = st.columns(5)

    with c1:
        st.markdown("""
        <div class="kpi-card">
            <div class="kpi-title">ASSET AVAILABILITY</div>
            <div class="kpi-value">94.2%</div>
            <div class="kpi-change">↑ 3.4% this month</div>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="kpi-card">
            <div class="kpi-title">CRITICAL ASSETS</div>
            <div class="kpi-value">08</div>
            <div class="kpi-change">Requires attention</div>
        </div>
        """, unsafe_allow_html=True)

    with c3:
        st.markdown("""
        <div class="kpi-card">
            <div class="kpi-title">PENDING JOBS</div>
            <div class="kpi-value">15</div>
            <div class="kpi-change">5 high priority</div>
        </div>
        """, unsafe_allow_html=True)

    with c4:
        st.markdown("""
        <div class="kpi-card">
            <div class="kpi-title">AVAILABLE WINDOWS</div>
            <div class="kpi-value">12</div>
            <div class="kpi-change">Next 7 days</div>
        </div>
        """, unsafe_allow_html=True)

    with c5:
        st.markdown("""
        <div class="kpi-card">
            <div class="kpi-title">TRAIN CONFLICTS</div>
            <div class="kpi-value">02</div>
            <div class="kpi-change">Requires review</div>
        </div>
        """, unsafe_allow_html=True)

    st.write("")

    # -----------------------------------------------------
    # NETWORK + RECOMMENDATION
    # -----------------------------------------------------

    left, right = st.columns([1.25, 1])

    with left:

        st.markdown(
            '<div class="section-title">🗺️ Railway Network / Block Visualization</div>',
            unsafe_allow_html=True
        )

        st.markdown("""
        <div class="network-box">

        <div style="text-align:center; margin-top:25px;">

        <span class="station">A</span>
        <span class="track-green"></span>
        <span class="station">B</span>
        <span class="track-red"></span>
        <span class="station">C</span>
        <span class="track-yellow"></span>
        <span class="station">D</span>
        <span class="track-green"></span>
        <span class="station">E</span>

        </div>

        <br>

        <div style="text-align:center; color:#9da8b6;">

        🟢 Available &nbsp;&nbsp;
        🔴 Maintenance &nbsp;&nbsp;
        🟡 Conflict

        </div>

        <br>

        <div class="info-box">
        <b>Selected Section: A-B</b><br>
        <span class="muted">Status:</span> Available<br>
        <span class="muted">Capacity:</span> 3 maintenance jobs<br>
        <span class="muted">Train conflicts:</span> 0
        </div>

        </div>
        """, unsafe_allow_html=True)

    with right:

        st.markdown(
            '<div class="section-title">🤖 AI Recommended Block</div>',
            unsafe_allow_html=True
        )

        st.markdown("""
        <div class="recommendation">

        <div class="recommendation-title">
        BEST BLOCK RECOMMENDATION
        </div>

        <div class="recommendation-value">
        Section A-B
        </div>

        <p class="muted">
        02:00 AM – 04:00 AM &nbsp; | &nbsp; 2 Hours
        </p>

        <hr>

        <div>
        <span class="muted">Success Probability</span><br>
        <span class="success">91% 🟢</span>
        </div>

        <br>

        <div>
        <span class="muted">Train Impact</span><br>
        <b>LOW</b>
        </div>

        <br>

        <div>
        <span class="muted">Maintenance Jobs</span><br>
        <b>3 Jobs</b>
        </div>

        <br>

        <div>
        <span class="muted">Productivity Score</span><br>
        <b>89 / 100</b>
        </div>

        <hr>

        <b>Why this block?</b>

        <p class="reason">✓ Low train conflict</p>
        <p class="reason">✓ High-priority assets</p>
        <p class="reason">✓ Machine available</p>
        <p class="reason">✓ Crew available</p>
        <p class="reason">✓ High historical success</p>

        </div>
        """, unsafe_allow_html=True)

        st.write("")

        b1, b2 = st.columns(2)

        with b1:
            if st.button("✅ APPROVE BLOCK", use_container_width=True):
                st.success("Block B101 approved for planning.")

        with b2:
            if st.button("✏️ MODIFY", use_container_width=True):
                st.info("Modification panel opened.")


    # -----------------------------------------------------
    # TIMELINE
    # -----------------------------------------------------

    st.markdown(
        '<div class="section-title">📊 Train + Maintenance Timeline</div>',
        unsafe_allow_html=True
    )

    timeline = pd.DataFrame([
        ["Train T101", "00:00", "01:30", "Train"],
        ["Train T102", "02:00", "03:00", "Train"],
        ["Train T205", "04:00", "05:30", "Train"],
        ["Track Maintenance", "02:00", "04:00", "Maintenance"],
        ["S&T Inspection", "02:00", "03:00", "Maintenance"],
        ["OHE Inspection", "03:00", "04:00", "Maintenance"]
    ], columns=["Task", "Start", "End", "Type"])

    timeline["Start"] = pd.to_datetime(
        "2026-01-01 " + timeline["Start"]
    )

    timeline["End"] = pd.to_datetime(
        "2026-01-01 " + timeline["End"]
    )

    fig = px.timeline(
        timeline,
        x_start="Start",
        x_end="End",
        y="Task",
        color="Type",
        text="Task"
    )

    fig.update_layout(
        height=320,
        template="plotly_dark",
        paper_bgcolor="#0b0f14",
        plot_bgcolor="#0b0f14",
        margin=dict(l=20, r=20, t=20, b=20),
        showlegend=True
    )

    st.plotly_chart(fig, use_container_width=True)


    # -----------------------------------------------------
    # PRIORITY + CONFLICT
    # -----------------------------------------------------

    left, right = st.columns(2)

    with left:

        st.markdown(
            '<div class="section-title">🔴 AI Maintenance Priority</div>',
            unsafe_allow_html=True
        )

        priority_display = assets.copy()

        st.dataframe(
            priority_display,
            use_container_width=True,
            hide_index=True
        )

    with right:

        st.markdown(
            '<div class="section-title">⚠️ Active Conflicts</div>',
            unsafe_allow_html=True
        )

        for _, row in conflicts.iterrows():

            severity_icon = {
                "HIGH": "🔴",
                "MEDIUM": "🟠",
                "LOW": "🟡"
            }[row["Severity"]]

            st.markdown(
                f"""
                <div class="info-box">
                <b>{row["Maintenance"]}</b>
                ↔ Train <b>{row["Train"]}</b>
                &nbsp;&nbsp; {severity_icon} {row["Severity"]}
                </div>
                """,
                unsafe_allow_html=True
            )


    # -----------------------------------------------------
    # WEEKLY PLAN
    # -----------------------------------------------------

    st.markdown(
        '<div class="section-title">📅 Weekly Block Plan</div>',
        unsafe_allow_html=True
    )

    weekly = pd.DataFrame({
        "Day": ["MON", "TUE", "WED", "THU", "FRI"],
        "Time": ["02–04 AM", "01–04 AM", "02–03 AM", "00–03 AM", "01–04 AM"],
        "Section": ["A-B", "C-D", "B-C", "A-D", "D-E"],
        "Status": ["🟢 Optimal", "🟢 Optimal", "🟡 Review", "🔴 Conflict", "🟢 Optimal"]
    })

    st.dataframe(
        weekly,
        use_container_width=True,
        hide_index=True
    )


# =========================================================
# BLOCK PLANNING
# =========================================================

elif page == "Block Planning":

    st.markdown("## 🧠 AI Block Planning")

    st.info(
        "The optimizer evaluates maintenance requirements, train conflicts, "
        "available resources and block duration to recommend the best window."
    )

    st.markdown("### Available Block Windows")

    st.dataframe(
        blocks,
        use_container_width=True,
        hide_index=True
    )

    st.markdown("### Select Planning Criteria")

    col1, col2, col3 = st.columns(3)

    with col1:
        max_duration = st.slider(
            "Maximum Block Duration (hours)",
            1,
            6,
            3
        )

    with col2:
        train_tolerance = st.selectbox(
            "Train Conflict Tolerance",
            ["LOW", "MEDIUM", "HIGH"]
        )

    with col3:
        required_jobs = st.number_input(
            "Minimum Jobs",
            1,
            5,
            2
        )

    if st.button(
        "🤖 GENERATE OPTIMAL BLOCK",
        use_container_width=True
    ):

        eligible = blocks[
            (blocks["Jobs"] >= required_jobs)
        ]

        if len(eligible) > 0:

            best = eligible.sort_values(
                "Success",
                ascending=False
            ).iloc[0]

            st.success("Optimal block generated!")

            st.markdown(f"""
            ### 🚆 Recommended: {best["Block"]}

            **Section:** {best["Section"]}

            **Time:** {best["Time"]}

            **Success Probability:** {best["Success"]}%

            **Train Impact:** {best["Train Impact"]}

            **Maintenance Jobs:** {best["Jobs"]}
            """)

            st.progress(best["Success"] / 100)


# =========================================================
# ASSET PRIORITY
# =========================================================

elif page == "Asset Priority":

    st.markdown("## 🔴 AI Asset Priority")

    st.write(
        "Assets are prioritized using condition, age, criticality, "
        "failure history and maintenance information."
    )

    st.dataframe(
        assets,
        use_container_width=True,
        hide_index=True
    )

    st.markdown("### Risk Distribution")

    fig = px.bar(
        assets,
        x="Asset",
        y="Risk",
        text="Risk"
    )

    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="#0b0f14",
        plot_bgcolor="#0b0f14",
        yaxis_title="Risk Score (%)",
        xaxis_title=""
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    selected_asset = st.selectbox(
        "Select Asset",
        assets["Asset"]
    )

    selected = assets[
        assets["Asset"] == selected_asset
    ].iloc[0]

    st.markdown("### Asset Details")

    a, b, c = st.columns(3)

    with a:
        st.metric(
            "Risk Score",
            f'{selected["Risk"]}%'
        )

    with b:
        st.metric(
            "Priority",
            selected["Priority"]
        )

    with c:
        st.metric(
            "Recommended",
            "Next Block"
        )


# =========================================================
# WHAT-IF SIMULATION
# =========================================================

elif page == "What-if Simulation":

    st.markdown("## 🔄 What-if Block Simulation")

    st.write(
        "Change block conditions and see how the predicted success "
        "and operational impact change."
    )

    st.markdown("### Current Block")

    duration = st.slider(
        "Block Duration",
        min_value=1,
        max_value=5,
        value=3,
        step=1
    )

    conflicts_value = st.slider(
        "Train Conflicts",
        min_value=0,
        max_value=5,
        value=1
    )

    machine = st.checkbox(
        "Machine Available",
        value=True
    )

    crew = st.checkbox(
        "Crew Available",
        value=True
    )

    # Simple prototype scoring formula
    success = 95

    success -= (3 - duration) * 12
    success -= conflicts_value * 8

    if not machine:
        success -= 15

    if not crew:
        success -= 10

    success = max(20, min(98, success))

    st.divider()

    st.markdown("### Simulation Result")

    c1, c2, c3 = st.columns(3)

    with c1:
        st.metric(
            "Block Success",
            f"{success}%"
        )

    with c2:

        if conflicts_value <= 1:
            impact = "LOW"
        elif conflicts_value <= 3:
            impact = "MEDIUM"
        else:
            impact = "HIGH"

        st.metric(
            "Train Impact",
            impact
        )

    with c3:

        if success >= 80:
            recommendation = "RECOMMENDED"
        elif success >= 60:
            recommendation = "REVIEW"
        else:
            recommendation = "NOT RECOMMENDED"

        st.metric(
            "AI Decision",
            recommendation
        )

    st.progress(success / 100)

    if success >= 80:
        st.success(
            "AI recommends this block configuration."
        )
    elif success >= 60:
        st.warning(
            "AI recommends reviewing the block before approval."
        )
    else:
        st.error(
            "AI recommends selecting an alternative block."
        )


# =========================================================
# RECOVERY
# =========================================================

elif page == "Recovery":

    st.markdown("## 🔄 Block Recovery Engine")

    st.write(
        "If planned maintenance time is lost, the system identifies "
        "a suitable future recovery window."
    )

    col1, col2 = st.columns(2)

    with col1:

        planned = st.number_input(
            "Planned Block Duration (hours)",
            1.0,
            8.0,
            4.0
        )

    with col2:

        actual = st.number_input(
            "Actual Executed Duration (hours)",
            0.5,
            8.0,
            2.5
        )

    lost_time = max(0, planned - actual)

    st.divider()

    st.metric(
        "Lost Maintenance Opportunity",
        f"{lost_time:.1f} hours"
    )

    if lost_time > 0:

        st.warning(
            f"{lost_time:.1f} hours of planned maintenance was not completed."
        )

        st.markdown("### 🤖 AI Recovery Recommendation")

        recovery_data = pd.DataFrame({
            "Day": ["Wednesday", "Thursday", "Friday"],
            "Window": ["02:00–03:30", "01:00–02:30", "03:00–04:30"],
            "Train Impact": ["LOW", "MEDIUM", "LOW"],
            "Recovery Score": [94, 78, 87]
        })

        st.dataframe(
            recovery_data,
            use_container_width=True,
            hide_index=True
        )

        best_recovery = recovery_data.iloc[0]

        st.success(
            f"Recommended Recovery: {best_recovery['Day']} "
            f"{best_recovery['Window']} | "
            f"Recovery Score: {best_recovery['Recovery Score']}%"
        )

        if st.button(
            "✅ ACCEPT RECOVERY PLAN",
            use_container_width=True
        ):
            st.success(
                "Recovery window added to the proposed block plan."
            )

    else:

        st.success(
            "No recovery required. Planned maintenance was completed."
        )


# =========================================================
# FOOTER
# =========================================================

st.divider()

st.caption(
    "AI Block Planner | SIH 2026 Prototype | "
    "Human-in-the-loop decision support"
)
