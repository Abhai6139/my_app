# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
# from erpnext.stock.utils import get_valuation_rate
# from erpnext.stock.stock_ledger import get_valuation_rate
from erpnext.manufacturing.doctype.bom.bom import get_valuation_rate
# /home/abhii/ver-15/apps/erpnext/erpnext/manufacturing/doctype/bom/bom.py
# /home/abhii/ver-15/apps/erpnext/erpnext/stock/stock_ledger.py




class SCRA(Document):
	def validate(self):
		if self.scra_details:
			# frappe.msgprint('mnmnmnmnm')
			for i in self.scra_details:
				if i.unit:
					if i.material_type=='Item':
						valuation_data = get_valuation_rate(
							data={'item_code':i.materials,'company': 'Craft' } 
							# warehouse=None,
							# voucher_type=None,
							# voucher_no=None
						)
					else:
						valuation_data = get_valuation_rate(
							data={'item_code':i.product,'company': 'Craft' } 
							# warehouse=None,
							# voucher_type=None,
							# voucher_no=None
						)
					if valuation_data:
						# frappe.msgprint(str(valuation_data))
						i.unit_price=valuation_data
					else:
						i.unit_price=0
					unit_price=valuation_data or 0
					doc=frappe.get_doc('UOM',i.unit)
					if doc.custom_calculate_rate_based_on_formula==1:
						total=eval(doc.custom_formula,{
							'part':i.part,
							'depletion':i.depletion,
							'wastage':i.wastage,
							'unit_price':i.unit_price
						})
						i.unit_rate=total
					if doc.custom_calculate_unit_ratem2_based_on_formula==1:
						total2=eval(doc.custom_formula2,{
							'unit_rate':i.unit_rate,
							'thickness':i.thickness
						})
						i.rate=total2

@frappe.whitelist()
def create_prefilled_quotation(mix_design, scope_of_work, scra):
    doc = frappe.new_doc("Quotation")
    doc.append("items", {
        "item_code": mix_design,
        "item_name": mix_design,
        "uom": "M^2",
        "qty": 1,
        "custom_scope_of_work": scope_of_work,
        "custom_scra": scra,
        "custom_mix_design": mix_design
    })

    return doc



