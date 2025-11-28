// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Rate", {
	refresh(frm) {
        frm.set_query('designation','details',function(){
            return{
                filters:[
                    ['name','in',['Group Lead','Mason','Helper','Operator']]
                ]
            }
        })
	},
});
