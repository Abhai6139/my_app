// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("PPE Autorization", {
	refresh(frm) {
        frm.set_df_property('authorized_items','cannot_add_rows',true)
        frm.set_df_property('authorized_items','cannot_delete_rows',true)
	},
});
