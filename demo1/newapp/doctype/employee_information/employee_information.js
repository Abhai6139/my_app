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
    date_of_birth:function(frm){
        if(frm.doc.date_of_birth){
            let dob=frappe.datetime.str_to_obj(frm.doc.date_of_birth)
            let today=frappe.datetime.str_to_obj(frappe.datetime.get_today())
            let age= today.getFullYear() - dob.getFullYear()
            let m= today.getMonth() - dob.getMonth()
            if(m<0 || (m===0 && today.getDate()<dob.getDate())){
                age--;
            }
            frm.set_value('age',age)
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

// frappe.ui.form.on('Employee Information', {
//     get_details: function (frm) {
        

//         frappe.call({
//             method: "demo1.newapp.doctype.employee_information.employee_information.get_employees",
//             args: {
//                 company: frm.doc.company,
//                 department: frm.doc.department,
//                 branch: frm.doc.branch
//             },
//             callback: function (r) {
//                 if (r.message) {
//                     frm.clear_table("moredetail");
//                     r.message.forEach(function (emp, index) {
//                         let row = frm.add_child("moredetail");
//                         row.employee = emp.name;
//                         row.department = emp.department;
//                         row.branch = emp.branch;
                        
//                     });
//                     frm.refresh_field("moredetail");
//                 } else {
//                     frappe.msgprint('No matching employees found.');
//                 }
//             }
//         });
//     }
// });

frappe.ui.form.on('Employee Information', {
    get_details: function (frm) {
        
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Employee",
                fields: ["name", "department", "branch"],
                limit_page_length: 1000 
            },
            callback: function (r) {
                frm.clear_table("moredetail");

                let filtered = r.message.filter(emp =>
                    (frm.doc.department && emp.department === frm.doc.department) ||
                    (frm.doc.company && emp.company===frm.doc.company) ||
                    (frm.doc.branch && emp.branch === frm.doc.branch)
                );

                if (filtered.length > 0) {
                    filtered.forEach(emp => {
                        const row = frm.add_child("moredetail");
                        row.employee = emp.name;
                        row.department = emp.department;
                        row.branch = emp.branch;
                    });
                    frm.refresh_field("moredetail");
                } else {
                    frappe.msgprint(__('No matching employees found for Department or Branch.'));
                }
            }
        });
    }
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
                        
                        
                    },
                    callback:function(r) {
                        if(r.message){
                            frappe.msgprint( `${r.message.emp_name} is working as ${r.message.design}`,'Info')
                        }
                        
                    }
                })
            }
        })
    },
    refresh:function(frm) {
        if(frm.doc.employee){
            frm.set_value('genbar', frm.doc.employee)
        }
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


frappe.ui.form.on('Employee Information', {
    refresh(frm) {
        frm.set_query('employee', function(){
            return{
                filters:{
                    gender:'Male'
                }
            };
        });
    },
    add_detail:function (frm) {
        if(!frm.doc.add_detail){
            frm.clear_table('document_details')
            frm.refresh_field('document_details')
        }else{
            frappe.call({
                method:"demo1.newapp.doctype.employee_information.employee_information.get_child",
                args:{name:frm.doc.add_detail},
                callback:function(r){
                    if(r.message){
                        frm.clear_table('document_details')
                        r.message.forEach(function(row){
                            let child=frm.add_child('document_details')
                            child.document_no=row.document_no
                            child.document_name=row.document_name
                            child.issue_date=row.issue_date
                        })
                        frm.refresh_field('document_details')
                    }
                }
            })
        }
        
    },
    detail_add:function (frm,cdt,cdn){
        frappe.msgprint('hi')
        if (frm.doc.posting_date){
            frappe.msgprint(String(frm.doc.posting_date))
            frappe.model.set_value(cdt, cdn, 'start_date',frm.doc.posting_date)
        }
    },
    // onload:function(frm){
    //     frm.fields_dict.detail.grid.on('row_add', function(row){
    //         let r1=row.doc
    //         if (frm.doc.posting_date && !r1.start_date){
    //             r1.start_date = frm.doc.posting_date
    //             refresh_field('detail')
    //         }
    //     })
    // }
    detail_add: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (frm.doc.posting_date && !row.start_date) {
            row.start_date = frm.doc.posting_date;
            frm.refresh_field('detail');
        }
    }
});
frappe.ui.form.on('Document Details',{
    detail_add:function (frm,cdt,cdn){
        // frappe.msgprint('hi')
        if (frm.doc.posting_date){
            // frappe.msgprint(String(frm.doc.posting_date))
            frappe.model.set_value(cdt, cdn, 'start_date',frm.doc.posting_date)
        }
        frm.fields_dict['detail'].grid.get_field('task').get_query= function(doc, cdt, cdn){
            return{
                filters:{
                    status:'Working'
                }
            }
        }
    },
    
})
// frappe.ui.form.on('Itemz', {
//     detail_add: function(frm, cdt, cdn) {
//         frm.fields_dict['items'].grid.get_field('item_code').get_query = function(doc, cdt, cdn) {
//             return {
//                 filters: {
//                     item_group: 'Raw Material'
//                 }
//             };
//         };
//     }
// });
frappe.ui.form.on('Employee Information', {
    refresh:function(frm){
        frm.set_query('item_code', 'items',()=>{
            return{
                filters:{
                    item_group: 'Raw Material'
                }
            }
        })
    }
});


frappe.ui.form.on('Itemz',{
    item_code:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.item_code){
            frappe.model.get_value('Item',row.item_code,['item_name','valuation_rate'], function(values){
                if(values){
                    frappe.model.set_value(cdt,cdn,'item',values.item_name)
                    frappe.model.set_value(cdt,cdn, 'rate', values.valuation_rate)
                }
            })
        }
    },
    quantity:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.quantity&&row.rate){
            frappe.model.set_value(cdt,cdn,'amount', row.quantity*row.rate)
        }
    },
    rate:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.quantity&&row.rate){
            frappe.model.set_value(cdt,cdn,'amount', row.quantity*row.rate)
        }
    },
    amount:function(frm){
        let total=0
        frm.doc.items.forEach(function(row){
            total+=row.amount || 0
        })
        frm.set_value('total_amount',total)
    }
})

frappe.ui.form.on('Employee Information',{
    refresh:function(frm){
    
        frm.add_custom_button('Fetch from', function() {
            let d = new frappe.ui.Dialog({
                title: 'Item Details',
                fields: [
                    {
                        fieldname: 'item',
                        fieldtype: 'Table',
                        label: 'Item',
                        in_place_edit: true,
                        cannot_add_rows: false,
                        cannot_delete_rows: false,
                        fields: [
                            {
                                fieldname: 'item_code',
                                fieldtype: 'Link',
                                label: 'Item Code',
                                in_list_view: 1,
                                options:'Item',
                            },
                            {
                                fieldname: 'item',
                                fieldtype: 'Data',
                                label: 'Item',
                                in_list_view: 1
                            },
                            
                            {
                                fieldname: 'quantity',
                                fieldtype: 'Int',
                                label: 'Quantity',
                                in_list_view: 1
                            },
                            {
                                fieldname: 'rate',
                                fieldtype: 'Float',
                                label: 'Rate',
                                in_list_view: 1
                            },
                            {
                                fieldname: 'amount',
                                fieldtype: 'Float',
                                label: 'Amount',
                                in_list_view: 1
                            },
                        ]
                    }
                ],
                primary_action: (values) => {
                    
                    let table_data = values.item;
                    if(! table_data){
                        frappe.throw(('Add Details'));
                    }
 
 
                    frm.clear_table("items")
 
 
                    table_data.forEach(row=>{
                        let child=frm.add_child("items")
                        child.item_code=row.item_code
                        child.item=row.item,
                        child.quantity=row.quantity
                        child.rate=row.rate
                        child.amount=child.quantity*child.rate
                        
                    })
                    frm.refresh_field("items")
                    d.hide()
                 },
                primary_action_label: __("Submit"),
                });
            d.show();
            setTimeout(() => {
                const data = (frm.doc.items || []).map(row => ({
                    item_code: row.item_code,
                    item:row.item,
                    quantity:row.quantity,
                    rate:row.rate,
                    amount:row.amount
                    
                }));

                d.fields_dict.item.df.data = data;
                d.fields_dict.item.grid.refresh();
            }, 200);
        })
    },
})
frappe.ui.form.on('Employee Information',{
    add:function(frm){
        if(frm.doc.first_value && frm.doc.second_value){
            let total=frm.doc.first_value+frm.doc.second_value
            frm.set_value('third_value', total)
        }
    },
    sub:function(frm){
        if(frm.doc.first_value && frm.doc.second_value){
            let total=frm.doc.first_value-frm.doc.second_value
            frm.set_value('third_value', total)
        }
    },
    mul:function(frm){
        if(frm.doc.first_value && frm.doc.second_value){
            let total=frm.doc.first_value*frm.doc.second_value
            frm.set_value('third_value', total)
        }
    },
    div:function(frm){
        if(frm.doc.first_value && frm.doc.second_value){
            let total=frm.doc.first_value/frm.doc.second_value
            frm.set_value('third_value', total)
        }
    },
    
})


frappe.ui.form.on('Employee Information',{
    employee:function(frm){
        frm.add_custom_button('Help', function(){
            let d=new frappe.ui.Dialog({
                title:'Add Details',
                fields:[
                    {
                        fieldname:'gender',
                        fieldtype:'Data',
                        label:'Gender'
                    },
                    {
                        fieldname:'age',
                        fieldtype:'Int',
                        label:'Age'
                    },
                    {
                        fieldname:'data',
                        fieldtype:'Table',
                        label:'Education Details',
                        in_place_edit:1,
                        fields:[
                            {
                                fieldname:'qlificn',
                                fieldtype:'Data',
                                label:'Qualification',
                                in_list_view:1
                            },
                            {
                                fieldname:'year',
                                fieldtype:'Data',
                                label:'Year',
                                in_list_view:1
                            }
                        ]
                    }
                ],
                size:'small',
                primary_action_label:'Submit',
                primary_action(values){
                    if(values){
                        frm.set_value('gender', values.gender)
                        frm.set_value('age',values.age)
                    }
                    d.hide();
                }

            })
            d.show();
        })
        
    }

})



// before_workflow_action: function (frm) {
    //     if (frm.selected_workflow_action === 'Submit for Reviewer') {
            // frm.doc.quotation_items.forEach(row => {
            //     if (!row.task_description) {
            //         frappe.throw("Add task description in all items")
            //     }
            // })
            // if (!frm.doc.customer_name) frappe.throw("Add Customer")
            // if (!frm.doc.project_title) frappe.throw("Add Project Title")
            // if (!frm.doc.project_type) frappe.throw('Add project type')
            // if (frm.doc.total_amount === 0) frappe.throw("Total amount cannot be 0")

    //         // frappe.warn('Confirm Again',
    //         //     `<b>Project Title:</b> ${frm.doc.project_title} <br>
    //         //     <b>Project Type:</b> ${frm.doc.project_type || "N/A"} <br>
    //         //     <b>Total Quantity:</b> ${frm.doc.total_quantity || 0} <br>
    //         //     <b>Total Amount:</b> ₹${frm.doc.total_amount || 0}`, 
    //         // () => {
    //         //     frm.script_manager.trigger('proceed_workflow_action')
    //         // },'Confirm',true
    //         // )
    //         // frappe.throw()
    //     }
    // },