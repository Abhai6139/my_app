# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import add_days, getdate, today,now_datetime
from frappe.model.naming import make_autoname
from frappe.utils import cint
from frappe.utils import random_string



class DutyAllocation(Document):
	pass
	def validate(self):
		if self.from_date and not self.to_date:
			date=add_days(self.from_date,5)
			self.db_set('to_date',date)
		if getdate(self.posting_date)<getdate(today()):
			frappe.log_error("Posting Date cannot be in past.", "Date Error")
			frappe.throw('Posting Date cannot be in past')
		if getdate(self.posting_date)>getdate(self.from_date):
			frappe.throw('From date cannot be before posting date')
		if getdate(self.to_date)<getdate(self.from_date):
			frappe.throw('To date cannot be before from date')

		if frappe.db.exists("Duty Allocation", {"employee": self.employee,'status':'Active','docstatus':1}):
			frappe.throw("Your Previous task is not over yet.")
		if self.employee:
			exp=frappe.db.get_value('Employee',self.employee,'custom_experience1')
			self.db_set('experience',cint(exp))
		num=frappe.get_single('Duty Setup')
		maxi=0
		if num.reference_doctype=='Duty Allocation':
			if num.apply_limit==1:
				get_num=num.members
				for i in self.allocation_table:
					maxi+=1
				if maxi>get_num:
					frappe.throw(f"Only {get_num} members allowed in a task group or uncheck Apply limit")
				


	def on_submit(self):
		frappe.permissions.add_permission("Duty Allocation", "Employee")
		if frappe.has_permission("Duty Allocation", "submit", doc=self.name, user=self.allocator):
			frappe.msgprint("User has access to Submit")
		else:
			frappe.throw("Access Denied")

		if self.docstatus==1:
			frappe.db.set_value('Duty Allocation',self.name,'status','Active')
		if self.employee:
			attachments = [frappe.attach_print(
				doctype="Duty Allocation",
				name=self.name,
				print_format="Duty Print",
				print_letterhead=True
			)]
			email =frappe.get_value('Employee', self.employee, 'personal_email')
			uid= random_string(12)
			password= random_string(8)
			frappe.sendmail(
				recipients=[email],
				subject="Your Task Allocation",
				message=f"""Dear {self.name1}<br>
								You are assigned as the team lead for upcoming week task (from {self.from_date} to {self.to_date})<br>
								Project = {self.project}<br>
								User id = {uid}<br>
								Password = {password}<br>
								Please go through the attachment for more details""",
				attachments=attachments
			)

		for i in self.allocation_table:
			user =frappe.get_value('Employee', i.employee, 'personal_email')
			uid= random_string(12)
			password= random_string(8)
			if user:
				frappe.enqueue(
					method=frappe.sendmail,
					queue='short',
					job_name='send_duty_email',
					recipients=[user],
					subject="Work Allert",
					message=f"""Hi {i.employee_name}<br>
								Task assigned for upcoming week (from {self.from_date} to {self.to_date})<br>
								Project = {self.project}<br>
								Task = {i.duty}<br>
								User id = {uid}<br>
								Password = {password}"""
				)
		frappe.clear_cache(doctype="Duty Allocation")
		frappe.clear_cache(doctype="Duty Log")

	def on_cancel(self):
		if self.status=='Active':
			self.status='Inactive'
		names=frappe.get_all('Duty Log',{'reference':self.name},pluck='name')
		for i in names:
			doc2=frappe.get_doc('Duty Log',i)
			if doc2:
				doc2.cancel()
				frappe.delete_doc("Duty Log", i, ignore_permissions=True)
				frappe.msgprint('Duty log removed')

	def on_update(self):
		frappe.msgprint(f"Changes has been updated.")

	def onload(self):
		if not self.posting_date:
			self.db_set('posting_date',now_datetime())




def update_status():
	docs=frappe.db.get_list('Duty Allocation',filters={'status':'Active','docstatus':1},fields=['name', 'to_date'])
	for doc in docs:
		if getdate(doc.to_date)<getdate(today()):
			frappe.db.set_value('Duty Allocation',doc.name,'status','Inactive')
			frappe.db.commit()
			
def old_delete():
	docs=frappe.db.get_list('Duty Allocation',filters={'status':'Inactive','docstatus':1},fields=['name'])
	for doc in docs:
		if doc:
			doc1=frappe.get_doc('Duty Allocation',doc.name)
			doc1.cancel()

@frappe.whitelist()
def rename_with_series(doctype, old_name):
    new_name = make_autoname("TASK-.#####")
    frappe.rename_doc(doctype, old_name, new_name, force=True)
    return new_name


