# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import add_days


class PPEAutorization(Document):
	pass
	def on_submit(self):
		if self.authorized_items:
			for i in self.authorized_items:
				if i.qty>i.requested_qty:
					frappe.throw('Allowed quantity cannot be greater than requested quantity')
				if i.status=='Approved':
					if i.qty<=0:
						if not i.remarks:
							frappe.throw('Add remarks')
					else:
						data=frappe.db.get_value('Item',i.item_code,'custom_stock_qty')
						newval=data-i.qty
						frappe.db.set_value('Item',i.item_code,'custom_stock_qty',newval)
				if i.remarks:
					doc=frappe.get_doc('PPE Request',self.ppe_request_reference)
					for j in doc.ppe_items:
						if j.item_code==i.item_code:
							j.remarks=i.remarks
					doc.save()

	def validate(self):
		if self.authorized_items:
			for i in self.authorized_items:
				if i.status=='Rejected':
					if not i.remarks:
						frappe.throw('Add remarks')
				i.total_issued_qty=0
				date=[]
				one_year = add_days(self.ppe_request_date, -365)
				data=frappe.get_list('PPE Autorization',
						filters=[
							['name','!=',self.name],
							['docstatus','=',1],
							['ppe_request_date','between',[one_year,self.ppe_request_date]]
						])
				for j in data:
					doc=frappe.get_doc('PPE Autorization',j)
					if doc:
						for m in doc.authorized_items:
							if m.item_code==i.item_code:
								if m.status=='Approved':
									i.total_issued_qty+=m.qty 
									date.append(doc.ppe_request_date)
									i.previously_issued_date=max(date)

	def on_cancel(self):
		if self.authorized_items:
			for i in self.authorized_items:
				doc=frappe.get_doc('Item',i.item_code)
				doc.custom_stock_qty=doc.custom_stock_qty+i.qty
				doc.save()