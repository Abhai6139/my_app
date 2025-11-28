# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from collections import Counter


def execute(filters=None):
	filters = filters or {}

	employee_name = filters.get('employee_name')
	designation = filters.get('designation')
	gender = filters.get('gender')

	condns = ""
	if employee_name:
		condns += ' AND employee_name = %(employee_name)s'
	if designation:
		condns += ' AND designation = %(designation)s'
	if gender:
		condns += ' AND gender = %(gender)s'
	columns=[
		{'label': 'Employee', 'fieldname': 'name', 'width': 200},
		{'label': 'Name', 'fieldname': 'employee_name', 'width': 100},
		{'label': 'Designation', 'fieldname': 'designation', 'width': 100},
		{'label': 'Age', 'fieldname': 'age','fieldtype':'Data', 'width': 50,},
		{'label': 'Gender', 'fieldname': 'gender', 'width': 100},
		{'label': 'Task', 'fieldname': 'task', 'width': 150},
		{'label': 'Name', 'fieldname': 'task_name', 'width': 100},
		{'label': 'Start Date', 'fieldname': 'start_date', 'width': 120},
		{'label': 'End Date', 'fieldname': 'end_date', 'width': 120},
		{'label': 'Status', 'fieldname': 'status', 'width': 120},
	]
	query=f"""
	SELECT
		ei.name, ei.employee_name, ei.designation, ei.age, ei.gender,
		dd.task, dd.task_name, dd.start_date, dd.end_date, dd.status
	FROM
		`tabEmployee Information` as ei
	LEFT JOIN
		`tabDocument Details` as dd ON dd.parent=ei.name
	WHERE 1=1 {condns}
	"""
	data=frappe.db.sql(query, filters, as_dict=True)

	age_grp=[]
	for i in data:
		age=i.get('age')
		if age is not None:
			age=int(age)
			if age < 20:
				age_grp.append('Age < 20')
			elif age==20:
				age_grp.append('Age = 20')
			elif age > 20:
				age_grp.append('Age > 20')
		else:
			age=0
			age_grp.append('Age < 20')
	counts=Counter(age_grp)
	
	chart={
		'data':{
			'labels':list(counts.keys()),
			'datasets':[
				{
					'name':'Count',
					'values':list(counts.values())
				}
			]
		},
		'type':'pie',
	}
	summary=get_summary(data)
	


	return columns, data, None, chart, summary

def get_summary(data):
		age_lss_20, age_is_20, age_grt_20 =0,0,0
		for i in data:
			age=i.get('age')
			if age is not None:
				age=int(age)
				if age < 20:
					age_lss_20+=1
				elif age==20:
					age_is_20+=1
				elif age > 20:
					age_grt_20+=1
			else:
				age=0
				age_lss_20+=1
		return [
			{
				'value':age_lss_20,
				'indicator':'Green',
				'label':'Age Below 20',
				
			},
			{
				'value':age_is_20,
				'indicator':'Red',
				'label':'Age = 20',
				
			},
			{
				'value':age_grt_20,
				'indicator':'Blue',
				'label':'Age Above 20',
				
			}
		]