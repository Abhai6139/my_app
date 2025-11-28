app_name = "demo1"
app_title = "Newapp"
app_publisher = "NA"
app_description = "NA"
app_email = "abc@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "demo1",
# 		"logo": "/assets/demo1/logo.png",
# 		"title": "Newapp",
# 		"route": "/demo1",
# 		"has_permission": "demo1.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/demo1/css/demo1.css"
# app_include_js = "/assets/demo1/js/demo1.js"

# include js, css files in header of web template
# web_include_css = "/assets/demo1/css/demo1.css"
# web_include_js = "/assets/demo1/js/demo1.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "demo1/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"Sales Invoice" : "public/js/sales_invoice.js"}
doctype_js = {
	# "Appraisal Cycle" : "public/js/appraisal.js",
	"Appraisal Cycle" : "public/js/apraisal.js",
	"Vehicle":"public/js/vehicle.js",
	"Item":"public/js/item.js",
	"Serial No":"public/js/serial.js",
	"Quotation":"public/js/quotation.js",
	"Sales Order":"public/js/sales_order.js",
	"Opportunity":"public/js/opportunity.js",
	# "Project":"public/js/project.js",
	"UOM":"public/js/uom.js",
	"Additional Salary":"public/js/Additional slry.js",
	"Payroll Entry":"public/js/payroll_entry.js"
	# "Quick Invoice":"public/js/quick_invoice_list.js"
}
doctype_list_js = {
	"Quick Invoice" : "demo1/newapp/doctype/quick_invoice/quick_invoice_list.js"
}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "demo1/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "demo1.utils.jinja_methods",
# 	"filters": "demo1.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "demo1.install.before_install"
# after_install = "demo1.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "demo1.uninstall.before_uninstall"
# after_uninstall = "demo1.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "demo1.utils.before_app_install"
# after_app_install = "demo1.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "demo1.utils.before_app_uninstall"
# after_app_uninstall = "demo1.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "demo1.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

override_doctype_class = {
	"Staffing Plan":"demo1.override.staffingpln.Staffingplan"
# 	# "ToDo": "custom_app.overrides.CustomToDo"
# 	"Job Requisition":"demo1.override.jobreqisition.CustomJobRequisition"
}

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	"Employee": {
        "validate":"demo1.events.employee.validate"
	},
	"Job Applicant":{
		"on_update":'demo1.events.jobapplicnt.on_update',
		"on_trash":'demo1.events.jobapplicnt.on_trash'
	},
	"Purchase Order":{
		"before_save":"demo1.events.purchs.before_save",
		# "on_cancel":"demo1.events.purchs.on_cancel",
	},
	"Leave Application":{
		"on_submit":'demo1.events.leave_appli.on_submit',
		# "on_submit":'demo1.events.job_appli.on_submit'
	},
	"Quotation":{
		"before_validate":"demo1.events.quotation.before_validate"
	},
	"Sales Invoice":{
		"validate":"demo1.events.sales_invoice.validate"
	},
	"Salary Structure Assignment":{
		"validate":"demo1.events.ssa.validate"
	}
	# "Project Evaluation": {
    #     "on_update": "demo1.newapp.doctype.project_evaluation.project_evaluation.on_update",
    #     "on_submit": "demo1.newapp.doctype.project_evaluation.project_evaluation.on_submit",
    # }
	
}

# Scheduled Tasks
# ---------------

scheduler_events = {
	# "cron": {
    #     "*/1 * * * *": [
    #         "demo1.newapp.doctype.library_transaction.test_library_transaction.test"
    #     ]
    # },
	# "all": [
	# 	"demo1.tasks.all"
	# ],
	# "daily": [
	# 	"demo1.newapp.doctype.library_transaction.library_transaction.test"
	# ],
	# "hourly": [
	# 	"demo1.tasks.hourly"
	# ],
	# "weekly": [
	# 	"demo1.tasks.weekly"
	# ],
	# "monthly": [
	# 	"demo1.tasks.monthly"
	# ],
	"cron": {
        "0 0 * * *": ["demo1.newapp.doctype.duty_allocation.duty_allocation.update_status"]
    },
	"daily": [
		"demo1.newapp.doctype.duty_allocation.duty_allocation.old_delete"
	],
}

# Testing
# -------

# before_tests = "demo1.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "demo1.event.get_events"

# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "demo1.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["demo1.utils.before_request"]
# after_request = ["demo1.utils.after_request"]

# Job Events
# ----------
# before_job = ["demo1.utils.before_job"]
# after_job = ["demo1.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"demo1.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

