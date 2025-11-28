frappe.ui.form.on('Leave Application',{
    before_workflow_action:function(frm){
        if(frm.selected_workflow_action=='Approve'){
            frappe.msgprint('hi')
            frm.set_value('status','Approved')
            frm.save()
        }
        if(frm.selected_workflow_action=='Reject'){
            frm.set_value('status','Rejected')
            frm.save()
        }
    }
})