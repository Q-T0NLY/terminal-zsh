export const DASHBOARD_TABS_CONFIG = {
  integration_hub: {
    tab_id: "integration_hub",
    tab_name: "🔌 Integration Hub",
    purpose: "Integration Hub",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "integration_hub__integration_health_dashboard",
        name: "Integration Health Dashboard",
        chart_type: "status_grid",
        data_binding: {
          source: "integration_api",
          query: "integration_api.integration_hub__integration_health_dashboard",
        },
        settings: {
          refresh_interval: "10s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "integration_hub__api_performance_monitor",
        name: "API Performance Monitor",
        chart_type: "multi_line",
        data_binding: {
          source: "integration_api",
          query: "integration_api.integration_hub__api_performance_monitor",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 6,
          y: 0,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "integration_hub__connector_store",
        name: "Connector Store",
        chart_type: "plugin_catalog",
        data_binding: {
          source: "extensions_registry",
          query: "extensions_registry.integration_hub__connector_store",
        },
        settings: {
          refresh_interval: "30s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 3,
          w: 12,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  admin_center: {
    tab_id: "admin_center",
    tab_name: "👑 Admin Center",
    purpose: "Admin Center",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "admin_center__health_monitor",
        name: "Health Monitor",
        chart_type: "indicators",
        data_binding: {
          source: "admin_api",
          query: "admin_api.admin_center__health_monitor",
        },
        settings: {
          refresh_interval: "10s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "admin_center__conversational_billing",
        name: "Conversational Billing",
        chart_type: "chat_actions",
        data_binding: {
          source: "billing_api",
          query: "billing_api.admin_center__conversational_billing",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 6,
          y: 0,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "billing-assistant",
          contextBinding: ["billing"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  licensing_entitlement_mgmt: {
    tab_id: "licensing_entitlement_mgmt",
    tab_name: "🪶 Licensing & Entitlement Management",
    purpose: "Licensing & Entitlement Management",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "licensing_entitlement_mgmt__license_status_summary",
        name: "License Status Summary",
        chart_type: "donut_timeline",
        data_binding: {
          source: "licensing_api",
          query: "licensing_api.licensing_entitlement_mgmt__license_status_summary",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 8,
          w: 6,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  reports_center: {
    tab_id: "reports_center",
    tab_name: "📋 Reports Center",
    purpose: "Reports Center",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "reports_center__report_builder_studio",
        name: "Report Builder Studio",
        chart_type: "drag_drop_canvas",
        data_binding: {
          source: "reports_api",
          query: "reports_api.reports_center__report_builder_studio",
        },
        settings: {
          refresh_interval: "0s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 8,
          h: 6,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "reports_center__insight_summarizer",
        name: "Insight Summarizer",
        chart_type: "text_generator",
        data_binding: {
          source: "analytics_api",
          query: "analytics_api.reports_center__insight_summarizer",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 8,
          y: 0,
          w: 4,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "narrator-v1",
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  backup_recovery: {
    tab_id: "backup_recovery",
    tab_name: "💾 Backup & Recovery",
    purpose: "Backup & Recovery",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "backup_recovery__backup_status",
        name: "Backup Status",
        chart_type: "calendar_status",
        data_binding: {
          source: "backup_api",
          query: "backup_api.backup_recovery__backup_status",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 6,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "backup_recovery__dr_simulation",
        name: "DR Simulation",
        chart_type: "step_flow",
        data_binding: {
          source: "backup_api",
          query: "backup_api.backup_recovery__dr_simulation",
        },
        settings: {
          refresh_interval: "0s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 6,
          y: 0,
          w: 6,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  notifications_center: {
    tab_id: "notifications_center",
    tab_name: "🔔 Notifications Center",
    purpose: "Notifications Center",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "notifications_center__notification_dashboard",
        name: "Notification Dashboard",
        chart_type: "heatmap_matrix",
        data_binding: {
          source: "notifications_api",
          query: "notifications_api.notifications_center__notification_dashboard",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 8,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "notifications_center__smart_ranker",
        name: "Smart Ranker",
        chart_type: "urgency_bars",
        data_binding: {
          source: "notifications_api",
          query: "notifications_api.notifications_center__smart_ranker",
        },
        settings: {
          refresh_interval: "10s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 8,
          y: 0,
          w: 4,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "notifications_center__message_flow_graph",
        name: "Message Flow Graph",
        chart_type: "line_map",
        data_binding: {
          source: "notifications_api",
          query: "notifications_api.notifications_center__message_flow_graph",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 4,
          w: 12,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  security_audit_zone: {
    tab_id: "security_audit_zone",
    tab_name: "🛡️ Security & Audit Zone",
    purpose: "Security & Audit Zone",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "security_audit_zone__access_roles_matrix",
        name: "Access Roles Matrix",
        chart_type: "grid_permissions",
        data_binding: {
          source: "security_api",
          query: "security_api.security_audit_zone__access_roles_matrix",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 6,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "security_audit_zone__vulnerability_scan",
        name: "Vulnerability Scan",
        chart_type: "risk_matrix",
        data_binding: {
          source: "security_api",
          query: "security_api.security_audit_zone__vulnerability_scan",
        },
        settings: {
          refresh_interval: "300s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 6,
          y: 0,
          w: 6,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "security_audit_zone__audit_trail",
        name: "Audit Trail",
        chart_type: "timeline_stream",
        data_binding: {
          source: "security_api",
          query: "security_api.security_audit_zone__audit_trail",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 4,
          w: 12,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  scheduler_cron_management: {
    tab_id: "scheduler_cron_management",
    tab_name: "⏰ Scheduler & Cron Management",
    purpose: "Scheduler & Cron Management",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "scheduler_cron_management__job_calendar",
        name: "Job Calendar",
        chart_type: "calendar_view",
        data_binding: {
          source: "scheduler_api",
          query: "scheduler_api.scheduler_cron_management__job_calendar",
        },
        settings: {
          refresh_interval: "30s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 6,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "scheduler_cron_management__cron_expression_builder",
        name: "Cron Expression Builder",
        chart_type: "cron_builder",
        data_binding: {
          source: "scheduler_api",
          query: "scheduler_api.scheduler_cron_management__cron_expression_builder",
        },
        settings: {
          refresh_interval: "0s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 6,
          y: 0,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "scheduler_cron_management__execution_timeline",
        name: "Execution Timeline",
        chart_type: "gantt_exec",
        data_binding: {
          source: "scheduler_api",
          query: "scheduler_api.scheduler_cron_management__execution_timeline",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 4,
          w: 12,
          h: 4,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "scheduler_cron_management__retry_policy_configurator",
        name: "Retry Policy Configurator",
        chart_type: "policy_matrix",
        data_binding: {
          source: "scheduler_api",
          query: "scheduler_api.scheduler_cron_management__retry_policy_configurator",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 8,
          w: 12,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  workflow_builder: {
    tab_id: "workflow_builder",
    tab_name: "🔧 Workflow Builder",
    purpose: "Workflow Builder",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "workflow_builder__visual_canvas",
        name: "Visual Canvas",
        chart_type: "interactive_d3",
        data_binding: {
          source: "workflow_engine",
          query: "workflow_engine.workflow_builder__visual_canvas",
        },
        settings: {
          refresh_interval: "1s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 8,
          h: 8,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "workflow_builder__node_palette",
        name: "Node Palette",
        chart_type: "node_palette",
        data_binding: {
          source: "workflow_engine",
          query: "workflow_engine.workflow_builder__node_palette",
        },
        settings: {
          refresh_interval: "30s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 8,
          y: 0,
          w: 4,
          h: 8,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "workflow_builder__condition_builder",
        name: "Condition Builder",
        chart_type: "logic_tree",
        data_binding: {
          source: "workflow_engine",
          query: "workflow_engine.workflow_builder__condition_builder",
        },
        settings: {
          refresh_interval: "10s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 8,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "workflow_builder__testing_panel",
        name: "Testing Panel",
        chart_type: "mock_runner",
        data_binding: {
          source: "workflow_engine",
          query: "workflow_engine.workflow_builder__testing_panel",
        },
        settings: {
          refresh_interval: "2s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 6,
          y: 8,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "workflow_builder__smart_recommender",
        name: "Smart Recommender",
        chart_type: "comparison_chart",
        data_binding: {
          source: "predictive_api",
          query: "predictive_api.workflow_builder__smart_recommender",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 11,
          w: 12,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: true,
          suggestionEngine: "recommender-v1",
          contextBinding: ["workflow.metrics"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  message_bus_event_streams: {
    tab_id: "message_bus_event_streams",
    tab_name: "📨 Message Bus & Event Streams",
    purpose: "Message Bus & Event Streams",
    ui: {
      theme: "violet",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "message_bus_event_streams__message_queue_depth",
        name: "Message Queue Depth",
        chart_type: "real_time_bars",
        data_binding: {
          source: "message_bus",
          query: "message_bus.message_bus_event_streams__message_queue_depth",
        },
        settings: {
          refresh_interval: "2s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "message_bus_event_streams__event_throughput_analytics",
        name: "Event Throughput Analytics",
        chart_type: "throughput_line",
        data_binding: {
          source: "message_bus",
          query: "message_bus.message_bus_event_streams__event_throughput_analytics",
        },
        settings: {
          refresh_interval: "3s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 6,
          y: 0,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "message_bus_event_streams__message_latency_dashboard",
        name: "Message Latency Dashboard",
        chart_type: "latency_heatmap",
        data_binding: {
          source: "message_bus",
          query: "message_bus.message_bus_event_streams__message_latency_dashboard",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 3,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "message_bus_event_streams__dead_letter_queue_manager",
        name: "Dead Letter Queue Manager",
        chart_type: "dlq_alerts",
        data_binding: {
          source: "message_bus",
          query: "message_bus.message_bus_event_streams__dead_letter_queue_manager",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 6,
          y: 3,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "message_bus_event_streams__replay_manager",
        name: "Replay Manager",
        chart_type: "timeline_replay",
        data_binding: {
          source: "message_bus",
          query: "message_bus.message_bus_event_streams__replay_manager",
        },
        settings: {
          refresh_interval: "10s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 6,
          w: 12,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "message_bus_event_streams__stream_encryption_meter",
        name: "Stream Encryption Meter",
        chart_type: "encryption_grid",
        data_binding: {
          source: "security_api",
          query: "security_api.message_bus_event_streams__stream_encryption_meter",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 10,
          y: 0,
          w: 2,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  tokenization_usage_center: {
    tab_id: "tokenization_usage_center",
    tab_name: "💰 Tokenization & Usage Center",
    purpose: "Tokenization & Usage Center",
    ui: {
      theme: "magenta",
      layout_mode: "grid",
      font: "Exo 2",
      animations: true,
    },
    widgets: [
      {
        widget_id: "tokenization_usage_center__token_consumption_graph",
        name: "Token Consumption Graph",
        chart_type: "multi_line",
        data_binding: {
          source: "billing_api",
          query: "billing_api.tokenization_usage_center__token_consumption_graph",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 8,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "tokenization_usage_center__cost_estimation_dashboard",
        name: "Cost Estimation Dashboard",
        chart_type: "projection_charts",
        data_binding: {
          source: "billing_api",
          query: "billing_api.tokenization_usage_center__cost_estimation_dashboard",
        },
        settings: {
          refresh_interval: "1h",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 8,
          y: 0,
          w: 4,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "tokenization_usage_center__quota_utilization",
        name: "Quota Utilization",
        chart_type: "progress_rings",
        data_binding: {
          source: "billing_api",
          query: "billing_api.tokenization_usage_center__quota_utilization",
        },
        settings: {
          refresh_interval: "30s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 3,
          w: 4,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "tokenization_usage_center__credit_balance_tracker",
        name: "Credit Balance Tracker",
        chart_type: "digital_counter",
        data_binding: {
          source: "billing_api",
          query: "billing_api.tokenization_usage_center__credit_balance_tracker",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 4,
          y: 3,
          w: 4,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "tokenization_usage_center__consumption_feed",
        name: "Consumption Feed",
        chart_type: "live_scroll",
        data_binding: {
          source: "billing_api",
          query: "billing_api.tokenization_usage_center__consumption_feed",
        },
        settings: {
          refresh_interval: "3s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 8,
          y: 3,
          w: 4,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "tokenization_usage_center__token_exchange_interface",
        name: "Token Exchange Interface",
        chart_type: "live_price_graphs",
        data_binding: {
          source: "market_api",
          query: "market_api.tokenization_usage_center__token_exchange_interface",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 5,
          w: 12,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "price-advisor",
          contextBinding: ["market"],
        },
      },
      {
        widget_id: "tokenization_usage_center__outlier_analyzer",
        name: "Outlier Analyzer",
        chart_type: "density_plot",
        data_binding: {
          source: "billing_api",
          query: "billing_api.tokenization_usage_center__outlier_analyzer",
        },
        settings: {
          refresh_interval: "10s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 8,
          w: 6,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
  dashboard_home: {
    tab_id: "dashboard_home",
    tab_name: "🏠 Dashboard Home",
    purpose: "Central hub for system overview and key metrics",
    ui: {
      theme: "quantum-dark",
      layout_mode: "grid",
      font: "Geist",
      animations: true,
    },
    widgets: [
      {
        widget_id: "dashboard_home__active_agents_counter",
        name: "Active Agents Counter",
        chart_type: "digital_led_sparkline",
        data_binding: {
          source: "telemetry_api_v2",
          query: "telemetry_api_v2.dashboard_home__active_agents_counter",
        },
        settings: {
          refresh_interval: "5s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 0,
          w: 3,
          h: 1,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v2",
          contextBinding: ["user.profile"],
        },
      },
      {
        widget_id: "dashboard_home__avg_latency_monitor",
        name: "Avg Latency Monitor",
        chart_type: "bar_percentile",
        data_binding: {
          source: "telemetry_api_v2",
          query: "telemetry_api_v2.dashboard_home__avg_latency_monitor",
        },
        settings: {
          refresh_interval: "15s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 1,
          w: 4,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "dashboard_home__success_rate_pct",
        name: "Success Rate %",
        chart_type: "donut_trend",
        data_binding: {
          source: "telemetry_api_v2",
          query: "telemetry_api_v2.dashboard_home__success_rate_pct",
        },
        settings: {
          refresh_interval: "30s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 8,
          y: 1,
          w: 2,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "dashboard_home__aie_confidence_score",
        name: "AIE Confidence Score",
        chart_type: "radar_chart",
        data_binding: {
          source: "predictive_api",
          query: "predictive_api.dashboard_home__aie_confidence_score",
        },
        settings: {
          refresh_interval: "30s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 3,
          w: 4,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "dashboard_home__predictive_load_index",
        name: "Predictive Load Index",
        chart_type: "heatmap_forecast",
        data_binding: {
          source: "predictive_api",
          query: "predictive_api.dashboard_home__predictive_load_index",
        },
        settings: {
          refresh_interval: "60s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 4,
          y: 3,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: true,
          suggestionEngine: "forecast-v3",
          contextBinding: ["capacity"],
        },
      },
      {
        widget_id: "dashboard_home__security_posture_dial",
        name: "Security Posture Dial",
        chart_type: "status_dial",
        data_binding: {
          source: "security_api",
          query: "security_api.dashboard_home__security_posture_dial",
        },
        settings: {
          refresh_interval: "30s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 10,
          y: 0,
          w: 2,
          h: 1,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "dashboard_home__recent_activity_feed",
        name: "Recent Activity Feed",
        chart_type: "timeline_stream",
        data_binding: {
          source: "activity_api",
          query: "activity_api.dashboard_home__recent_activity_feed",
        },
        settings: {
          refresh_interval: "3s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 0,
          y: 5,
          w: 6,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "insights-v1",
          contextBinding: ["user.profile", "agent.meta"],
        },
      },
      {
        widget_id: "dashboard_home__model_drift_index",
        name: "Model Drift Index",
        chart_type: "gradient_bar",
        data_binding: {
          source: "predictive_api",
          query: "predictive_api.dashboard_home__model_drift_index",
        },
        settings: {
          refresh_interval: "20s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 6,
          y: 5,
          w: 4,
          h: 2,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: false,
          suggestionEngine: "drift-detector",
          contextBinding: ["model.versions"],
        },
      },
      {
        widget_id: "dashboard_home__incident_predictor",
        name: "Incident Predictor",
        chart_type: "scatter_forecast",
        data_binding: {
          source: "predictive_api",
          query: "predictive_api.dashboard_home__incident_predictor",
        },
        settings: {
          refresh_interval: "45s",
          time_range: "1h",
          theme: "quantum-dark",
          display_options: {
            show_title: true,
            show_legend: true,
            units: null,
          },
          thresholds: {
            warning: 70,
            critical: 90,
          },
          interactivity: {
            hover: true,
            click_to_drill: true,
            context_menu: true,
          },
        },
        layout: {
          x: 10,
          y: 2,
          w: 2,
          h: 3,
        },
        access: {
          roles: ["admin", "operator", "analyst"],
        },
        ai_behavior: {
          autoOptimize: true,
          suggestionEngine: "incident-ai",
          contextBinding: ["alerts", "telemetry"],
        },
      },
    ],
    data_bindings: {
      default_source: "telemetry_api_v2",
    },
    roles: {
      admin: "full",
      developer: "read",
      analyst: "read",
    },
  },
}

export const SPECIFIC_WIDGET_CONFIGS = {
  // Agent Control Board widgets
  agent_control_board__capability_map: {
    widget_id: "agent_control_board__capability_map",
    name: "Capability Map",
    chart_type: "knowledge_graph",
    data_binding: {
      source: "agents_api",
      query: "agents_api.agent_control_board__capability_map",
    },
    settings: {
      refresh_interval: "30s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 6,
      y: 7,
      w: 6,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  agent_control_board__agent_type_distribution: {
    widget_id: "agent_control_board__agent_type_distribution",
    name: "Agent Type Distribution",
    chart_type: "donut_chart",
    data_binding: {
      source: "agents_api",
      query: "agents_api.agent_control_board__agent_type_distribution",
    },
    settings: {
      refresh_interval: "30s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 5,
      w: 4,
      h: 2,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  agent_control_board__activity_timeline: {
    widget_id: "agent_control_board__activity_timeline",
    name: "Activity Timeline",
    chart_type: "gantt_chart",
    data_binding: {
      source: "activity_api",
      query: "activity_api.agent_control_board__activity_timeline",
    },
    settings: {
      refresh_interval: "5s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 2,
      w: 6,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  agent_control_board__health_score_dashboard: {
    widget_id: "agent_control_board__health_score_dashboard",
    name: "Health Score Dashboard",
    chart_type: "radial_progress",
    data_binding: {
      source: "agents_api",
      query: "agents_api.agent_control_board__health_score_dashboard",
    },
    settings: {
      refresh_interval: "10s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 6,
      y: 2,
      w: 6,
      h: 2,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  agent_control_board__agent_performance_metrics: {
    widget_id: "agent_control_board__agent_performance_metrics",
    name: "Agent Performance Metrics",
    chart_type: "mini_bars_sparklines",
    data_binding: {
      source: "agents_api",
      query: "agents_api.agent_control_board__agent_performance_metrics",
    },
    settings: {
      refresh_interval: "5s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 4,
      y: 0,
      w: 4,
      h: 2,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  agent_control_board__clone_sync_manager: {
    widget_id: "agent_control_board__clone_&_sync_manager",
    name: "Clone & Sync Manager",
    chart_type: "matrix_version_list",
    data_binding: {
      source: "devops_api",
      query: "devops_api.agent_control_board__clone_&_sync_manager",
    },
    settings: {
      refresh_interval: "60s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 9,
      w: 12,
      h: 2,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  // System Health & Diagnostics widgets
  system_health_diagnostics__queue_backlog: {
    widget_id: "system_health_diagnostics__queue_backlog",
    name: "Queue Backlog",
    chart_type: "time_series_alert",
    data_binding: {
      source: "infra_metrics",
      query: "infra_metrics.system_health_diagnostics__queue_backlog",
    },
    settings: {
      refresh_interval: "5s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 0,
      w: 6,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  system_health_diagnostics__cpu_gpu_sensors: {
    widget_id: "system_health_diagnostics__cpu_gpu_sensors",
    name: "CPU/GPU Sensors",
    chart_type: "digital_gauges",
    data_binding: {
      source: "infra_metrics",
      query: "infra_metrics.system_health_diagnostics__cpu_gpu_sensors",
    },
    settings: {
      refresh_interval: "2s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 6,
      y: 0,
      w: 6,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  // Development Management widget
  development_management__pipeline_monitor: {
    widget_id: "development_management__pipeline_monitor",
    name: "Pipeline Monitor",
    chart_type: "pipeline_graph",
    data_binding: {
      source: "devops_api",
      query: "devops_api.development_management__pipeline_monitor",
    },
    settings: {
      refresh_interval: "10s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 8,
      y: 0,
      w: 4,
      h: 8,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  agent_control_board__status_tiles: {
    widget_id: "agent_control_board__status_tiles",
    name: "Status Tiles",
    chart_type: "led_avatar_grid",
    data_binding: {
      source: "agents_api",
      query: "agents_api.agent_control_board__status_tiles",
    },
    settings: {
      refresh_interval: "3s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 0,
      w: 4,
      h: 2,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  agent_control_board__token_usage_per_agent: {
    widget_id: "agent_control_board__token_usage_per_agent",
    name: "Token Usage per Agent",
    chart_type: "stacked_bar",
    data_binding: {
      source: "billing_api",
      query: "billing_api.agent_control_board__token_usage_per_agent",
    },
    settings: {
      refresh_interval: "10s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 8,
      y: 0,
      w: 4,
      h: 2,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  agent_control_board__load_balancer_view: {
    widget_id: "agent_control_board__load_balancer_view",
    name: "Load Balancer View",
    chart_type: "network_graph",
    data_binding: {
      source: "orchestrator_stream",
      query: "orchestrator_stream.agent_control_board__load_balancer_view",
    },
    settings: {
      refresh_interval: "5s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 4,
      y: 5,
      w: 8,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: true,
      suggestionEngine: "balancer-ai",
      contextBinding: ["load", "agents"],
    },
  },
  agent_control_board__start_stop_console: {
    widget_id: "agent_control_board__start_stop_console",
    name: "Start/Stop Console",
    chart_type: "status_toggle_cards",
    data_binding: {
      source: "agents_api",
      query: "agents_api.agent_control_board__start_stop_console",
    },
    settings: {
      refresh_interval: "2s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 7,
      w: 6,
      h: 2,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  analytics_insights_hub__performance_index: {
    widget_id: "analytics_insights_hub__performance_index",
    name: "Performance Index",
    chart_type: "composite_score",
    data_binding: {
      source: "analytics_api",
      query: "analytics_api.analytics_insights_hub__performance_index",
    },
    settings: {
      refresh_interval: "30s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 0,
      w: 6,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  analytics_insights_hub__latency_distribution: {
    widget_id: "analytics_insights_hub__latency_distribution",
    name: "Latency Distribution",
    chart_type: "box_hist",
    data_binding: {
      source: "analytics_api",
      query: "analytics_api.analytics_insights_hub__latency_distribution",
    },
    settings: {
      refresh_interval: "30s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 6,
      y: 0,
      w: 6,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  analytics_insights_hub__auto_insights: {
    widget_id: "analytics_insights_hub__auto_insights",
    name: "Auto Insights",
    chart_type: "ai_cards",
    data_binding: {
      source: "analytics_api",
      query: "analytics_api.analytics_insights_hub__auto_insights",
    },
    settings: {
      refresh_interval: "60s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 3,
      w: 12,
      h: 4,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "narrator-v1",
      contextBinding: ["analytics"],
    },
  },
  dashboard_home__active_agents_counter: {
    widget_id: "dashboard_home__active_agents_counter",
    name: "Active Agents Counter",
    chart_type: "digital_led_sparkline",
    data_binding: {
      source: "telemetry_api_v2",
      query: "telemetry_api_v2.dashboard_home__active_agents_counter",
    },
    settings: {
      refresh_interval: "5s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 0,
      w: 3,
      h: 1,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v2",
      contextBinding: ["user.profile"],
    },
  },
  backup_recovery__backup_status: {
    widget_id: "backup_recovery__backup_status",
    name: "Backup Status",
    chart_type: "calendar_status",
    data_binding: {
      source: "backup_api",
      query: "backup_api.backup_recovery__backup_status",
    },
    settings: {
      refresh_interval: "60s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  backup_recovery__dr_simulation: {
    widget_id: "backup_recovery__dr_simulation",
    name: "DR Simulation",
    chart_type: "step_flow",
    data_binding: {
      source: "backup_api",
      query: "backup_api.backup_recovery__dr_simulation",
    },
    settings: {
      refresh_interval: "0s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 6,
      y: 0,
      w: 6,
      h: 4,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  integration_hub__integration_health_dashboard: {
    widget_id: "integration_hub__integration_health_dashboard",
    name: "Integration Health Dashboard",
    chart_type: "status_grid",
    data_binding: {
      source: "integration_api",
      query: "integration_api.integration_hub__integration_health_dashboard",
    },
    settings: {
      refresh_interval: "10s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 0,
      w: 6,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  integration_hub__api_performance_monitor: {
    widget_id: "integration_hub__api_performance_monitor",
    name: "API Performance Monitor",
    chart_type: "multi_line",
    data_binding: {
      source: "integration_api",
      query: "integration_api.integration_hub__api_performance_monitor",
    },
    settings: {
      refresh_interval: "5s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 6,
      y: 0,
      w: 6,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  integration_hub__connector_store: {
    widget_id: "integration_hub__connector_store",
    name: "Connector Store",
    chart_type: "plugin_catalog",
    data_binding: {
      source: "extensions_registry",
      query: "extensions_registry.integration_hub__connector_store",
    },
    settings: {
      refresh_interval: "30s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 3,
      w: 12,
      h: 4,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  extensions_registry_marketplace__extensions_gallery: {
    widget_id: "extensions_registry_marketplace__extensions_gallery",
    name: "Extensions Gallery",
    chart_type: "card_grid",
    data_binding: {
      source: "extensions_registry",
      query: "extensions_registry.extensions_registry_marketplace__extensions_gallery",
    },
    settings: {
      refresh_interval: "30s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 0,
      w: 8,
      h: 6,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  extensions_builder_studio__visual_builder_canvas: {
    widget_id: "extensions_builder_studio__visual_builder_canvas",
    name: "Visual Builder Canvas",
    chart_type: "interactive_d3",
    data_binding: {
      source: "extensions_builder",
      query: "extensions_builder.extensions_builder_studio__visual_builder_canvas",
    },
    settings: {
      refresh_interval: "1s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 0,
      w: 8,
      h: 8,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  licensing_entitlement_mgmt__license_status_summary: {
    widget_id: "licensing_entitlement_mgmt__license_status_summary",
    name: "License Status Summary",
    chart_type: "donut_timeline",
    data_binding: {
      source: "licensing_api",
      query: "licensing_api.licensing_entitlement_mgmt__license_status_summary",
    },
    settings: {
      refresh_interval: "60s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 0,
      y: 8,
      w: 6,
      h: 4,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  message_bus_event_streams__dead_letter_queue_manager: {
    widget_id: "message_bus_event_streams__dead_letter_queue_manager",
    name: "Dead Letter Queue Manager",
    chart_type: "dlq_alerts",
    data_binding: {
      source: "message_bus",
      query: "message_bus.message_bus_event_streams__dead_letter_queue_manager",
    },
    settings: {
      refresh_interval: "5s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 6,
      y: 3,
      w: 6,
      h: 3,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  dashboard_home__token_throughput: {
    widget_id: "dashboard_home__token_throughput",
    name: "Token Throughput",
    chart_type: "area_rate",
    data_binding: {
      source: "billing_api",
      query: "billing_api.dashboard_home__token_throughput",
    },
    settings: {
      refresh_interval: "10s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 4,
      y: 1,
      w: 4,
      h: 2,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: false,
      suggestionEngine: "insights-v1",
      contextBinding: ["user.profile", "agent.meta"],
    },
  },
  dashboard_home__workflows_running_gauge: {
    widget_id: "dashboard_home__workflows_running_gauge",
    name: "Workflows Running Gauge",
    chart_type: "gauge_trend",
    data_binding: {
      source: "telemetry_api_v2",
      query: "telemetry_api_v2.dashboard_home__workflows_running_gauge",
    },
    settings: {
      refresh_interval: "10s",
      time_range: "1h",
      theme: "quantum-dark",
      display_options: {
        show_title: true,
        show_legend: true,
        units: null,
      },
      thresholds: {
        warning: 70,
        critical: 90,
      },
      interactivity: {
        hover: true,
        click_to_drill: true,
        context_menu: true,
      },
    },
    layout: {
      x: 3,
      y: 0,
      w: 3,
      h: 1,
    },
    access: {
      roles: ["admin", "operator", "analyst"],
    },
    ai_behavior: {
      autoOptimize: true,
      suggestionEngine: "optimizer-v1",
      contextBinding: ["workflow.engine"],
    },
  },
}

export type DashboardTabConfig = (typeof DASHBOARD_TABS_CONFIG)[keyof typeof DASHBOARD_TABS_CONFIG]
export type WidgetConfig = DashboardTabConfig["widgets"][number]
export type SpecificWidgetConfig = (typeof SPECIFIC_WIDGET_CONFIGS)[keyof typeof SPECIFIC_WIDGET_CONFIGS]
