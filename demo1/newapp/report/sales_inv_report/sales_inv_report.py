# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from collections import Counter

# def execute(filters=None):
	
# 	columns= [
# 		{'label':'Sales Invoice', 'fieldname':'name','width':300},
# 		{'label':'Customer', 'fieldname':'customer','width':150},
# 		{'label':'Customer Name', 'fieldname':'customer_name','width':150},
# 		{'label':'Posting Date', 'fieldname':'posting_date','width':150},
# 		{'label':'Grand Total', 'fieldname':'grand_total','width':150},
# 		{'label':'Status', 'fieldname':'status','width':150},
# 	]
	
# 	data=frappe.db.sql("""
# 		SELECT 
# 		name, customer, customer_name, posting_date, grand_total, status
# 		FROM
# 		`tabSales Invoice`
# 		"""
# 	)

	
# 	return columns, data

##########


# def execute(filters=None):
# 	cols=columns()
# 	data=get_data(filters)
# 	return cols, data
	
# def columns():
# 	return [
# 		{'label':'Sales Invoice', 'fieldname':'name','width':300},
# 		{'label':'Customer', 'fieldname':'customer','width':150},
# 		{'label':'Customer Name', 'fieldname':'customer_name','width':150},
# 		{'label':'Posting Date', 'fieldname':'posting_date','width':150},
# 		{'label':'Grand Total', 'fieldname':'grand_total','width':150},
# 		{'label':'Status', 'fieldname':'status','width':150},
# 	]
	
	
# def get_data(filters):
# 	condition=get_cont(filters)
# 	data=frappe.get_all(
# 		doctype='Sales Invoice',
# 		fields=['name', 'customer','customer_name', 'posting_date', 'grand_total', 'status'],
# 		filters=condition,
# 	)
# 	return data

# def get_cont(filters):
# 	condition={}
# 	for i,j in filters.items():
# 		if filters.get(i):
# 			condition[i]=j
# 	return condition

#########

# def execute(filters=None):
	
# 	filters=filters or {}

# 	customer= filters.get('customer')
# 	posting_date=filters.get('posting_date')
# 	status=filters.get('status')

# 	condns=""
# 	if customer:
# 		condns +=' AND customer = %(customer)s'

# 	if posting_date:
# 		condns +=' AND posting_date = %(posting_date)s'

# 	if status:
# 		condns +=' AND status = %(status)s'

# 	columns=[
# 		{'label':'Sales Invoice', 'fieldname':'name','width':250},
# 		{'label':'Customer', 'fieldname':'customer','width':100},
# 		{'label':'Customer Name', 'fieldname':'customer_name','width':100},
# 		{'label':'Posting Date', 'fieldname':'posting_date','width':150},
# 		{'label':'Item', 'fieldname':'item_code','width':150},
# 		{'label':'Quantity', 'fieldname':'qty','width':100},
# 		{'label':'Rate', 'fieldname':'rate','width':100},
# 		{'label':'Grand Total', 'fieldname':'grand_total','width':100},
# 		{'label': 'Recieved Amount', 'fieldname': 'paid_amount', 'width': 150},
# 		{'label':'Status', 'fieldname':'status','width':150},
# 	]

# 	query=f"""
# 		SELECT 
# 		si.name, si.customer, si.customer_name, si.posting_date,sii.item_code, 
# 		sii.qty,sii.rate, si.grand_total, si.status,pe.paid_amount
# 		FROM
# 		`tabSales Invoice` AS si 
		
# 		LEFT JOIN
# 		`tabSales Invoice Item` AS sii 
# 		ON
# 		sii.parent = si.name
# 		LEFT JOIN
# 		`tabPayment Entry Reference` AS per 
# 		ON 
# 		per.reference_doctype='Sales Invoice'
# 		AND
# 		per.reference_name=si.name
# 		LEFT JOIN
# 		`tabPayment Entry` AS pe
# 		ON
# 		per.parent=pe.name
# 		WHERE 1=1 {condns}
# 		GROUP BY
# 		si.name
		
# 		"""

# 	data=frappe.db.sql(query,filters,as_dict=True)
	
# 	return columns, data

#########

def execute(filters=None):
	filters = filters or {}

	customer = filters.get('customer')
	posting_date = filters.get('posting_date')
	status = filters.get('status')

	condns = ""
	if customer:
		condns += ' AND customer = %(customer)s'
	if posting_date:
		condns += ' AND posting_date = %(posting_date)s'
	if status:
		condns += ' AND status = %(status)s'

	columns = [
		{'label': 'Sales Invoice', 'fieldname': 'name', 'width': 250},
		{'label': 'Customer', 'fieldname': 'customer', 'width': 100},
		{'label': 'Customer Name', 'fieldname': 'customer_name', 'width': 100},
		{'label': 'Posting Date', 'fieldname': 'posting_date', 'width': 150, 'fieldtype': 'Date'},
		{'label': 'Item', 'fieldname': 'item_code', 'width': 100},
		{'label': 'Quantity', 'fieldname': 'qty', 'width': 80},
		{'label': 'Rate', 'fieldname': 'rate', 'width': 80},
		{'label': 'Grand Total', 'fieldname': 'grand_total', 'width': 120},
		{'label': 'Recieved Amount', 'fieldname': 'paid_amount', 'width': 100},
		{'label': 'Status', 'fieldname': 'status', 'width': 150},
	]

	query = f"""
		SELECT 
			si.name, si.customer, si.customer_name, si.posting_date, 
			si.grand_total, si.status,pe.paid_amount
		FROM
			`tabSales Invoice` AS si 
		LEFT JOIN
		`tabSales Invoice Item` AS sii 
		ON
		sii.parent = si.name
		LEFT JOIN
		`tabPayment Entry Reference` AS per 
		ON 
		per.reference_doctype='Sales Invoice'
		AND
		per.reference_name=si.name
		LEFT JOIN
		`tabPayment Entry` AS pe
		ON
		per.parent=pe.name
		WHERE 1=1 {condns}
		GROUP BY
		si.name

	"""

	r_data = frappe.db.sql(query, filters, as_dict=True)
	data = []

	for i in r_data:
		# Parent row
		data.append({
			"name": i.name,
			"grand_total": i.grand_total,
			"status": i.status,
			'paid_amount':i.paid_amount,
			"indent": 0
		})

		# Child rows (items per invoice)
		items = frappe.db.sql("""
			SELECT item_code, qty, rate
			FROM `tabSales Invoice Item`
			WHERE parent = %s
		""", (i.name,), as_dict=True)

		for j in items:
			data.append({
				
				"customer": i.customer,
				"customer_name": i.customer_name,
				"posting_date": i.posting_date,
				"item_code": j.item_code,
				"qty": j.qty,
				"rate": j.rate,
				"indent": 1
			})
	counts=Counter([i['status'] for i in data if i.get('indent')==0])
	
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
	
	return columns, data,None, chart
	




########


	

#############

# import frappe

# def execute(filters=None):
#     filters = filters or {}

#     customer = filters.get('customer')
#     posting_date = filters.get('posting_date')
#     status = filters.get('status')

#     columns = [
#         {'label':'Sales Invoice', 'fieldname':'name','width':200},
#         {'label':'Customer', 'fieldname':'customer','width':100},
#         {'label':'Customer Name', 'fieldname':'customer_name','width':100},
#         {'label':'Posting Date', 'fieldname':'posting_date','width':150, 'fieldtype': 'Date'},
#         {'label':'Item', 'fieldname':'item_code','width':150},
#         {'label':'Quantity', 'fieldname':'qty','width':100},
#         {'label':'Rate', 'fieldname':'rate','width':100},
#         {'label':'Grand Total', 'fieldname':'grand_total','width':100},
#         {'label':'Status', 'fieldname':'status','width':100},
#     ]

#     conds = {}
#     if customer:
#         conds["customer"] = customer
#     if posting_date:
#         conds["posting_date"] = posting_date
#     if status:
#         conds["status"] = status

#     invoices = frappe.get_all("Sales Invoice", fields=["name", "customer", "customer_name", "posting_date", "grand_total", "status"], filters=conds)

#     data = []

#     for inv in invoices:
#         # Parent row (indent = 0)
#         data.append({
#             "name": inv.name,
#             "customer": inv.customer,
#             "customer_name": inv.customer_name,
#             "posting_date": inv.posting_date,
#             "grand_total": inv.grand_total,
#             "status": inv.status,
#             "indent": 0
#         })

#         # Fetch items (child rows, indent = 1)
#         items = frappe.get_all("Sales Invoice Item", fields=["item_code", "qty", "rate"], filters={"parent": inv.name})

#         for item in items:
#             data.append({
                
#                 "item_code": item.item_code,
#                 "qty": item.qty,
#                 "rate": item.rate,
#                 "indent": 1
#             })

#     return columns, data
