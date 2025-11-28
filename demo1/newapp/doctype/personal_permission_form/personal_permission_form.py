# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import get_datetime, get_first_day, get_last_day, getdate,today,time_diff_in_hours
from frappe.model.document import Document
from datetime import timedelta


class PersonalPermissionForm(Document):
	pass
	def validate(self):
		d1=getdate(self.posting_date)+timedelta(days=3)
		if getdate(self.permission_from_date_and_time)>d1 or getdate(self.permission_to_date_and_time)>d1:
			frappe.throw('Permission dates can be only within 3 days')
		elif getdate(self.permission_from_date_and_time)<getdate(today()) or getdate(self.permission_to_date_and_time)<getdate(today()):
			frappe.throw('Permission dates cannot be in past')
		if getdate(self.posting_date)<getdate(today()):
			frappe.throw('Posting date cannot be in past')
		start_of_month = get_first_day(self.permission_from_date_and_time)
		end_of_month = get_last_day(self.permission_from_date_and_time)
		if self.workflow_state=='Approved':
			self.db_set('status','Approved')
		elif self.workflow_state=='Rejected':
			self.db_set('status','Rejected')
		else:
			self.db_set('status','Pending')
		if self.workflow_state=='Approved' and self.total_monthly_consumed_hours>2:
			self.db_set('deduction_required',1)


		if self.workflow_state=='Draft':
			if self.permission_from_date_and_time and self.permission_to_date_and_time:
				datetime_diff=time_diff_in_hours(self.permission_to_date_and_time,self.permission_from_date_and_time)
				if datetime_diff>2:
					frappe.throw('Permission granting hours cannot be greater than 2')
				else:
					self.db_set('permission_granted_hours',datetime_diff)
					self.db_set('total_monthly_consumed_hours',datetime_diff)


			if self.employee and self.permission_from_date_and_time:
				data = frappe.db.get_list(
					'Personal Permission Form',
					filters=[
								['employee', '=', self.employee],
								['permission_from_date_and_time', 'between', [start_of_month, end_of_month]],
								['name', '!=', self.name]
							],
							fields=['permission_granted_hours']
				)

				total = sum(d.get('permission_granted_hours', 0) for d in data)
				self.db_set('previously_consumed_hours', total)



			if self.previously_consumed_hours and self.permission_granted_hours:
				sumhr=self.previously_consumed_hours+self.permission_granted_hours
				if self.previously_consumed_hours:
					self.db_set('total_monthly_consumed_hours',sumhr)
				forms = frappe.db.get_list(
					'Personal Permission Form',
					filters={
						'employee': self.employee,
						'permission_from_date_and_time': ['between', [start_of_month, end_of_month]]
					},
					fields=['name']
				)
				for form in forms:
					frappe.db.set_value('Personal Permission Form', form.name, 'total_monthly_consumed_hours', sumhr)



