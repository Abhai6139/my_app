import frappe

def  validate(doc,method=None):
    if doc.company:
        country= frappe.db.get_value('Company',doc.company, 'country' )
        doc.custom_country = country
