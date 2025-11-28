# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import today, getdate
from frappe.model.document import Document


class JobEstimation(Document):
	pass
	def validate(self):
		if getdate(self.estimation_date)<getdate(today()):
			frappe.throw('Estimation date cannot be in past')
	# def validate(self):
	# 	if self.estimation_details:
	# 		total=0
	# 		total1=0
	# 		total2=0
	# 		for i in self.estimation_details:
	# 			if i.item_group=='Material':
	# 				total=total+i.amount
	# 				self.total_material_cost=total
	# 			elif i.item_group=='Service':
	# 				total1+=i.amount
	# 				self.total_service_cost=total1
	# 			elif i.item_group=='Labour':
	# 				total2+=i.amount
	# 				self.total_labour_cost=total2
	# 			self.total_cost=self.total_labour_cost+self.total_service_cost+self.total_material_cost		

