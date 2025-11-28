frappe.ui.form.on('Additional Salary', {
    salary_component: function(frm) {
        if (frm.doc.salary_component === "Leave Reimbursement" && frm.doc.payroll_date) {
            if (frm.doc.employee) {
                frappe.db.get_list('Additional Salary', {
                    filters: [
                        ['employee', '=', frm.doc.employee],
                        ['salary_component', '=', 'LWP Deduction'],
                        ['type', '=', 'Deduction'],
                        ['payroll_date','<=',frm.doc.payroll_date],
                        ['custom_deferred_leave_reimbursed', '=', 0]
                    ],
                    fields: ['amount']
                }).then(data => {
                    let total = 0
                    data.forEach(row => {
                        total += row.amount || 0
                    })
                    frm.set_value('amount', total)
                    frm.refresh_field('amount')
                    console.log(total)
                })
            }else{
                frappe.msgprint('Add Employee')
            }
        }
    },
    payroll_date:function(frm){
        if (frm.doc.salary_component === "Leave Reimbursement" && frm.doc.payroll_date) {
            if (frm.doc.employee) {
                frappe.db.get_list('Additional Salary', {
                    filters: [
                        ['employee', '=', frm.doc.employee],
                        ['salary_component', '=', 'LWP Deduction'],
                        ['type', '=', 'Deduction'],
                        ['payroll_date','<=',frm.doc.payroll_date],
                        ['custom_deferred_leave_reimbursed', '=', 0]
                    ],
                    fields: ['amount']
                }).then(data => {
                    let total = 0
                    data.forEach(row => {
                        total += row.amount || 0
                    })
                    frm.set_value('amount', total)
                })
            }else{
                frappe.msgprint('Add Employee')
            }
        }
    },
    employee:function(frm){
        if (frm.doc.salary_component === "Leave Reimbursement" && frm.doc.payroll_date) {
            if (frm.doc.employee) {
                frappe.db.get_list('Additional Salary', {
                    filters: [
                        ['employee', '=', frm.doc.employee],
                        ['salary_component', '=', 'LWP Deduction'],
                        ['type', '=', 'Deduction'],
                        ['payroll_date','<=',frm.doc.payroll_date],
                        ['custom_deferred_leave_reimbursed', '=', 0]
                    ],
                    fields: ['amount']
                }).then(data => {
                    let total = 0
                    data.forEach(row => {
                        total += row.amount || 0
                    })
                    frm.set_value('amount', total)
                })
            }else{
                frappe.msgprint('Add Employee')
            }
        }
    },
    validate:function(frm){
        if (frm.doc.salary_component === "Leave Reimbursement" && frm.doc.payroll_date) {
            if (frm.doc.employee) {
                frappe.db.get_list('Additional Salary', {
                    filters: [
                        ['employee', '=', frm.doc.employee],
                        ['salary_component', '=', 'LWP Deduction'],
                        ['type', '=', 'Deduction'],
                        ['payroll_date','<=',frm.doc.payroll_date],
                        ['custom_deferred_leave_reimbursed', '=', 0]
                    ],
                    fields: ['amount']
                }).then(data => {
                    let total = 0
                    data.forEach(row => {
                        total += row.amount || 0
                    })
                    frm.set_value('amount', total)
                    console.log(total)
                })
            }else{
                frappe.msgprint('Add Employee')
            }
        }
    },
    on_submit:function(frm){
        frappe.db.get_list('Additional Salary', {
            filters: [
                ['employee', '=', frm.doc.employee],
                ['salary_component', '=', 'LWP Deduction'],
                ['type', '=', 'Deduction'],
                ['payroll_date','<=',frm.doc.payroll_date],
                ['custom_deferred_leave_reimbursed', '=', 0]
            ],
            fields: ['name']
        }).then(data => {
            let total = 0
            data.forEach(row => {
                frappe.db.set_value('Additional Salary',row.name,'custom_deferred_leave_reimbursed',1)
            })
        })
    }
})
