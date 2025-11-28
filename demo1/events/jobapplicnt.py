import frappe
def on_update(self,method=None):
    vacc1=frappe.db.get_value('Job Opening', self.job_title, 'planned_vacancies')
    vacc2=frappe.db.get_value('Job Opening', self.job_title, 'vacancies')
    if self.job_title:
        if self.status=='Accepted':
            current = frappe.db.count('Job Applicant', {'job_title':self.job_title,'status':'Accepted'})
            frappe.db.set_value('Job Opening', self.job_title, 'custom_no_of_applicants', current)
            if (vacc1!=0 and vacc1==current) or (vacc2!=0 and vacc2==current):
                frappe.db.set_value('Job Opening',self.job_title,'status','Closed')
            elif(vacc1!=0 and vacc1>=current) or (vacc2!=0 and vacc2>=current):
                frappe.db.set_value('Job Opening',self.job_title,'status','Open')
        else:
            current = frappe.db.count('Job Applicant', {'job_title':self.job_title,'status':'Accepted'})
            frappe.db.set_value('Job Opening', self.job_title, 'custom_no_of_applicants', current)
            if (vacc1!=0 and vacc1==current) or (vacc2!=0 and vacc2==current):
                    frappe.db.set_value('Job Opening',self.job_title,'status','Closed')
            elif(vacc1!=0 and vacc1>=current) or (vacc2!=0 and vacc2>=current):
                frappe.db.set_value('Job Opening',self.job_title,'status','Open')



def on_trash(self, method=None):
    if self.job_title:
        current = frappe.db.count('Job Applicant', {
            'job_title': self.job_title,
            'status': 'Accepted'
        })
        currnt=current-1
        frappe.db.set_value('Job Opening', self.job_title, 'custom_no_of_applicants', currnt)

        vacc1 = frappe.db.get_value('Job Opening', self.job_title, 'planned_vacancies') or 0
        vacc2 = frappe.db.get_value('Job Opening', self.job_title, 'vacancies') or 0

        if (vacc1!=0 and vacc1==currnt) or (vacc2!=0 and vacc2==currnt):
            frappe.db.set_value('Job Opening',self.job_title,'status','Closed')
        elif(vacc1!=0 and vacc1>=currnt) or (vacc2!=0 and vacc2>=currnt):
            frappe.db.set_value('Job Opening',self.job_title,'status','Open')








