// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Vehicle ID", {
	is_guest:function(frm){
        if(frm.doc.is_guest==1){
            frm.set_value('customer','Guest')
        }else{
            frm.set_value('customer',"")
        }
    }
});
