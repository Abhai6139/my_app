# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MixDesignBOQ(Document):
	def validate(self):
		if self.boq_details:
			for i in self.boq_details:
				total=(i.depletion*i._part*(1+i._wastage/100)/1000)*i.thickness*0.01
				i.qty=total

@frappe.whitelist()
def remove_rows(mixdesign, doc):
    doc1 = frappe.get_doc('MixDesign BOQ', doc)
   
    updated_rows = [row for row in doc1.boq_details if row.mix_design != mixdesign]
    doc1.set('boq_details', updated_rows)
    doc1.save()
    return "Removed rows with mix_design: {}".format(mixdesign)
