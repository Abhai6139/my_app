// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Duty Allocation", {
	refresh(frm) {
        frm.set_query('employee','allocation_table', function() {
            return {
                filters: {
                    name:['!=',frm.doc.employee]
                }
            };
        });
        frm.set_query('duty','allocation_table', function() {
            return {
                filters: {
                    project:frm.doc.project
                }
            };
        });

        frm.set_value('allocator',frappe.session.user )
        cur_frm.toggle_display('name1', frm.doc.employee)
        frm.toggle_display('experience', frm.doc.employee)
        frm.toggle_display('department', frm.doc.employee)
        frm.toggle_display('company', frm.doc.employee)
        frm.set_df_property('allocation_table','cannot_add_rows',true)
        frm.add_custom_button('Quick Entry', function(){
            const d=new frappe.ui.form.MultiSelectDialog({
                doctype: "Employee",
                target: frm,
                setters: {
                    status: 'Active'
                },
                add_filters_group: 1,
                get_query() {
                    return {
                        filters: {
                            docstatus: ['!=', 2],
                            name:['!=',frm.doc.employee]
                        }
                    }
                },
                action(selections) {
                    if (!selections || !selections.length){
                        frappe.msgprint('Please select Employees')
                    }
                    

                    frm.clear_table("allocation_table")
                    selections.forEach(emp_id => {
                        let row = frm.add_child("allocation_table")
                        row.employee = emp_id
                    })

                    frm.refresh_field("allocation_table")
                    frm.dirty();
                    d.dialog.hide();
                }
            })
        })
        frm.add_custom_button('Reload doc',function(){
            frm.reload_doc()
        })
        if(frm.doc.docstatus==1){
            frm.add_custom_button('Create Duty Log',function(){
                let d = new frappe.ui.Dialog({
                    title: 'Duty Log details',
                    fields: [
                        {
                            label: 'Employee',
                            fieldname: 'employee',
                            fieldtype: 'Link',
                            options: 'Employee',
                            default: frm.doc.employee,
                            read_only: 1
                        },
                        {
                            label: 'Employee Name',
                            fieldname: 'employee_name',
                            fieldtype: 'Data',
                            default:frm.doc.name1,
                            read_only: 1

                        },
                        {
                            label: 'From Date',
                            fieldname: 'from_date',
                            fieldtype: 'Date',
                            default: frm.doc.from_date,
                            read_only: 1
                        },
                        {
                            label: 'To Date',
                            fieldname: 'to_date',
                            fieldtype: 'Date',
                            default: frm.doc.to_date,
                            read_only: 1
                        }
                    ],
                    size: 'small', 
                    primary_action_label: 'Submit',
                    primary_action(values) {
                        frappe.confirm('Are you sure you want to proceed?',
                            () => {
                                frappe.new_doc('Duty Log',{
                                    employee:values.employee,
                                    employee_name:values.employee_name,
                                    from_date:values.from_date,
                                    to_date:values.to_date,
                                    reference:frm.doc.name
                                })
                                d.hide();

                            }, () => {
                                frappe.msgprint('Submission Cancelled')
                        })
                        
                        
                    }
                });

                d.show();
            })
        }

	},
   
    before_submit:function(frm){
        frappe.confirm('Are you sure you want to proceed?',
            () => {
                cur_frm.save('Submit');

            }, () => {
                
        })
        frappe.throw()
    },
    employee:function(frm){
        frm.toggle_display('name1', frm.doc.employee)
        frm.toggle_display('experience', frm.doc.employee)
        frm.toggle_display('department', frm.doc.employee)
        frm.toggle_display('company', frm.doc.employee)
        
    },
    on_submit:function(frm){

        frappe.call({
            method: "demo1.newapp.doctype.duty_allocation.duty_allocation.rename_with_series",
            args: {
                doctype: frm.doctype,
                old_name: frm.doc.name
            },
            callback: function(r) {
                frappe.msgprint('Docname changed')
                frappe.set_route("Form", frm.doctype, r.message);
            }
        });
    
        
    },
    
    
});
