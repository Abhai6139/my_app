// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Party", {
	employee:function(frm) {
        if(frm.doc.employee){
            frappe.db.get_doc('Employee', frm.doc.employee).then(function(r){
                frappe.model.set_value('department', r.department),
                frappe.model.set_value('employee_name',r.employee_name),
                frappe.model.set_value('designation',r.designation)
            })
            // frappe.call({
            //     method:"frappe.client.get",
            //     args:{
            //         doctype:'Employee',
            //         name:frm.doc.employee
            //     },
            //     callback:function(r){
            //         if (r.message){
            //             frm.set_value('employee_name',r.message.employee_name)
            //             frm.set_value('department',r.message.department)
            //             frm.set_value('designation',r.message.designation)
            //         }
            //     }
            // })
        }
	},
    refresh:function(frm) {
        frm.set_query('employee',function(){
            return{
                filters:{
                    employment_type:'Full-Time'
                }
            }
        })
        if(!frm.doc.__islocal){
            frm.add_custom_button('Go To Attendence', function() {
                frappe.set_route('List', 'Attendance',{'employee_name':frm.doc.employee_name})
            })
        }
    }

});
