# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime
from frappe.model.document import Document


class LibraryBook(Document):
	pass
	def validate(self):
		if self.published_year:
			curr_year=datetime.today().year
			if int(self.published_year)>curr_year:
				frappe.throw("Published year cannot be in future.")
				