# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import today, getdate, add_days


class PPERequest(Document):
	pass
	def validate(self):
		if getdate(self.ppe_request_date)<getdate(today()):
			frappe.throw('PPE request date cannot be in past')
		if self.ppe_items:
			for i in self.ppe_items:
				doc=frappe.get_doc('Item',i.item_code)
				if i.qty>doc.custom_max_issue_qty:
					frappe.throw('Quantity cannot be greater than maximum issue Quantity')
				elif i.qty==0:
					frappe.throw('Add Quantity')
				elif i.qty>doc.custom_stock_qty:
					frappe.throw('Item not available')
				one_year = add_days(self.ppe_request_date, -365)
				docs=frappe.db.get_list('PPE Autorization',
						filters=[
							['docstatus','=',1],
							['ppe_request_date','between',[one_year,self.ppe_request_date]]
						])
				old_qty=0
				if docs:
					for j in docs:
						doc1=frappe.get_doc('PPE Autorization',j)
						if doc1:
							for m in doc1.authorized_items:
								if m.item_code==i.item_code:
									if not m.issued_item_damaged==1:
										old_qty+=m.qty
				if old_qty+i.qty>doc.custom_max_issue_qty:
					if i.issued_item_damaged==1:
						if not doc.custom_damaged_item_can_be_replaced==1:
							frappe.throw(f'Item {i.item_name} cannot replace')
					else:
						frappe.throw(f'Maximum {i.item_name} Requests reached for {self.employee}')
				else:
					if i.issued_item_damaged==1:
						if not doc.custom_damaged_item_can_be_replaced==1:
							frappe.msgprint('Item cannot replace')
