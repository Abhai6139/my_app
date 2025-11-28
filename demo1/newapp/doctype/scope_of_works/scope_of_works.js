// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Scope Of Works", {
	refresh(frm) {
        frm.set_query('material_type','material_details',function(){
            return{
                filters:{
                    name:['in',['Item','Item Group']]
                }
            }
        })
	},
});
