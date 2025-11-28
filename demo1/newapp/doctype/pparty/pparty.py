# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class PParty(Document):
	pass
	def validate(self):
		if not self.retired_on:
			frappe.throw('Enter Retiring Date')
		elif self.retired_on < self.posting_date:
			frappe.throw('Retire date must be in future')
