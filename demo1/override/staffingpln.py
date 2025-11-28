from hrms.hr.doctype.staffing_plan.staffing_plan import StaffingPlan
import frappe
from frappe import _
class Staffingplan(StaffingPlan):
    @frappe.whitelist()
    def set_job_requisitions(self, job_reqs):
        if job_reqs:
            requisitions = frappe.db.get_list(
                "Job Requisition",
                filters={"name": ["in", job_reqs]},
                fields=["designation","name", "no_of_positions", "expected_compensation"],
            )

            self.staffing_details = []
            for req in requisitions:
                self.append(
                    "staffing_details",
                    {
                        "designation": req.designation,
                        "custom_requisition_id":req.name,
                        "vacancies": req.no_of_positions,
                        "estimated_cost_per_position": req.expected_compensation,
                    },
                )

        return self