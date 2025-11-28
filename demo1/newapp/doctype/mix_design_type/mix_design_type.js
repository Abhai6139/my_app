// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Mix Design Type", {
	validate:function(frm){
        if(frm.doc.mix_design_type){
            frappe.db.exists('Item',frm.doc.mix_design_type).then(exist=>{
                if(!exist){
                    frappe.call({
                        method:'frappe.client.insert',
                        args:{
                            doc:{
                                doctype:'Item',
                                item_code:frm.doc.mix_design_type,
                                item_name:frm.doc.mix_design_type,
                                item_group:'Service',
                                stock_uom:'M^2',
                                is_stock_item:0
                            }
                        },
                        callback:function(r){
                            if(r.message){
                                frappe.show_alert('Item created', 5)
                            }
                        }
                    })
                }
                else{
                    frappe.throw('Item already exist')
                }
            })
        }
    }
});
