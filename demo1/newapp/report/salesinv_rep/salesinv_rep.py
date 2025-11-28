import frappe
from collections import defaultdict

def execute(filters=None):
	filters = filters or {}

	customer = filters.get('customer')
	posting_date = filters.get('posting_date')
	status = filters.get('status')

	condns = ""
	if customer:
		condns += ' AND si.customer = %(customer)s'
	if posting_date:
		condns += ' AND si.posting_date = %(posting_date)s'
	if status:
		condns += ' AND si.status = %(status)s'

	columns = [
		{'label': 'Customer', 'fieldname': 'customer', 'width': 100},
		{'label': 'Sales Invoice', 'fieldname': 'name', 'width': 300},
		{'label': 'Item', 'fieldname': 'item_code', 'width': 150},
		{'label': 'Quantity', 'fieldname': 'qty', 'width': 150},
		{'label': 'Rate', 'fieldname': 'rate', 'width': 100},
		{'label':'Total Amount','fieldname':'amount','width':150},
		{'label': 'Status', 'fieldname': 'status', 'width': 150}
	]

	query = f"""
		SELECT 
		si.customer, si.name, sii.item_code, sii.qty, sii.rate, si.grand_total,sii.amount, si.status
		FROM
		`tabSales Invoice` AS si
		LEFT JOIN
		`tabSales Invoice Item` AS sii
		ON
		sii.parent = si.name
		WHERE 1=1 {condns}
	"""

	customer_total = defaultdict(float)
	g_data = defaultdict(list)
	seen_invoice = set()

	r_data = frappe.db.sql(query, filters, as_dict=True)

	for row in r_data:
		if row.name not in seen_invoice:
			customer_total[row.customer] += row.grand_total
			seen_invoice.add(row.name)
		g_data[row.customer].append(row)

	data = []

	for customer, records in g_data.items():
		data.append({
			'customer': customer,
			'amount': customer_total[customer],
			'indent': 0
		})

		for row in records:
			data.append({
				'name': row.name,
				'item_code': row.item_code,
				'qty': row.qty,
				'rate': row.rate,
				'amount':row.amount,
				'status': row.status,
				'indent': 1
			})

	return columns, data


# import frappe
# from collections import defaultdict

# def execute(filters=None):
# 	filters = filters or {}

# 	customer = filters.get('customer')
# 	posting_date = filters.get('posting_date')
# 	status = filters.get('status')

# 	condns = ""
# 	if customer:
# 		condns += ' AND si.customer = %(customer)s'
# 	if posting_date:
# 		condns += ' AND si.posting_date = %(posting_date)s'
# 	if status:
# 		condns += ' AND si.status = %(status)s'

# 	columns = [
# 		{'label': 'Customer', 'fieldname': 'customer', 'width': 100},
# 		{'label': 'Sales Invoice', 'fieldname': 'name', 'width': 300},
# 		{'label': 'Item', 'fieldname': 'item_code', 'width': 150},
# 		{'label': 'Quantity', 'fieldname': 'qty', 'width': 150},
# 		{'label': 'Rate', 'fieldname': 'rate', 'width': 100},
# 		{'label':'Total Amount','fieldname':'amount','width':150},
# 		{'label': 'Status', 'fieldname': 'status', 'width': 150}
# 	]

# 	query = f"""
# 		SELECT 
# 		si.customer, si.name, si.grand_total, si.status,
# 		sum(grand_total) as "Total"
# 		FROM
# 		`tabSales Invoice` AS si
# 		WHERE 1=1 {condns}
# 		Group By si.customer
# 	"""

# 	r_data = frappe.db.sql(query, filters, as_dict=True)
# 	data = []

# 	for i in r_data:
# 		# Parent row
# 		data.append({
# 			"customer": i.customer,
# 			"amount": i.Total,
# 			"indent": 0
# 		})

# 		# Child rows (items per invoice)
# 		items = frappe.db.sql("""
# 			SELECT item_code, qty, rate,amount
# 			FROM `tabSales Invoice Item`
# 			WHERE parent = %s
# 		""", (i.name,), as_dict=True)

# 		for j in items:
# 			data.append({
				
# 				"name": i.name,
# 				"item_code": j.item_code,
# 				"qty": j.qty,
# 				"rate": j.rate,
# 				"amount":j.amount,
# 				"indent": 1
# 			})
# 	return columns, data


