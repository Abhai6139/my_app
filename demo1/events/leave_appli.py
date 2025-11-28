import frappe
from datetime import datetime
from frappe.utils import add_days, date_diff,getdate
import calendar
from datetime import datetime

# def before_submit(self, method=None):
#     self.status='Approved'
# def on_submit(self, method=None):
#     if self.custom_new_status=='Approved':
#         mail=frappe.db.get_value('Employee', self.employee,'personal_email' )
#         if mail:
#             frappe.sendmail(
#                 recipients = [mail],
#                 subject = 'Your Leave Request is Approved',
#                 message = f'''Your Leave application is verified and approved leave for {self.total_leave_days} days.''',
#                 now=True
#             )
#         else:
#             frappe.msgprint('Employee does not added email id')
#     if self.custom_new_status=='Regected':
#         mail=frappe.db.get_value('Employee', self.employee,'personal_email' )
#         if mail:
#             frappe.sendmail(
#                 recipients = [mail],
#                 subject = 'Your Leave Request is Rejected',
#                 message = f'''Your Leave application is Rejected for {self.total_leave_days} days.''',
#                 now=True
#             )
#         else:
#             frappe.msgprint('Employee does not added email id')












def on_submit(self, method=None):
    if self.leave_type == 'Annual Leave':
        doc = frappe.get_doc('Leave Type', self.leave_type)
        if doc.custom_deferred_leave == 1:
            exist = frappe.db.exists('Salary Component', {'custom_deferred_leave_payment': 1})
            if not exist:
                frappe.throw('There is no salary component with deferred leave payment check box checked')
            else:
                docname = frappe.db.get_value('Salary Component', {'custom_deferred_leave_payment': 1}, 'name')
                docs = frappe.get_list(
                    'Salary Structure Assignment',
                    filters=[
                        ['employee', '=', self.employee],
                        ['from_date', '<=', self.from_date]
                    ],
                    fields=['name', 'salary_structure', 'from_date'],
                    order_by='from_date desc',
                )
                if docs:
                    doc1 = frappe.get_doc('Salary Structure Assignment', docs[0].name)
                    ssa_sum = (
                        doc1.custom_basic +
                        doc1.custom_transport_allowance +
                        doc1.custom_hra +
                        doc1.custom_food_allowance +
                        doc1.custom_other_allowance
                    )
                    d1 = datetime.strptime(str(self.from_date), "%Y-%m-%d")
                    d2 = datetime.strptime(str(self.to_date), "%Y-%m-%d")

                    if d1.month == d2.month and d1.year == d2.year:
                        docs2 = frappe.get_list(
                            'Salary Structure Assignment',
                            filters=[
                                ['employee', '=', self.employee],
                                ['from_date', 'between', [self.from_date, self.to_date]]
                            ],
                            fields=['name']
                        )
                        if not docs2:
                            total1 = (ssa_sum * 12 / 365) * get_working_days(self.employee, self.from_date, self.to_date)
                            # frappe.msgprint(str(get_working_days(self.employee, self.from_date, self.to_date)))
                            create_additional_salary(self.employee, self.to_date, docname, total1, self.name)
                        else:
                            doc2 = frappe.get_doc('Salary Structure Assignment', docs2[0].name)
                            if doc2:
                                ssa_sum2 = (
                                    doc2.custom_basic +
                                    doc2.custom_transport_allowance +
                                    doc2.custom_hra +
                                    doc2.custom_food_allowance +
                                    doc2.custom_other_allowance
                                )
                                new_date = add_days(doc2.from_date, -1)
                                diff1 = get_working_days(self.employee, self.from_date, new_date)
                                diff2 = get_working_days(self.employee, doc2.from_date, self.to_date)
                                # frappe.msgprint(str(diff1))
                                # frappe.msgprint(str(diff2))
                                total = (ssa_sum * 12 / 365) * diff1
                                total2 = total + ((ssa_sum2 * 12 / 365) * diff2)
                                create_additional_salary(self.employee, self.to_date, docname, total2, self.name)

                    elif d2.month - d1.month == 1 and d1.year == d2.year:
                        date_obj = datetime.strptime(str(self.from_date), "%Y-%m-%d")
                        last_day = calendar.monthrange(date_obj.year, date_obj.month)[1]
                        last_date_of_month = date_obj.replace(day=last_day)
                        first_day = getdate(self.to_date).replace(day=1)
                        diff1 = get_working_days(self.employee, self.from_date, last_date_of_month)
                        diff2 = get_working_days(self.employee,first_day, self.to_date)
                        docs2 = frappe.get_list(
                            'Salary Structure Assignment',
                            filters=[
                                ['employee', '=', self.employee],
                                ['from_date', 'between', [self.from_date, self.to_date]]
                            ],
                            fields=['name']
                        )
                        if not docs2:
                            total1 = (ssa_sum * 12 / 365) * diff1
                            total2 = (ssa_sum * 12 / 365) * diff2
                            # frappe.msgprint(str(diff1))
                            # frappe.msgprint(str(diff2))
                            create_additional_salary(self.employee, last_date_of_month, docname, total1, self.name)
                            create_additional_salary(self.employee, self.to_date, docname, total2, self.name)
                        else:
                            doc2 = frappe.get_doc('Salary Structure Assignment', docs2[0].name)
                            if doc2:
                                ssa_sum2 = (
                                    doc2.custom_basic +
                                    doc2.custom_transport_allowance +
                                    doc2.custom_hra +
                                    doc2.custom_food_allowance +
                                    doc2.custom_other_allowance
                                )
                                start_dt = getdate(self.from_date)
                                ssa_dt = getdate(doc2.from_date)
                                lt_dt = getdate(last_date_of_month)
                                f_dt = getdate(first_day)
                                last_dt = getdate(self.to_date)
                                if start_dt <= ssa_dt <= lt_dt:
                                    diff3 = (get_working_days(self.employee, self.from_date, doc2.from_date))-1
                                    nxt_date = doc2.from_date
                                    diff4 = get_working_days(self.employee, nxt_date, last_date_of_month)
                                    diff5 = get_working_days(self.employee,first_day, self.to_date)
                                    total = (ssa_sum * 12 / 365) * diff3
                                    total2 = total + ((ssa_sum2 * 12 / 365) * diff4)
                                    total3 = (ssa_sum2 * 12 / 365) * diff5
                                    # frappe.msgprint(str(diff3))
                                    # frappe.msgprint(str(diff4))
                                    # frappe.msgprint(str(diff5))
                                    create_additional_salary(self.employee, last_date_of_month, docname, total2, self.name)
                                    create_additional_salary(self.employee, self.to_date, docname, total3, self.name)
                                elif f_dt <= ssa_dt <= last_dt:
                                    diff3 = get_working_days(self.employee, self.from_date, last_date_of_month)
                                    diff4 = (get_working_days(self.employee, first_day, doc2.from_date))-1
                                    nxt_date = doc2.from_date
                                    diff5 = get_working_days(self.employee, nxt_date, self.to_date)
                                    total = (ssa_sum * 12 / 365) * diff4
                                    total2 = total + ((ssa_sum2 * 12 / 365) * diff5)
                                    total3 = (ssa_sum * 12 / 365) * diff3
                                    # frappe.msgprint(str(diff3))
                                    # frappe.msgprint(str(diff4))
                                    # frappe.msgprint(str(diff5))
                                    create_additional_salary(self.employee, last_date_of_month, docname, total3, self.name)
                                    create_additional_salary(self.employee, self.to_date, docname, total2, self.name)
                                else:
                                    frappe.throw('Check from date and to date again')
                            else:
                                frappe.throw('No such salary structure Assignment')
                    else:
                        frappe.throw('check maximum number of allowed deferred leave')
                else:
                    frappe.throw(f'{self.employee} does not have any previous salary structure assignment')


def create_additional_salary(emp, date, comp, amt, name):
    newdoc = frappe.new_doc("Additional Salary")
    newdoc.employee = emp
    newdoc.payroll_date = date
    newdoc.salary_component = comp
    newdoc.amount = amt
    newdoc.is_recurring = 0
    newdoc.deduct_full_tax_on_selected_payroll_date = 0
    newdoc.overwrite_salary_structure_amount = 1
    newdoc.ref_doctype = 'Leave Application'
    newdoc.ref_docname = name
    newdoc.insert()
    newdoc.submit()
    frappe.msgprint('Additional salary created',alert=True)




def get_working_days(employee, start_date, end_date):
    holiday_list = frappe.db.get_value("Employee", employee, "holiday_list")
    holidays = []
    if holiday_list:
        holidays = frappe.get_all(
            "Holiday",
            filters={"parent": holiday_list, "holiday_date": ["between", [start_date, end_date]]},
            pluck="holiday_date"
        )

    working_days = 0
    current = getdate(start_date)
    while current <= getdate(end_date):
        if current not in holidays:
            working_days += 1
        current = add_days(current, 1)

    return working_days



























# def on_submit(self,method=None):
#     if self.leave_type=='Annual Leave':
#         doc=frappe.get_doc('Leave Type',self.leave_type)
#         if doc.custom_deferred_leave==1:
#             exist=frappe.db.exists('Salary Component',{'custom_deferred_leave_payment':1})
#             if not exist:
#                 frappe.throw('There is no salary component with deferred leave payment check box checked')
#             else:
#                 docname=frappe.db.get_value('Salary Component',{'custom_deferred_leave_payment':1},'name')
#                 docs=frappe.get_list('Salary Structure Assignment',
#                 filters=[
#                     ['employee','=',self.employee],
#                     ['from_date','<=',self.from_date]
#                 ],
#                 fields=['name', 'salary_structure', 'from_date'],
#                 order_by='from_date desc',)
#                 if docs:
#                     doc1=frappe.get_doc('Salary Structure Assignment',docs[0].name)
#                     ssa_sum=(doc1.custom_basic+
#                             doc1.custom_transport_allowance+doc1.custom_hra+
#                             doc1.custom_food_allowance+doc1.custom_other_allowance)
#                     d1 = datetime.strptime(str(self.from_date), "%Y-%m-%d")
#                     d2 = datetime.strptime(str(self.to_date), "%Y-%m-%d")

#                     if d1.month == d2.month and d1.year == d2.year:
#                         docs2=frappe.get_list('Salary Structure Assignment',
#                                 filters=[
#                                     ['employee','=',self.employee],
#                                     ['from_date','between',[self.from_date,self.to_date]]
#                                 ],
#                                 fields=['name'])
#                         if not docs2:
#                             total1=(ssa_sum*12/365)*self.total_leave_days
#                             create_additional_salary(self.employee,self.to_date,docname,total1, self.name)
                            
                            
#                         else:
#                             doc2=frappe.get_doc('Salary Structure Assignment',docs2[0].name)
#                             if doc2:
#                                 ssa_sum2=(
#                                         doc2.custom_basic+
#                                         doc2.custom_transport_allowance+
#                                         doc2.custom_hra+doc2.custom_food_allowance+doc2.custom_other_allowance)
                                        
#                                 new_date = add_days(doc2.from_date, -1)
#                                 diff1 = date_diff(new_date,self.from_date)
#                                 diff2 = date_diff( self.to_date,doc2.from_date)
#                                 total=(ssa_sum*12/365)*diff1
#                                 total2=total+((ssa_sum2*12/365)*diff2)
#                                 create_additional_salary(self.employee,self.to_date,docname,total2, self.name)
                                
                                
#                     elif d2.month-d1.month==1 and d1.year==d2.year:
#                         date_obj = datetime.strptime(str(self.from_date), "%Y-%m-%d")
#                         last_day = calendar.monthrange(date_obj.year, date_obj.month)[1]
#                         last_date_of_month = date_obj.replace(day=last_day)
#                         first_day = getdate(self.to_date).replace(day=1)
#                         diff1 = date_diff(last_date_of_month,self.from_date)
#                         diff2 = date_diff(self.to_date,first_day)
#                         docs2=frappe.get_list('Salary Structure Assignment',
#                                 filters=[
#                                     ['employee','=',self.employee],
#                                     ['from_date','between',[self.from_date,self.to_date]]
#                                 ],
#                                 fields=['name'])
#                         if not docs2:
#                             total1=(ssa_sum*12/365)*diff1
#                             total2=(ssa_sum*12/365)*diff2
#                             create_additional_salary(self.employee,last_date_of_month,docname,total1, self.name)
#                             create_additional_salary(self.employee,self.to_date,docname,total2, self.name)
                            
                            
#                         else:
#                             doc2=frappe.get_doc('Salary Structure Assignment',docs2[0].name)
#                             if doc2:
#                                 ssa_sum2=(
#                                         doc2.custom_basic+
#                                         doc2.custom_transport_allowance+
#                                         doc2.custom_hra+doc2.custom_food_allowance+doc2.custom_other_allowance)
#                                 start_dt=getdate(self.from_date)
#                                 ssa_dt=getdate(doc2.from_date)
#                                 lt_dt=getdate(last_date_of_month)
#                                 f_dt=getdate(first_day)
#                                 last_dt=getdate(self.to_date)
#                                 if start_dt<=ssa_dt<=lt_dt:
#                                     diff3=date_diff( doc2.from_date, self.from_date)
#                                     nxt_date=add_days(doc2.from_date, 1)
#                                     diff4=date_diff(last_date_of_month, nxt_date)
#                                     diff5=date_diff(self.to_date, first_day)
#                                     total=(ssa_sum*12/365)*diff3
#                                     total2=total+((ssa_sum2*12/365)*diff4)
#                                     total3=(ssa_sum2*12/365)*diff5
#                                     create_additional_salary(self.employee,last_date_of_month,docname,total2, self.name)
#                                     create_additional_salary(self.employee,self.to_date,docname,total3, self.name)
                                    
#                                 elif f_dt<=ssa_dt<=last_dt:
#                                     diff3=date_diff(last_date_of_month,self.from_date)
#                                     diff4=date_diff(doc2.from_date, first_day)
#                                     nxt_date=add_days(doc2.from_date, 1)
#                                     diff5=date_diff(self.to_date,nxt_date)
#                                     total=(ssa_sum*12/365)*diff4
#                                     total2=total+((ssa_sum2*12/365)*diff5)
#                                     total3=(ssa_sum*12/365)*diff3
#                                     create_additional_salary(self.employee,last_date_of_month,docname,total3, self.name)
#                                     create_additional_salary(self.employee,self.to_date,docname,total2, self.name)
                                    
                                    
#                                 else:
#                                     frappe.throw('Check from date and to date again')
#                             else:
#                                 frappe.throw('No such salary structure Assignment')
#                     else:
#                         frappe.throw('check maximum number of allowed deferred leave')
#                 else:
#                     frappe.throw(f'{self.employee} does not have any previous salary structure assignment')
        

# def create_additional_salary(emp, date, comp, amt, name):
#     newdoc = frappe.new_doc("Additional Salary")
#     newdoc.employee = emp
#     newdoc.payroll_date = date
#     newdoc.salary_component = comp
#     newdoc.amount = amt
#     newdoc.is_recurring = 0
#     newdoc.deduct_full_tax_on_selected_payroll_date = 0
#     newdoc.overwrite_salary_structure_amount = 1
#     newdoc.ref_doctype='Leave Application'
#     newdoc.ref_docname=name
#     newdoc.insert()
#     newdoc.submit()
                        

