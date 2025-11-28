# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class LibraryMember(Document):
	pass
	def validate(self):
		if not (self.email or self.phone):
	 		frappe.throw("Provide at least one contact detail")
		if not (self.status=='Active') or (self.status=='Inactive'):
			frappe.throw("Status must be Active or Inactive")

	def onload(self):
		if self.member_name:
			doc=frappe.get_all('Library Fine',filters={'member':self.member_name},
			fields=['book','fine_amount','date'])
			for i in doc:
				self.append('library_fine', {
					'book':i.book,
					'fine_amount': i.fine_amount,
					'fine_date': i.date
				})
			total_fine=frappe.db.sql("""
				SELECT SUM(fine_amount)
				FROM `tabLibrary Fine` lf
				WHERE lf.member=%s
			""",self.member_name)
		self.total_fine=total_fine[0][0]