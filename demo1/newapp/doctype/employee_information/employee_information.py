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
def view_info( name):
	if name:
		doc = frappe.get_doc('Employee', name)
	return {
		'emp_name':doc.employee_name,
		'design':doc.designation,
		
	}

@frappe.whitelist()
def view_doc( name):
	if name:
		doc = frappe.get_doc('Employee', name)
	
	return {
		'emp_name':doc.employee_name,
		'design':doc.designation,
		'employee':doc.employee
	}
@frappe.whitelist()
def get_child(name):
	doc=frappe.get_doc('Doc Templates',name)
	return [row.as_dict() for row in doc.documents]

@frappe.whitelist()
def get_employees(department=None, branch=None, company=None):
	filters = []
	if company:
		filters.append(["company", "=", company])
	if department:
		filters.append(["department", "=", department])
	if branch:
		filters.append(["branch", "=", branch])
	return frappe.get_all("Employee",
		filters=filters,
		fields=["name", "department", "branch"]
	)