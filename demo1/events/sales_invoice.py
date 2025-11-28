import frappe
from frappe.utils import add_days

@frappe.whitelist()
def get_parent(doctype,name):
    parent = frappe.get_all(
        doctype,
        filters=[['sales_order','=',name],['docstatus','in',[0,1]]],
        fields=['parent']
    )
    return parent

def validate(self,method=None):
    if self.posting_date:
        new_date=add_days(self.posting_date, 1)
        self.db_set('due_date',new_date)
    if self.items:
        for i in self.items:
            doc=frappe.get_doc('Item',i.item_code)
            i.item_name=doc.item_name
            i.uom=doc.stock_uom
    

        