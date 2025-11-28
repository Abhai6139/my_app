# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate,today


class FineHistory(Document):
	pass
	def validate(self):
		if getdate(self.fine_date)>getdate(today()):
			frappe.throw('Fine Date cannot be in future')
		if getdate(self.paid_on)<getdate(self.fine_date):
			frappe.throw('Fine paid date cannot be before fine date')
		if self.paid_by:
			if not self.paid_on:
				frappe.throw('Add Payment Date')
		else:
			if self.paid_on:
				frappe.throw('Add Paid Person')
		if not self.fine_no:
			frappe.throw('Add Fine Number')
		
	def on_submit(self):
		if self.paid_on :
			self.db_set("fine_status", "Paid")
	def before_submit(self):
		if not self.paid_on:
			frappe.throw('Add payment details to submit the document')















































# @frappe.whitelist()
# def get_fine_history_html(vehicle):
#     fines = frappe.get_all("Fine History", 
#         filters={"vehicle": vehicle, "docstatus": 1},
#         fields=["fine_date", "fine_amount", "reason", "paid_by", "paid_on", "fine_place"],
#         order_by="fine_date desc"
#     )

#     if not fines:
#         return "<p>No fine history available.</p>"

#     html = """
#     <table class="table table-bordered">
#         <thead>
#             <tr>
#                 <th>Fine Date</th>
#                 <th>Amount</th>
#                 <th>Reason</th>
#                 <th>Paid By</th>
#                 <th>Paid On</th>
#                 <th>Place</th>
#             </tr>
#         </thead>
#         <tbody>
#     """

#     for fine in fines:
#         html += f"""
#         <tr>
#             <td>{formatdate(fine.fine_date)}</td>
#             <td>{fine.fine_amount}</td>
#             <td>{fine.reason}</td>
#             <td>{fine.paid_by or ""}</td>
#             <td>{formatdate(fine.paid_on) if fine.paid_on else ""}</td>
#             <td>{fine.fine_place or ""}</td>
#         </tr>
#         """

#     html += "</tbody></table>"
#     return html
