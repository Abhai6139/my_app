// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Job Estimation", {
	refresh:function(frm){
        if (!frm.doc.quotation_created && !frm.is_new())  { 
            frm.add_custom_button('Create Quotation', function(){
                frappe.call({
                    method:'frappe.client.insert',
                    args:{
                        doc:{
                            doctype:'Quotation',
                            party_name:frm.doc.customer,
                            items:frm.doc.estimation_details.map(row=>({
                                item_code:row.item,
                                qty:row.qty,
                                rate:row.rate,
                                amount:row.amount

                            }))
                        }
                    },
                    callback:function(r){
                        if(r.message){
                            frappe.set_route('Form','Quotation',r.message.name)
                            frappe.model.set_value(frm.doctype, frm.docname, 'quotation_created', 1);
                        }
                    }
                })
            })
        }
        

        
     
        // if(frm.doc.workflow_state=='Draft'){
        //     frm.set_value('status','Draft')
        // }
        // if(frm.doc.workflow_state=='Submitted'){
        //     frm.set_value('status','Submitted')
        // }
        // if(frm.doc.workflow_state=='Approved'){
        //     frm.set_value('status','Approved')
        // }
        frm.set_query('item', 'estimation_details', function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: {
                    item_group: row.item_group
                }
            };
        });

    }
   
});
frappe.ui.form.on('Estimation Details',{
    rate:function(frm,cdt,cdn){
        let doc=locals[cdt][cdn]
        if(doc.rate&&doc.qty){
            frappe.model.set_value(cdt,cdn,'amount',doc.qty*doc.rate)
        }
    },
    qty:function(frm,cdt,cdn){
        let doc1=locals[cdt][cdn]
        if(doc1.qty&&doc1.rate){
            frappe.model.set_value(cdt,cdn,'amount',doc1.rate*doc1.qty)
        }
    },
    amount:function(frm,cdt,cdn){
        update_det(frm)
    },
    item_group:function(frm,cdt,cdn){
        update_det(frm)
    },
    item:function(frm,cdt,cdn){
        update_det(frm)
    },
    estimation_details_remove: function(frm) {
        update_det(frm);
    }
})

function update_det(frm){
    let total1=0
    let total2=0
    let total3=0
    frm.doc.estimation_details.forEach(function(row){
        if(!row.item_group){
            frappe.msgprint('please select item group')
        }
        if(row.item_group=='Material'){
            total1+=row.amount
        }
        if(row.item_group=='Labour'){
            total2+=row.amount
        }
        if(row.item_group=='Service'){
            total3+=row.amount
        }
    })
    frm.set_value('total_material_cost',total1)
    frm.set_value('total_labour_cost',total2)
    frm.set_value('total_service_cost',total3)
    frm.set_value('total_cost',total1+total2+total3)
}


























// frm.add_custom_button('Create Quotation',function(){
        //     let datas=[]
        //     frm.doc.estimation_details.forEach(function(r){
        //         datas.push({
        //             item_code:r.item,
        //             qty:r.qty,
        //             rate:r.rate,
        //             amount:r.amount
        //         })
        //     })
        //     frappe.new_doc('Quotation', {
        //         party_name:frm.doc.customer,
        //         items:datas
        //     })
        // })
        // frm.add_custom_button('Create Quotation',function(){
        //     frappe.model.with_doctype('Quotation',function(){
        //         let newdoc=frappe.model.get_new_doc('Quotation')
        //         newdoc.party_name=frm.doc.customer
        //         frm.doc.estimation_details.forEach(function(row){
        //             let data=frappe.model.add_child(newdoc,'items')
        //             data.item_code=row.item,
        //             data.qty=row.qty,
        //             data.rate=row.rate,
        //             data.amount=row.amount
        //         })
        //         frappe.set_route('Form','Quotation',newdoc.name)
        //     })
        // })




        // frappe.ui.form.on("Job Quotation", {
//     before_workflow_action: function (frm) {
//         if (frm.selected_workflow_action === 'Submit for Reviewer') {

//             if (!frm.doc.customer_name) frappe.throw("Add Customer");
//             if (!frm.doc.project_title) frappe.throw("Add Project Title");
//             if (frm.doc.total_amount === 0) frappe.throw("Total amount cannot be 0");

//             let hasEmpty = frm.doc.quotation_items.some(row => !row.task_description);
//             if (hasEmpty) {
//                 frappe.throw("All items must have task description.");
//             }


//             let dialog = new frappe.ui.Dialog({
//                 title: 'Confirm Project Submission',
//                 fields: [
//                     { fieldtype: 'HTML', fieldname: 'preview' }
//                 ],
//                 primary_action_label: 'Confirm',
//                 primary_action() {
//                     dialog.hide();

//                     frappe.workflow.submit(frm); 
//                 },
//                 secondary_action_label: 'Back',
//                 secondary_action() {
//                     dialog.hide();
//                     frappe.msgprint("Submission cancelled.");
//                 }
//             });

//             dialog.fields_dict.preview.$wrapper.html(`
//                 <p><b>Project Title:</b> ${frm.doc.project_title}</p>
//                 <p><b>Project Type:</b> ${frm.doc.project_type || "N/A"}</p>
//                 <p><b>Total Quantity:</b> ${frm.doc.total_quantity || 0}</p>
//                 <p><b>Total Amount:</b> ₹${frm.doc.total_amount || 0}</p>
//             `);
//             dialog.show();

//             return false;
//         }
//     }
// });



























