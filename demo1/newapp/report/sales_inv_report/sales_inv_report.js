// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.query_reports["Sales Inv Report"] = {
	"filters": [
		{
			'fieldname': 'customer',
			'label': 'Customer',
			'fieldtype': 'Link',
			'options': 'Customer'
		},
		{
			'fieldname': 'posting_date',
			'label': 'Posting Date',
			'fieldtype': 'Date',
			
		},
		{
			'fieldname': 'status',
			'label': 'Status',
			'fieldtype': 'Select',
			'options':['','Draft','Return','Credit Note Issued', 'Submitted','Paid','Partly Paid','Unpaid','Overdue','Cancelled']
			
		},
		
	],
	formatter:function(value, row, column, data, format){
		value=format(value,row,column,data)
		const field=['status']
		if(data&&field.includes(column.fieldname)){
			if(data.status=='Cancelled'){
				value=`<span style="background-color:red;color:black;display:block;">${value}</span>:`
			}else if(data.status=='Paid'){
				value=`<span style="background-color:green;color:black;display:block;">${value}</span>:`
			}else if(data.status=='Overdue'){
				value=`<span style="background-color:#ffff00;yellow:black;display:block;">${value}</span>:`
			}
		}

		return value
	}

};

