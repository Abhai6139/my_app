# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class VehicleID(Document):
	def autoname(self):
		self.name = f"{(self.vehicle_id or '').upper()}-{(self.make_model or '').upper()}"
	def before_save(self):
		new_name = f"{(self.vehicle_id or '').upper()}-{(self.make_model or '').upper()}"

		if self.name != new_name:
			frappe.rename_doc(self.doctype, self.name, new_name, force=True)
			self.name = new_name
	def validate(self):
		if self.is_guest==1:
			self.db_set('customer','Guest')