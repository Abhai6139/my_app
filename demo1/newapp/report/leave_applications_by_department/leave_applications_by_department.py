# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
	filters = filters or {}

	department = filters.get('department')
	from_date = filters.get('from_date')
	to_date= filters.get('to_date')
	status = filters.get('status')

	condns = ""
	if department:
		condns += ' AND department = %(department)s'
	if from_date:
		condns += ' AND from_date BETWEEN %(from_date)s AND %(to_date)s'
	if status:
		condns += ' AND status = %(status)s'

	columns=[
		{'label':'Employee Name','Fieldname':'employee_name','width':200},
		{'label':'Department','Fieldname':'department','width':200},
		{'label':'Leave Type','Fieldname':'leave_type','width':200},
		{'label':'From Date','Fieldname':'from_date','width':200},
		{'label':'To Date','Fieldname':'to_date','width':200},
		{'label':'Status','Fieldname':'status','width':200}
	]

	r_data=f"""
		SELECT
			employee_name, department, leave_type, from_date, to_date, status
		FROM
			`tabLeave Application`
		WHERE 1=1{condns}
	"""

	data=frappe.db.sql(r_data, filters, as_dict=True)
	return columns, data
