# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class StockOrganizingTool(Document):
	pass
	def validate(self):
		if self.box or self.shelftrolley:
			for i in self.items:
				i.box=self.box
				i.shelf_or_trolley=self.shelf_or_trolley
				i.shelftrolley=self.shelftrolley
				frappe.db.set_value('Serial No',i.serial_no,{'custom_box':self.box,'custom_shelf_or_trolley':self.shelf_or_trolley,'custom_shelftrolley':self.shelftrolley})

@frappe.whitelist()
def getdoc(name):
    if frappe.db.exists('Shelf', name):
        return 'Shelf'
    elif frappe.db.exists('Trolley', name):
        return 'Trolley'



