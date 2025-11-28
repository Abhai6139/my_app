# Copyright (c) 2025, NA and Contributors
# See license.txt

# import frappe
from frappe.tests.utils import FrappeTestCase


class TestLibraryTransaction(FrappeTestCase):
	pass


def test():
	doc=frappe.get_all('Library Transaction',filters={
		'transaction_type':'Issue', 'returned':0},
		fields=['book', 'member', 'due_date'])
	if doc:
		for i in doc:
			if getdate(i.due_date) < getdate(today()):
				dif=(getdate(today()) - getdate(i.due_date)).days
				fine=dif*5
			frappe.db.set_value('Library Transaction', {
				'book':i.book,'transaction_type':'Issue','returned':0 
				}, 'fine',fine)
			mail=frappe.db.get_value('Library Member', i.member,'email' )
			if mail:
				frappe.sendmail(
					recipients = [mail],
					subject = 'Library Alert',
					message=(
							f"Dear {i.member},<br><br>"
							f"You have a fine of ₹{fine} for not returning the book <b>{i.book}</b> on time.<br>"
							f"Please return it as soon as possible.<br><br>"
							f"Thank you,<br>Library"
						),
				)
