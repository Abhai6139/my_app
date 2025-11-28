// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.query_reports["Leave Applications by Department"] = {
	"filters": [
		{'fieldname':'department','label':'Department','fieldtype':'Link','options':'Department'},
		{'fieldname':'from_date','label':'From Date','fieldtype':'Date',},
		{'fieldname':'to_date','label':'To Date','fieldtype':'Date','default':'Today'},
		{'fieldname':'status','label':'Status','fieldtype':'Select','options':['','Open','Approved','Rejected']}
	]
};
