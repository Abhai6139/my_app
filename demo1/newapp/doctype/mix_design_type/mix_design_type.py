# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MixDesignType(Document):
	pass
	def on_trash(self):
		doc=frappe.get_doc('Item',self.mix_design_type)
		doc.delete()
		# frappe.show_alert('Item removed', 5)