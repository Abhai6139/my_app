from hrms.hr.doctype.job_requisition.job_requisition import JobRequisition
import frappe
from frappe import _

class CustomJobRequisition(JobRequisition):
    def validate_duplicates(self):
        duplicate = frappe.db.exists(
            "Job Requisition",
            {
                "designation": self.designation,
                "department": self.department,
                "requested_by": self.requested_by,
                "status": ("not in", ["Cancelled", "Filled"]),
                "name": ("!=", self.name),
            },
        )

        if duplicate:
            frappe.msgprint(
                _("A Job Requisition for {0} requested by {1} is created").format(
                    frappe.bold(self.designation),
                    frappe.bold(self.requested_by),
                ),
                # _("A Job Requisition for {0} requested by {1} already exists: {2}").format(
                #     frappe.bold(self.designation),
                #     frappe.bold(self.requested_by),
                #     get_link_to_form("Job Requisition", duplicate),
                # ),
            )
