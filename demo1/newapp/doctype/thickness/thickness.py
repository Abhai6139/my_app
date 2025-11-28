# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Thickness(Document):
	def validate(self):
		if self.minimum_thickness>self.maximum_thickness:
			frappe.throw('Maximum thickness cannot be less than minimum thickness')
		if self.minimum_thickness<0:
			frappe.throw('Thickness cannot be in negative')