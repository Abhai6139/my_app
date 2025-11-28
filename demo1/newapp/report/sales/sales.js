// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.query_reports["Sales"] = {
	"filters": [
		{
			'fieldname': 'customer_name',
			'label': 'Customer',
			'fieldtype': 'Link',
			'options': 'Customer'
		},
		{
			'fieldname': 'from_date',
			'label': 'From Date',
			'fieldtype': 'Date',
			
		},
		{
			'fieldname': 'to_date',
			'label': 'To Date',
			'fieldtype': 'Date',
			'default':'Today'
			
		},
		{
			'fieldname': 'status',
			'label': 'Status',
			'fieldtype': 'Select',
			'options':['','Draft','Completed','On Hold', 'To Deliver','Cancelled']
			
		}
	]
};
