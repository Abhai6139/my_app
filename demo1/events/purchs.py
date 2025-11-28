import frappe

def before_save(self, method=None):
    if self.project:
        budget = frappe.db.get_value('Project', self.project, 'custom_budget') or 0
        docs = frappe.db.get_all(
            'Purchase Order',
            filters={
                'project': self.project,
                'status': ['not in', ['Cancelled','Draft']]
            },
            fields=['total']
        )
        amount=0
        for doc in docs:
            if doc.get('total'):
                amount+=doc['total']
        # amount = sum(doc['total'] for doc in docs if doc.get('total'))
        newbudget = budget - amount
        if self.total > newbudget:
            frappe.throw(f'Total amount cannot be greater than remaining project budget. Remaining Budget: {newbudget}')



































# import frappe
# def before_save(self,method=None):
#     if self.project:
#         budget=frappe.db.get_value('Project',self.project,'custom_budget')
#         docs=frappe.db.get_all('Purchase Order',
#                 filters={
#                     'project':self.project,
#                     'status':['!=','Cancelled']
#                 },
#                 fields=['total']
#             )
#         amount = sum(doc['total'] for doc in docs if doc.get('total'))
        
#         newbudget=budget-amount
#         frappe.msgprint(str(newbudget))
#         if self.total>newbudget:
#             frappe.throw('Total amount cannot be greater than project budget')
        
# def on_cancel(self,method=None):
#     budget=frappe.db.get_value('Project',self.project,'custom_budget')
#     new_budget=budget+self.total
#     frappe.db.set_value('Project',self.project,'custom_budget',new_budget)
