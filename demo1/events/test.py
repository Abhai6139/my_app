from frappe.utils import today,getdate


def rate_calc(doc, method):
    if not doc.items:
        return

    for i in doc.items:        
        if i.custom_thickness_for_pf:
            docs=frappe.db.get_list('SCRA Rate',
                        filters={
                            ['date','<',today()],
                            ['quotation','=',doc.name],
                            ['name','!=',doc1.name]
                        })
            if docs:
                for j in docs:
                    j.delete()
            start= i.custom_min_thickness_for_pf
            end=i.custom_max_thickness_for_pf

            doc1 = frappe.new_doc("SCRA Rate")
            doc1.thickness_range=i.custom_thickness_for_pf
            doc1.quotation = doc.name
            doc1.date=getdate(today())

            step = 10
            lower = start + 1  

            while lower <= end:
                upper = min(lower + step - 1, end)  
                max_thickness = upper
                calculated_rate = calculate_scra_rate(max_thickness, i.custom_scra)

                rate_value = flt(calculated_rate, 2) 

                if max_thickness <= 40:
                    doc1.append("rate", {
                        "thickness": lower,
                        "max_thickness": upper,
                        "bonded": rate_value
                    })
                else:
                    doc1.append("rate", {
                        "thickness": lower,
                        "max_thickness": upper,
                        "unbonded": rate_value
                    })

                lower = upper + 1 

            doc1.save()
            
            i.custom_rate_ref = doc1.name
