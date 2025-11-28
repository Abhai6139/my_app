// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("PPE Request", {
	refresh(frm) {
        frm.set_query('item_code','ppe_items',function(){
            return{
                filters:{
                    is_stock_item:1,
                    item_group:'PPE'
                }
            }
        })
	},
    // before_workflow_action:function(frm){
    //     if(frm.selected_workflow_action=='Submit for Approval'){
    before_workflow_action:function(frm){
        if(frm.selected_workflow_action=='Approve'){
            frappe.call({
                        method:'frappe.client.insert',
                        args:{
                            doc:{
                                doctype:'PPE Autorization',
                                employee:frm.doc.employee,
                                employee_name:frm.doc.employee_name,
                                company:frm.doc.company,
                                ppe_request_date:frm.doc.ppe_request_date,
                                ppe_request_reference:frm.doc.name,
                                authorized_items:frm.doc.ppe_items.map(row=>({
                                    item_code:row.item_code,
                                    item_name:row.item_name,
                                    uom:row.uom,
                                    requested_qty:row.qty,
                                    qty: "0",
                                    status: "Approved",
                                    issued_item_damaged:row.issued_item_damaged,


                                }))
                            }
                        },
                        callback:function(r){
                            if(r.message){
                                frappe.msgprint('Authorization Form created')
                            }
                        }
            })
        }
    }
});

