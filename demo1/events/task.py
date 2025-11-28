# import frappe


# def test(doc,method=None):
#     doc=frappe.get_all('Library Transaction',filters={'transaction_type':'issue'},
# 		fields=['book', 'member', 'due_date'])
#     if doc:
#         for i in doc:
#             if getdate(i.due_date) < getdate(today()):
# 				dif=(getdate(today()) - getdate(i.due_date)).days
# 				fine=dif*5
#             mail=frappe.db.get_value('Library Member', i.member,'email' )
#             if mail:
#                 frappe.sendmail(
#                     recipients = mail,
#                     subject = 'Library Alert',
#                     message = f'''Your book is overdue. 
#                                     You have a pending fine of ₹{fine}. 
#                                     Please return the book as soon as possible.''',
#                     now = True
#                 )