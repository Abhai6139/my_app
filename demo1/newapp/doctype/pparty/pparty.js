// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("PParty", {
    refresh:function(frm){
        frm.set_query('employee',function(){
            return{
                filters:{
                    employment_type:'Full-Time'
                }
            }
        })
        if(!frm.doc.__islocal){
            frm.add_custom_button('Go To Attendence', ()=>{
                frappe.set_route('List', 'Attendance',{'employee_name':frm.doc.employee_name})
            })
        }
        
        if(frm.doc.employee){
            frappe.db.get_doc('Employee', frm.doc.employee).then(function(r){
                frm.set_value('department', r.department),
                frm.set_value('employee_name',r.employee_name),
                frm.set_value('designation',r.designation)
            })
        }
    },
    // retired_on:function(frm){
    //     if(frm.doc.retired_on<frm.doc.posting_date){
    //         frm.set_value('retired_on', null)
    //         frappe.throw('Retiring Date must be in future.')
    //     }
    // },
    employee:function(frm){
        if(frm.doc.employee){
            frappe.db.get_doc('Employee', frm.doc.employee).then(function(r){
                frm.set_value('department', r.department),
                frm.set_value('employee_name',r.employee_name),
                frm.set_value('designation',r.designation)
            })
        }
    }
    
});


