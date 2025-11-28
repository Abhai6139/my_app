// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Box", {
	refresh(frm) {
        frm.set_query('shelf_or_trolley',function(){
            return{
                filters:{
                    name:['in', ['Shelf','Trolley']]
                }
            }
        })
	},
});
