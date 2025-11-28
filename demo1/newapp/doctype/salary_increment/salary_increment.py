# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SalaryIncrement(Document):
	def validate(self):
		data=frappe.db.get_list('Salary Structure Assignment',
			filters= [
				['employee','=', self.employee],
				['docstatus','=',1],
				['company','=',self.company]
			])
		if not data:
			frappe.throw('Add base Salary Structure Assignment for this employee')
