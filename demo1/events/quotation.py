import frappe
def before_validate(self, method=None):
    # if self.custom_sales_team:
    #     sum=0
    #     for i in self.custom_sales_team:
    #         sum+=i.allocated_percentage
    #         if i.allocated_percentage:
    #             data=(i.allocated_percentage*self.total)/100
    #             i.allocated_amount=data
    #     if sum>100:
    #         frappe.throw('Total allocated percentage for sales team should be 100')
    if self.custom_labour_detail:
        for i in self.custom_labour_detail:
            if i.item:
                for j in self.items:
                    if i.item==j.item_code:
                        i.thickness=j.custom_thickness
                        i.scope_of_work=j.custom_scope_of_work
                        if i.designation:
                            docs = frappe.db.get_list(
                                'Rate',
                                filters={'scope_of_work': j.custom_scope_of_work},
                                fields=['name']
                            )
                            if docs:
                                for doc in docs:
                                    data=frappe.get_doc('Rate',doc.name)
                                    for row in data.details:
                                        if i.noof_labours:
                                            if i.thickness==row.thickness and i.designation==row.designation:
                                                i.labour_ratesqmt=row.rate
                                                i.labour_rate=row.rate*i.noof_labours
    if self.items:
        total2=0
        for i in self.items:
            total=0
            total1=0
            if self.custom_labour_detail:
                for j in self.custom_labour_detail:
                    if i.item_code==j.item:
                        total+=j.labour_rate
            i.custom_total_labour_rate=total
            i.custom_total_labour_cost=total*i.qty
            if self.custom_expense_details:
                for j in self.custom_expense_details:
                    if i.item_code==j.quotation_item:
                        total1+=j.amount
            i.custom_total_expense_cost=total1
            
                
    if self.custom_markum_type=='Overall':
        total2=0
        for i in self.items:
            total2+=i.custom_total_labour_rate+i.custom_total_expense_cost+i.custom_scra_rate
        if self.custom_markup_>0:
            amount=total2*self.custom_markup_/100
            self.db_set('custom_markup_amount1',amount)
            for i in self.items:
                i.custom_markup_amount=amount
                i.rate=i.custom_scra_rate+i.custom_markup_amount+i.custom_total_labour_rate+i.custom_total_expense_cost
    elif self.custom_markum_type=='Item-wise':
        for i in self.items:
            total=i.custom_scra_rate+i.custom_total_labour_rate+i.custom_total_expense_cost
            i.custom_markup_amount=total*i.custom_markup_percent/100
            i.rate=total+i.custom_markup_amount
    else:
        for i in self.items:
            i.custom_markup_amount=0
            i.custom_markup_percent=0

    for i in self.items:
        rate=(i.custom_scra_rate or 0)+(i.custom_total_labour_rate or 0)+(i.custom_total_expense_cost or 0)+(i.custom_markup_amount or 0)
        i.rate=rate








































# @frappe.whitelist()
# def get_val(val1,val2):
#     v1=float(val1)
#     v2=float(val2)
#     value=(v1*v2)/100
#     return float(value)


@frappe.whitelist()
def change_val():
    doc=frappe.get_single('Selling Settings')
    if doc.selling_price_list=="Standard Selling":
        doc.selling_price_list=""
        doc.save()
    else:
        doc.selling_price_list="Standard Selling"
        doc.save()




# """
# {% if doc.duties %}
# <table class = "table table-bordered" style="page-break-inside: avoid;">
# <tr>
#     <th>
#         <b>Duties and Responsibilites</b>
#     </th>
# </tr>
# <tr>
#     <td style="page-break-inside: avoid;">
#         {{doc.duties}}
#     </td>
# </tr>
# </table>
# {% endif %}

# """

# """
# {% if doc.duties %}
# <table class = "table table-bordered" style="page-break-before: always;">
# <tr>
#     <th>
#         <b>Duties and Responsibilites</b>
#     </th>
# </tr>
# <tr>
#     <td>
#         {{doc.duties}}
#     </td>
# </tr>
# </table>
# {% endif %}



# {% if doc.qualification_experience %}
# <table class = "table table-bordered" style="page-break-before: always;">
#     <tr>
#         <th><b>Qualifications & Experience</b></th>
#     </tr>
#     <tr>
#         <td>{{doc.qualification_experience}}</td>
#     </tr>
# </table>
# {% endif %}





















# .print-format .table-borderless td{
#     border:none;
#     font-size:13px;
#     width:100%;
# }
# .print-format .table-bordered td, .print-format .table-bordered th {
#     border:1px solid black;
# }

# """

# """
# {% if doc.duties %}

# <table class = "table table-bordered  duties-table" style="page-break-before: always; width:100%;">
#     <tr>
#         <th>
#             <b>Duties and Responsibilities</b>
#         </th>
#     </tr>
#     <tr>
#         <td style="overflow:visible !important;">
#             {{ doc.duties | safe }}
#         </td>
#     </tr>
# </table>
# {% endif %}


#  id="footer-html"
# """