frappe.ui.form.on('Opportunity',{
    refresh:function(frm){
        if(!frm.is_new()){
            frm.add_custom_button('Project',function(){
                let newdoc=frappe.model.get_new_doc('Project')
                newdoc.customer=frm.doc.party_name
                newdoc.custom_opportunity=frm.doc.name
                frappe.set_route('Form','Project',newdoc.name)
            },'Create')
        }
        
    }
})