// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Employee Information", {
    // employee:function(frm) {
    //     if(frm.doc.employee) {
    //         frappe.db.get_value('Employee',frm.doc.employee,'employee_name' ,(r) => {
    //             frm.set_value('employee_name',r.employee_name)
    //         })
    //         frappe.db.get_value('Employee', frm.doc.employee, 'date_of_birth' ,(r)=>{
    //             frm.set_value('date_of_birth', r.date_of_birth)
    //         })
    //     }
    // },
    first_hour:function(frm) {
            frm.set_value('third_hour', frm.doc.first_hour + frm.doc.second_hour)
    },
    second_hour:function(frm) {
            frm.set_value('third_hour',frm.doc.first_hour + frm.doc.second_hour)
    },

    employee:function(frm) {
        if (frm.doc.employee){
            frappe.call({
                method : 'frappe.client.get',
                args :{
                    
                        doctype:'Employee',
                        name:frm.doc.employee
            
                },
                callback:function(r){
                    if (r.message){
                        frm.set_value('employee_name',r.message.employee_name)
                        frm.set_value('date_of_birth', r.message.date_of_birth)
                        frm.set_value('designation', r.message.designation)
                    }
                }
            })
        }
    },

    // employee:function(frm){
    //     if(frm.doc.employee){
    //         frappe.db.get_doc('Employee', frm.doc.employee) 
    //         .then(r=>{
    //             frm.set_value('employee_name',r.employee_name)
    //             frm.set_value('date_of_birth', r.date_of_birth)
    //             frm.set_value('designation', r.designation)

    //         })
            
    //     }
    // },
    designation:function(frm){
        if(frm.doc.designation=='Software Developer'){
            frm.set_value('status','completed')
        }
    },

    // after_save:function(frm){
    //     frm.doc.details.forEach(r=> {
    //         let newr = frm.add_child('document_details1');
    //         newr.task = r.task;
    //         newr.task_name = r.task_name
    //         newr.start_date = r.start_date
    //         newr.end_date=r.end_date
    //         newr.status=r.status
    //     })
    // },
    fetch_details:function(frm){
        frm.clear_table('document_details1');
        frm.doc.details.forEach(r=> {
            let newr = frm.add_child('document_details1');
            newr.task = r.task;
            newr.task_name = r.task_name
            newr.start_date = r.start_date
            newr.end_date=r.end_date
            newr.status=r.status
        })
        frm.refresh_field('document_details1')
    },
});


frappe.ui.form.on('Employee Information',{
    refresh: function(frm){
        frappe.call({
            method: "demo1.newapp.doctype.employee_information.employee_information.testfrappe",
            callback:function(r){
                if (r.message){
                    // frappe.msgprint(r.message);
                    console.log('testing',r.message)
                }
            }
        })
    }
});

frappe.ui.form.on("Employee Information", {
    refresh:function(frm) {
        frm.add_custom_button('Map Document Details', function() {
            const dialog = new frappe.ui.Dialog({
                title: ("Add Documents"),
                fields: [
                    {
                        fieldname: "doc_details",
                        fieldtype: "Table",
                        label: ("Doc Details"),
                        in_place_edit: true,
                        cannot_add_rows: false,
                        reqd: 1,
                        fields: [
                            {
                                fieldname: "document_no",
                                label: __("Document No"),
                                fieldtype: "Int",
                                in_list_view: 1,
                                reqd: 1,
                            },
                            {
                                fieldname: "document_name",
                                label: __("Document Name"),
                                fieldtype: "Data",
                                in_list_view: 1,
                                reqd: 1,
                            },
                            {
                                fieldname: "issue_date",
                                label: __("Issue Date"),
                                fieldtype: "Date",
                                in_list_view: 1,
                                reqd: 1,
                            }
                        ],
                    },
                ],
                primary_action: (values) => { 
                    let table_data = values.doc_details;
                    if(! table_data){
                        frappe.throw(('Add Details'));
                    }

                    frm.clear_table("document_details")

                    table_data.forEach(row=>{
                        let child=frm.add_child("document_details")
                        child.document_no=row.document_no
                        child.document_name=row.document_name
                        child.issue_date=row.issue_date
                    })
                    frm.refresh_field("document_details")
                    dialog.hide()
                 },
                primary_action_label: __("Submit"),
              
              

            });dialog.show()
        },'Action'),
        // frm.add_custom_button(__('Create Doc'), function() {
        //     const dialog = new frappe.ui.Dialog({
        //                 title: __("Add Documents"),
        //                 fields: [
        //                     {
        //                         fieldname: "doc_detail",
        //                         fieldtype: "Table",
        //                         label: __("Doc Detail"),
        //                         in_place_edit: true,
        //                         cannot_add_rows: false,
        //                         reqd: 1,
        //                         fields: [
        //                             {
        //                                 fieldname: "document_no",
        //                                 label: __("Document No"),
        //                                 fieldtype: "Int",
        //                                 in_list_view: 1,
        //                                 reqd: 1,
        //                             },
        //                             {
        //                                 fieldname: "document_name",
        //                                 label: __("Document Name"),
        //                                 fieldtype: "Data",
        //                                 in_list_view: 1,
        //                                 reqd: 1,
        //                             },
        //                             {
        //                                 fieldname: "issue_date",
        //                                 label: __("Issue Date"),
        //                                 fieldtype: "Date",
        //                                 in_list_view: 1,
        //                                 reqd: 1,
        //                             }
        //                         ],
        //                         get_data:()=>{
        //                             return dialog.fields_dict.doc_detail.grid.get_data();
        //                         }
        //                     },
        //                 ],

        //                 primary_action_label: __("Close"),


        //                primary_action: (values) => { 
        //                 dialog.hide()
        //                 },
                       

        //             }
        //         )
        //         dialog.show();

        //         let current_docs = frm.doc.document_details || [];
        //         current_docs.forEach(doc => {
        //         dialog.fields_dict.doc_detail.df.data.push({
        //               document_no: doc.document_no,
        //               document_name: doc.document_name,
        //               issue_date:doc.issue_date
        //             });
        //         }),
        //         dialog.fields_dict.doc_detail.grid.refresh();

    
        frm.add_custom_button('Create Doc', function() {
            let d = new frappe.ui.Dialog({
                title: 'Mapped Details',
                fields: [
                    {
                        fieldname: 'details2',
                        fieldtype: 'Table',
                        label: 'Details2',
                        in_place_edit: true,
                        cannot_add_rows: false,
                        cannot_delete_rows: false,
                        fields: [
                            {
                                fieldname: 'document_no',
                                fieldtype: 'Data',
                                label: 'Document No',
                                in_list_view: 1
                            },
                            {
                                fieldname: 'document_name',
                                fieldtype: 'Data',
                                label: 'Document Name',
                                in_list_view: 1
                            },
                            {
                                fieldname: 'issue_date',
                                fieldtype: 'Date',
                                label: 'Issue Date',
                                in_list_view: 1
                            }
                        ]
                    }
                ],
                primary_action_label: 'Submit',
    primary_action(values) {
        let rows = values.details2 || [];
        rows.forEach(row => {
            frappe.call({
                method: "frappe.client.submit",
                args: {
                    doc: {
                        doctype: "Doc Details",  
                        document_no: row.document_no,
                        document_name: row.document_name,
                        issue_date: row.issue_date,
                     
                    }
                },
                callback: function(r) {
                    if (!r.exc) {
                        
                        frappe.msgprint(`Document Created: ${r.message.name}`);
                    }
                }
            });
        });

        d.hide();
    }
});
        d.show();
        setTimeout(() => {
                const data = (frm.doc.document_details || []).map(row => ({
                    document_name: row.document_name,
                    document_no: row.document_no,
                    issue_date: row.issue_date
                }));

                d.fields_dict.details2.df.data = data;
                d.fields_dict.details2.grid.refresh();
            }, 200);
        
    

            
            }, __("Action"));


    }
})

frappe.ui.form.on('Employee Information', {
    refresh:function(frm) {
        frm.add_custom_button('Info', function() {
            if(frm.doc.employee){
                frappe.call({
                    method:"demo1.newapp.doctype.employee_information.employee_information.view_info",
                    args:{
                        name:frm.doc.employee,
                        emp_name:frm.doc.employee,
                        design:frm.doc.employee
                        
                    },
                    callback:function(r) {
                        if(r.message){
                            frappe.msgprint( `${r.message.emp_name} is working as ${r.message.design}`,'Info')
                        }
                        
                    }
                })
            }
        })
    }
})
 
frappe.ui.form.on('Employee Information', {
    refresh:function(frm) {
        frm.add_custom_button('Create', function(){
            if(frm.doc.employee){
                frappe.call({
                    method:"demo1.newapp.doctype.employee_information.employee_information.view_doc",
                    args :{
                        name:frm.doc.employee,
                        emp_name:frm.doc.employee,
                        design:frm.doc.employee,
                        employee:frm.doc.employee
                    },
                    callback:function(r){
                        if(r.message){
                            frappe.new_doc('Doc Details', {
                                employee: r.message.employee,
                                employee_name: r.message.emp_name,
                                designation: r.message.design
                            });
                        }
                    }
                })
                
            }
        })
    }
})

// frm.add_custom_button(__('Create Doc'), function() {
//     const dialog = new frappe.ui.Dialog({
//         title: __("Add Documents"),
//         fields: [
//             {
//                 fieldname: "doc_detail",
//                 fieldtype: "Table",
//                 label: __("Doc Detail"),
//                 in_place_edit: true,
//                 cannot_add_rows: false,
//                 reqd: 1,
//                 fields: [
//                     {
//                         fieldname: "document_no",
//                         label: __("Document No"),
//                         fieldtype: "Int",
//                         in_list_view: 1,
//                         reqd: 1,
//                     },
//                     {
//                         fieldname: "document_name",
//                         label: __("Document Name"),
//                         fieldtype: "Data",
//                         in_list_view: 1,
//                         reqd: 1,
//                     },
//                     {
//                         fieldname: "issue_date",
//                         label: __("Issue Date"),
//                         fieldtype: "Date",
//                         in_list_view: 1,
//                         reqd: 1,
//                     }
//                 ],
//             },
//         ],
        
//         primary_action_label:'submit',
//         primary_action: (values) => {
//             },
//         })

//             let current_docs = frm.doc.document_details || [];
//            current_docs.forEach(doc => {
//              dialog.fields_dict.doc_detail.df.data.push({
//                 document_no: doc.document_no,
//                 document_name: doc.document_name,
//                 issue_date:doc.issue_date
//                });
//             }),
//             dialog.fields_dict.doc_detail.grid.refresh();
//             dialog.show
            
//     })
    




    // if (!rows.length) {
    //     frappe.throw("Please add at least one row.");
    // }
    // rows.forEach(row => {
    //     frappe.new_doc('Doc Details', {
    //         document_no: row.document_no,
    //         document_name: row.document_name,
    //         issue_date: row.issue_date
    //     });
    // });
    // frappe.msgprint('Document Created');