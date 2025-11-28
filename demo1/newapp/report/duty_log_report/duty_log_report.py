# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
	filters = filters or {}

	employee = filters.get('employee')

	condns = ""
	if employee:
		condns += ' AND employee = %(employee)s'

	columns=[
		{'label':'Employee','Fieldname':'employee','width':200},
		{'label':'Employee Name','Fieldname':'employee_name','width':200},
		{'label':'From Date','Fieldname':'from_date','width':200},
		{'label':'To Date','Fieldname':'to_date','width':200},
		{'label':'Reference','Fieldname':'reference','width':200},
	]

	r_data=f"""
		SELECT
			employee_name, employee, reference, from_date, to_date, docstatus
		FROM
			`tabDuty Log`
		WHERE 1=1{condns}
	"""

	data=frappe.db.sql(r_data, filters, as_dict=True)
	return columns, data





# import frappe
# from frappe import _

# def execute(filters=None):
#     conditions = "1=1"
#     # if not filters or not filters.get("from_date") or not filters.get("to_date"):
#     #     frappe.throw("Please select From Date and To Date")

#     values = {}

#     if filters:
#         if filters.get("from_date"):
#             conditions += " AND pa.posting_date >= %(from_date)s"
#             values["from_date"] = filters["from_date"]
        
#         if filters.get("to_date"):
#             conditions += " AND pa.posting_date <= %(to_date)s"
#             values["to_date"] = filters["to_date"]
        
#         if filters.get("payment_application"):
#             conditions += " AND pa.name = %(payment_application)s"
#             values["payment_application"] = filters["payment_application"]
            
#         if filters.get("project"):
#             conditions += " AND pa.project = %(project)s"
#             values["project"] = filters["project"]

#     query = f"""
#         SELECT 
#             pa.name AS pay_app_no,
#             pc.name AS pay_cer_no,
#             pc.posting_date AS rcv_date,
#             pa.posting_date AS pay_app_date,
#             pa.customer_name AS customer_name,
#             p.custom_project_manger_name AS project_manager,
#             p.name AS project,
#             p.project_name AS projectname,
#             (CASE WHEN pai.item_code != "Advance" THEN pa.total ELSE 0 END) AS gross_pay_amount,
#             (CASE WHEN pci.item_code != "Advance" THEN pc.total ELSE 0 END) AS certified_gross_amount,
#             COALESCE(t1.retention, 0) AS retention,
#             COALESCE(t1.client_contra_charge, 0) AS client_contra_charge,
#             COALESCE(t1.advance_recovery, 0) AS advance_recovery,
#             COALESCE(t2.certified_retention, 0) AS certified_retention,
#             COALESCE(t2.certified_advance, 0) + COALESCE(adv.advance_item_amt, 0) AS certified_advance,
#             COALESCE(t2.agreed_contra_charge, 0) AS agreed_contra_charge,
#             pa.total AS net_pay_app_total,
#             pc.total AS net_certified_total
#         FROM 
#             `tabPayment Application` AS pa
#         LEFT JOIN 
#             `tabPayment Application Item` AS pai ON pa.name = pai.parent
#         LEFT JOIN 
#             `tabPayment Certificate Item` AS pci ON pa.name = pci.payment_application
#         LEFT JOIN 
#             `tabPayment Certificate` AS pc ON pc.name = pci.parent
#         LEFT JOIN 
#             `tabProject` AS p ON p.name = pa.project
#         LEFT JOIN (
#             SELECT 
#                 pa_item.parent,
#                 SUM(CASE WHEN st.is_retention = 1 THEN st.tax_amount ELSE 0 END) AS retention,
#                 SUM(CASE WHEN st.custom_is_contra = 1 THEN st.tax_amount ELSE 0 END) AS client_contra_charge,
#                 SUM(CASE WHEN st.is_advance = 1 THEN st.tax_amount ELSE 0 END) 
#                 + COALESCE(SUM(CASE WHEN pa_item.item_code = 'Advance' THEN pa_item.amount ELSE 0 END), 0) AS advance_recovery
#             FROM `tabPayment Application Item` pa_item
#             LEFT JOIN `tabSales Taxes and Charges` st ON st.parent = pa_item.parent
#             GROUP BY pa_item.parent
#         ) AS t1 ON t1.parent = pa.name

#         LEFT JOIN (
#             SELECT 
#                 st.parent AS parent,
#                 SUM(CASE WHEN st.is_retention = 1 THEN st.tax_amount ELSE 0 END) AS certified_retention,
#                 SUM(CASE WHEN st.custom_is_contra = 1 THEN st.tax_amount ELSE 0 END) AS agreed_contra_charge,
#                 SUM(CASE WHEN st.is_advance = 1 THEN st.tax_amount ELSE 0 END) AS certified_advance
#             FROM `tabSales Taxes and Charges` st
#             GROUP BY st.parent
#         ) AS t2 ON t2.parent = pc.name

#         LEFT JOIN (
#             SELECT 
#                 parent,
#                 SUM(certified_amt) AS advance_item_amt
#             FROM `tabPayment Certificate Item`
#             WHERE item_code = 'Advance'
#             GROUP BY parent
#         ) AS adv ON adv.parent = pc.name
#         WHERE {conditions} AND pa.docstatus = 1
#                             AND pc.docstatus = 1
#                             AND pc.name IS NOT NULL
#     """

#     data = frappe.db.sql(query, values, as_dict=True)

#     # === Adjust PayApp & Certified totals using latest tax logic ===
#     for row in data:
#         row.setdefault("net_pay_app_total", 0)
#         row.setdefault("net_certified_total", 0)

#         # Payment Application adjustment
#         taxes = frappe.get_all(
#             "Sales Taxes and Charges",
#             filters={"parent": row.pay_app_no},
#             fields=["is_advance", "is_retention", "custom_is_contra", "custom_is_received_retention", "total"],
#             order_by="idx asc"
#         )
#         for tax in reversed(taxes or []):
#             if tax.is_advance or tax.is_retention or tax.custom_is_contra or tax.custom_is_received_retention:
#                 row["net_pay_app_total"] = tax.total
#                 break

#         # Payment Certificate adjustment
#         if row.get("pay_cer_no"):
#             taxes = frappe.get_all(
#                 "Sales Taxes and Charges",
#                 filters={"parent": row["pay_cer_no"]},
#                 fields=["is_advance", "is_retention", "custom_is_contra", "custom_is_received_retention", "total"],
#                 order_by="idx asc"
#             )
#             for tax in reversed(taxes or []):
#                 if tax.is_advance or tax.is_retention or tax.custom_is_contra or tax.custom_is_received_retention:
#                     row["net_certified_total"] = tax.total
#                     break

#     # --- Handle multi-application single certificate ---
#     certificate_map = {}
#     for row in data:
#         cert_no = row.get("pay_cer_no")
#         if not cert_no:
#             continue

#         if cert_no not in certificate_map:
#             certificate_map[cert_no] = {
#                 "applications": [],
#                 "certified_gross_amount": row.get("certified_gross_amount") or 0,
#                 "net_certified_total": row.get("net_certified_total") or 0,
#                 "certified_doc": row
#             }

#         certificate_map[cert_no]["applications"].append(row)

#     # Apply multi-app logic
#     for cert_no, cert_data in certificate_map.items():
#         applications = cert_data["applications"]
#         certified_gross = cert_data["certified_gross_amount"]
#         certified_net_total = cert_data["net_certified_total"]

#         total_gross_pay = sum(app.get("gross_pay_amount") or 0 for app in applications)
#         total_net_pay = sum(app.get("net_pay_app_total") or 0 for app in applications)
#         latest_app = sorted(applications, key=lambda x: (x["pay_app_date"], x["pay_app_no"]))[-1]
#         latest_contra = latest_app.get("agreed_contra_charge") or 0

#         for app in applications:
#             app["gross_amount_difference"] = total_gross_pay - certified_gross
#             app["gross_amount_difference_with_contra"] = (
#                 total_gross_pay - certified_gross - latest_contra + (app.get("client_contra_charge") or 0)
#             )
#             print(app["gross_amount_difference_with_contra"])
#             # print('HHHHHHHHHHHH')
#             # print(app["gross_amount_difference"] )
#             # print('MMMMMMMMMMMMMMMMM')
#             app["net_amount_difference"] = total_net_pay - certified_net_total
#             # print(app["net_amount_difference"])
#             # print('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx')

#     # --- Project-wise summarization ---
#     project_summary = {}
#     seen_certificates = set()

#     for row in data:
#         project = row.get("project") or ""
#         pname = row.get("projectname") or ""

#         if project not in project_summary:
#             project_summary[project] = {
#                 "projectname": pname,
#                 "pay_cer_no": row.get("pay_cer_no") or "",
#                 "rcv_date": row.get("rcv_date") or "",
#                 "pay_app_no": row.get("pay_app_no") or "",
#                 "pay_app_date": row.get("pay_app_date") or "",
#                 "project_manager": row.get("project_manager") or "",
#                 "customer_name": row.get("customer_name") or "",
#                 "project_name": project,
#                 "gross_pay_amount": 0,
#                 "retention": 0,
#                 "advance_recovery": 0,
#                 "net_pay_app_total": 0,
#                 "certified_gross_amount": 0,
#                 "net_certified_total": 0,
#                 "client_contra_charge": 0,
#                 "certified_retention": 0,
#                 "certified_advance": 0,
#                 "agreed_contra_charge": 0,
#                 "gross_amount_difference": 0,
#                 "gross_amount_difference_with_contra": 0,
#                 "deductions": 0,
#                 "net_amount_difference": 0
#             }

#         project_summary[project]["gross_pay_amount"] += row.get("gross_pay_amount") or 0
#         project_summary[project]["retention"] += row.get("retention") or 0
#         project_summary[project]["advance_recovery"] += row.get("advance_recovery") or 0
#         project_summary[project]["net_pay_app_total"] += row.get("net_pay_app_total") or 0
#         project_summary[project]["client_contra_charge"] += row.get("client_contra_charge") or 0

#         cert_no = row.get("pay_cer_no")
#         if cert_no and cert_no not in seen_certificates:
#             seen_certificates.add(cert_no)
#             project_summary[project]["certified_gross_amount"] += row.get("certified_gross_amount") or 0
#             project_summary[project]["net_certified_total"] += row.get("net_certified_total") or 0
#             project_summary[project]["certified_retention"] += row.get("certified_retention") or 0
#             project_summary[project]["certified_advance"] += row.get("certified_advance") or 0
#             project_summary[project]["agreed_contra_charge"] += row.get("agreed_contra_charge") or 0
#             project_summary[project]["gross_amount_difference"] += row.get("gross_amount_difference") or 0
#             project_summary[project]["gross_amount_difference_with_contra"] += row.get("gross_amount_difference_with_contra") or 0
#             project_summary[project]["deductions"] += row.get("deductions") or 0
#             project_summary[project]["net_amount_difference"] += row.get("net_amount_difference") or 0


#     # ---  Update latest Pay App & Certificate names only ---
#     for project, rows in project_summary.items():
#         project_apps = [d for d in data if d.get("project") == project]
#         if not project_apps:
#             continue

#         latest_app = sorted(
#             [r for r in project_apps if r.get("pay_app_no")],
#             key=lambda x: (x.get("pay_app_date"), x.get("pay_app_no")),
#         )[-1]

#         certs = [r for r in project_apps if r.get("pay_cer_no")]
#         latest_cert = (
#             sorted(certs, key=lambda x: (x.get("rcv_date"), x.get("pay_cer_no")))[-1]
#             if certs else None
#         )

#         rows["pay_app_no"] = latest_app.get("pay_app_no")
#         rows["pay_app_date"] = latest_app.get("pay_app_date")
#         rows["pay_cer_no"] = latest_cert.get("pay_cer_no") if latest_cert else ""
#         rows["rcv_date"] = latest_cert.get("rcv_date") if latest_cert else ""

#     # --- Project-wise grouped view ---
#     grouped_data = []

#     numeric_fields = {
#         "gross_pay_amount", "retention", "advance_recovery", "net_pay_app_total",
#         "client_contra_charge", "certified_gross_amount", "certified_retention",
#         "certified_advance", "agreed_contra_charge", "net_certified_total",
#         "gross_amount_difference", "gross_amount_difference_with_contra",
#         "deductions", "net_amount_difference"
#     }

#     for project, rows in project_summary.items():
#         pname = rows.get("projectname") or ""

#         header_row = {}
#         for key in rows.keys():
#             if key in numeric_fields:
#                 header_row[key] = None
#             else:
#                 header_row[key] = ""
#         header_row["project_name"] = f"<b>{project}: {pname}</b>"
#         header_row["indent"] = 0
#         grouped_data.append(header_row)

#         detail_row = rows.copy()
#         detail_row["project_name"] = ""
#         detail_row["indent"] = 1
#         grouped_data.append(detail_row)

#     for row in grouped_data:
#         if row.get("indent") == 1:
#             gross_pay = row.get("gross_pay_amount") or 0
#             gross_diff_with_contra = row.get("gross_amount_difference_with_contra") or 0
#             row["deductions"] = (
#                 (gross_diff_with_contra / gross_pay) * 100 if gross_pay else 0
#             )

#     columns = [
#         {"fieldname": "project_name", "label": _("Project"), "fieldtype": "Data", "width": 200},
#         {"fieldname": "pay_cer_no", "label": _("RCV No"), "fieldtype": "Link", "options": "Payment Certificate"},
#         {"fieldname": "rcv_date", "label": _("RCV Date"), "fieldtype": "Date", "width": 140},
#         {"fieldname": "pay_app_no", "label": _("Pay App No"), "fieldtype": "Link", "options": "Payment Application", "width": 200},
#         {"fieldname": "pay_app_date", "label": _("Pay App Date"), "fieldtype": "Date", "width": 140},
#         {"fieldname": "customer_name", "label": _("Customer Name"), "fieldtype": "Data"},
#         {"fieldname": "project_manager", "label": _("Project Manager"), "fieldtype": "Data"},
#         {"fieldname": "gross_pay_amount", "label": _("Gross Pay Amount"), "fieldtype": "Currency"},
#         {"fieldname": "retention", "label": _("Retention"), "fieldtype": "Currency"},
#         {"fieldname": "advance_recovery", "label": _("Advance Recovery"), "fieldtype": "Currency"},
#         {"fieldname": "client_contra_charge", "label": _("Agreed Contra Charges"), "fieldtype": "Currency"},
#         {"fieldname": "net_pay_app_total", "label": _("Net PayApp Total"), "fieldtype": "Currency"},
#         {"fieldname": "certified_gross_amount", "label": _("Certified Gross Amount"), "fieldtype": "Currency"},
#         {"fieldname": "certified_retention", "label": _("Certified Retention"), "fieldtype": "Currency"},
#         {"fieldname": "certified_advance", "label": _("Certified Add Recovery"), "fieldtype": "Currency"},
#         {"fieldname": "agreed_contra_charge", "label": _("Client Contra Charges"), "fieldtype": "Currency"},
#         {"fieldname": "net_certified_total", "label": _("Net Certified Total"), "fieldtype": "Currency"},
#         {"fieldname": "gross_amount_difference", "label": _("Gross Amount Difference"), "fieldtype": "Currency"},
#         {"fieldname": "gross_amount_difference_with_contra", "label": _("Gross Amt Diff with Contra"), "fieldtype": "Currency"},
#         {"fieldname": "deductions", "label": _("Deductions%"), "fieldtype": "Float"},
#         {"fieldname": "net_amount_difference", "label": _("Net Amount Difference"), "fieldtype": "Currency"},
#     ]

#     return columns, grouped_data
