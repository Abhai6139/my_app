# Copyright (c) 2025, NA and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import today, getdate
from frappe.model.document import Document


class LibraryTransaction(Document):
	pass		
	def validate(self):
		if not (self.transaction_type=='Issue' or 'Return'):
			frappe.throw('Transaction type must be Issue or Return')
		if self.transaction_type=='Issue':
			doc = frappe.get_doc('Library Book', self.book)
			if doc.status=='Issued':
				frappe.throw('Book is already issued')
			if self.due_date:
				if (self.due_date)<=(self.transaction_date):
					frappe.throw('Due date must be in future')
				pass

			else:
				frappe.throw('Due date is missing')

		if self.transaction_type=='Return':
			doc = frappe.get_doc('Library Book', self.book)
			if doc.status=='Available':
				frappe.throw('Book is already available, cannot return.')
			if not self.returned_date:
				frappe.throw('Returned date must set.')

		# if self.transaction_type == 'Issue':
		# 	result = frappe.db.sql("""
		# 		SELECT SUM(bonus_point)
		# 		FROM `tabLibrary Transaction`
		# 		WHERE transaction_type = 'Issue' 
		# 		AND member = %s
		# 		AND name != %s
		# 	""", (self.member,self.name))
		# 	print(result,11111111)
			
		# 	self.total_point = result[0][0] + self.bonus_point
			
	def before_save(self):
		if self.transaction_type =='Return':
			d=frappe.get_all('Library Fine',filters={
				'book':self.book,
				'member':self.member
			},limit=1)
			if d:
				doc2=frappe.get_doc('Library Fine', d[0].name)
				doc2.delete()
				frappe.msgprint('Doc deleted')
	def on_submit(self):
		if self.transaction_type=='Issue':
			frappe.db.set_value('Library Book', self.book, 'status','Issued')
			# frappe.msgprint("Book status changed")
		if self.transaction_type=='Return':
			# dell=frappe.get_doc('Library Transaction',{'book':self.book, 'member':self.member, 'transaction_type':'issue'})
			# dell.cancel()
			# frappe.msgprint("Transaction cancelled")
			# dell.delete()
			# frappe.msgprint("Transaction deleted")
			frappe.db.set_value('Library Transaction', {'book':self.book,'transaction_type':'Issue','returned':0 }, 'returned',True)
			frappe.db.set_value('Library Book', self.book, 'status','Available')
			# frappe.msgprint("Book status changed")
		doc1=frappe.db.get_value('Library Transaction',{'book':self.book,
		'member':self.member,
		'transaction_type':'issue'},'due_date')
		d1=getdate(doc1)
		d2=getdate(self.returned_date)
		diff=(d2-d1).days
		if diff > 0:
			fine=diff*2
			doc=frappe.new_doc('Library Fine')
			doc.member=self.member
			doc.book=self.book
			doc.fine_amount=fine
			doc.reference_transaction=self.name
			doc.date=self.transaction_date
			doc.insert()
			# frappe.msgprint(('{0} has {1} AED fine').format(self.member, fine))
			
	def onload(self):
		doc=frappe.get_all('Library Transaction',filters={'transaction_type':'issue'},
			fields=['book', 'member', 'due_date'])
		if doc:
			for i in doc:
				if getdate(i.due_date) < getdate(today()):
					dif=(getdate(today()) - getdate(i.due_date)).days
					fine=dif*5
					msg=f"₹{fine} fine is added for member {i.member}"
					frappe.db.set_value('Library Book', i.book, 'fine_details',msg)
					frappe.db.commit()
					
					
				else:
					frappe.db.set_value('Library Book', i.book, 'fine_details',' ')
					frappe.db.commit()
		else:
			frappe.db.set_value('Library Book', self.book, 'fine_details',' ')
			frappe.db.commit()

	












			# mail=frappe.db.get_value('Library Member', i.member,'email' )
			# if mail:
			# 	frappe.sendmail(
			# 		recipients = [mail],
			# 		subject = 'Library Alert',
			# 		message = f'''Your book is overdue. 
			# 						You have a pending fine of ₹{fine}. 
			# 						Please return the book as soon as possible.''',
			# 	)

