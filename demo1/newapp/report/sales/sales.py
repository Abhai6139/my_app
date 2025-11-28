# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
	filters = filters or {}

	from_date=filters.get('from_date')
	to_date=filters.get('to_date')
	customer_name = filters.get('customer_name')
	status = filters.get('status')

	condns = " "
	if from_date and to_date:
		condns+='AND transaction_date BETWEEN %(from_date)s AND %(to_date)s'
	if customer_name:
		condns += ' AND customer_name = %(customer_name)s'
	if status:
		condns += ' AND status = %(status)s'

	columns=[
		{'label':'Sales Order','fieldname':'name', 'width': 250},
		{'label':'Invoice Name','fieldname':'parent', 'width': 250},
		{'label':'Posting Date','fieldname':'transaction_date', 'width': 200},
		{'label':'Customer','fieldname':'customer_name', 'width': 150},
		{'label':'Status','fieldname':'status', 'width': 200},
		{'label':'Grand Total','fieldname':'grand_total', 'width': 150},
	]

	query=f"""
			SELECT 
				so.name,so.transaction_date,
				so.customer_name,so.status,so.grand_total
			FROM 
				`tabSales Order` AS so
			WHERE 1=1{condns}
			GROUP BY
			so.name
			
	"""
	r_data=frappe.db.sql(query,filters,as_dict=True)
	data=[]
	for row in r_data:
		data.append({
			'name':row.name,
			'transaction_date':row.transaction_date,
			'customer_name':row.customer_name,
			'status':row.status,
			'grand_total':row.grand_total,
			'indent':0
		})
		inv=frappe.db.sql("""
			SELECT  si.grand_total,si.name,sii.sales_order,si.customer
			FROM `tabSales Invoice` as si
			LEFT JOIN `tabSales Invoice Item` as sii ON sii.parent=si.name
			WHERE sii.sales_order=%s
			GROUP BY si.name
		""",(row.name,),as_dict=True)
		for j in inv:
			data.append({
				'parent':j.name,
				'customer_name':j.customer,
				'grand_total':j.grand_total,
				'indent':1
			})

	return columns, data

		