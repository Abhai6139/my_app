frappe.ui.form.on('Project',{
    refresh:function(frm){
        if(!frm.is_new()){
            frm.add_custom_button('Create Task',function(){
                frappe.db.get_doc('Opportunity',frm.doc.custom_opportunity).then(row=>{
                    row.items.forEach(data=>{
                        frappe.call({
                            method:'frappe.client.insert',
                            args: {
                                doc: {
                                    doctype: "Task",  
                                    subject: data.item_code,
                                    project:frm.doc.name
                                
                                }
                            },
                            callback: function(r) {
                                if (!r.exc) {
                                    
                                    frappe.msgprint(`Document Created: ${r.message.name}`);
                                }
                            }
                        })
                    })
                })
            })
            frm.add_custom_button('View Task Tree',function(){
                window.open(`/app/task/view/tree?project=${frm.doc.name}`,"_self")
            }).addClass("btn-primary");
        }
    }
})