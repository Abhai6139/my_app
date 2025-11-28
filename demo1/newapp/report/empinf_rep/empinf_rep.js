// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.query_reports["Empinf Rep"] = {
	"filters": [
		{
			'fieldname': 'employee_name',
			'label': 'Name',
			'fieldtype': 'Select',
			'options':['','Abhai','Abhaii','Abhaiii','Megha', 'Thomas','abcd']
		},
		{
			'fieldname': 'designation',
			'label': 'Designation',
			'fieldtype': 'Link',
			'options':'Designation'
			
		},
		{
			'fieldname': 'gender',
			'label': 'Gender',
			'fieldtype': 'Select',
			'options':['','male','female']
			
		},
		
	],
	formatter:function(value, row, column, data, format){
		value=format(value,row,column,data)
		const field=['status']
		if(data&&field.includes(column.fieldname)){
			if(data.status=='not started yet'){
				value=`<span style="background-color:red;color:black;display:block;">${value}</span>:`
			}else if(data.status=='completed'){
				value=`<span style="background-color:green;color:black;display:block;">${value}</span>:`
			}else if(data.status=='pending'){
				value=`<span style="background-color:#ffff00;yellow:black;display:block;">${value}</span>:`
			}
		}

		return value
	}
};

