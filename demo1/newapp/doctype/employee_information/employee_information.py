# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class EmployeeInformation(Document):
	pass
# 	def on_submit(self):
# 		for i in self.document_details:
# 			doc_details = frappe.new_doc('Doc Details')
# 			doc_details.document_no=i.document_no
# 			doc_details.document_name=i.document_name
# 			doc_details.issue_date=i.issue_date
# 			doc_details.insert()
# 			doc_details.submit()
# 		frappe.msgprint(
#     msg='Documents Created',
#     title='Success',
    
# )

@frappe.whitelist()
def testfrappe():
	return "data passed"

@frappe.whitelist()
def view_info( name, emp_name, design, ):
	if name:
		doc = frappe.get_doc('Employee', name)
	else:
		doc = frappe.get_doc(doctype)
	return {
		'emp_name':doc.employee_name,
		'design':doc.designation,
		
	}

@frappe.whitelist()
def view_doc( name, emp_name, design, employee):
	if name:
		doc = frappe.get_doc('Employee', name)
	else:
		doc = frappe.get_doc(doctype)
	return {
		'emp_name':doc.employee_name,
		'design':doc.designation,
		'employee':doc.employee
	}