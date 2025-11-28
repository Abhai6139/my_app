import frappe
from frappe import _, bold, msgprint
from frappe.utils import flt, cint, getdate, now, date_diff, today, formatdate, nowtime, format_datetime


@frappe.whitelist()
def get_sif_details(employee=None,pe=None,company=None):
    sl = frappe.db.get_list("Salary Slip",{'payroll_entry':pe,'docstatus':1},['employee','start_date','end_date','rounded_total'])
    data = []
    if sl:
        total = 0
        uniqueid_err = []
        agentid_err = []
        bankacc_err = []
        comp_err = []
        validation_messages = []
        for rec in sl:
            emp_doc = frappe.get_doc("Employee",rec.employee)
            if not emp_doc.labour_card_no:
                err = _("{0} {1}").format(rec.employee,emp_doc.employee_name)
                labourcardno_err.append(err)
            # if not emp_doc.agent_id:
            #     err = _("{0} {1}").format(rec.employee,emp_doc.employee_name)
            #     agentid_err.append(err)
            if not emp_doc.bank_ac_no:
                err = _("{0} {1}").format(rec.employee,emp_doc.employee_name)
                bankacc_err.append(err)
            row = ['EDR',emp_doc.labour_card_no,emp_doc.bank_ac_no,rec.start_date,rec.end_date,date_diff(rec.end_date,rec.start_date)+1,"{:.2f}".format(rec.rounded_total),"{:.2f}".format(0),0]
            total += rec.rounded_total
            data.append(row)

        # company = frappe.get_doc("Company",company)

        # if not company.bank_code:
        #     err = _("Employer bank code is missing for company {0}").format(frappe.bold(company))
        #     comp_err.append(err)

        if labourcardno_err:
            labourcardno_err.insert(0,"<b>Employee Labour Card No is missing for</b> \n")

        if agentid_err:
            agentid_err.insert(0,"<b>Employee Agent Id is missing for</b> \n")

        if bankacc_err:
            bankacc_err.insert(0,"<b>Employee Bank account no is missing for</b> \n")

        validation_messages += labourcardno_err + agentid_err + bankacc_err + comp_err

        if validation_messages:
            for msg in validation_messages:
                msgprint(msg)

            raise frappe.ValidationError(validation_messages)

        data.append(['SCR',formatdate(getdate(today()),"YYYY-MM-dd"),format_datetime(nowtime(),"hhmm"),formatdate(sl[0].end_date,"MMYYYY"),len(sl),"{:.2f}".format(total),'AED',' '])
        filename = formatdate(getdate(today()),"YYMMdd")+format_datetime(nowtime(),"hhmm")+"00"

    return data,filename
























