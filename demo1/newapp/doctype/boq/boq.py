# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class BOQ(Document):
	pass


# @frappe.whitelist()
# def get_detail(itemcode):
# 	itemss=[]
# 	item2=[]
# 	item_grp=frappe.db.get_value('Item',itemcode,'item_group')
# 	count=frappe.db.count('Item Group')
# 	for i in range(count):
# 		if item_grp:
# 			item_grp_list=frappe.get_all('Item Group',{'parent_item_group':item_grp})
# 			if item_grp_list:
# 				for group in item_grp_list:
# 					item_grp=group
# 			else:
# 				itemss.append(item_grp)
	
# 	for i in itemss:
# 		itemm=frappe.get_doc('Item',i,{'is_stock_item':1})
# 		if itemm:
# 			item2.append(itemm)
# 	return item2

@frappe.whitelist()
def get_detail(itemcode):
	from frappe.utils.nestedset import get_descendants_of

	item_group = frappe.db.get_value('Item', itemcode, 'item_group')
	if item_group:
		all_groups = get_descendants_of('Item Group', item_group)
		# frappe.msgprint(f"{all_groups}")
		if all_groups:
			all_groups+=[item_group] 
		else:
			all_groups=[item_group] 

		items = frappe.get_all('Item',
			filters={
				'item_group': ['in', all_groups],
				'is_stock_item': 1,
			},
		)
	return items