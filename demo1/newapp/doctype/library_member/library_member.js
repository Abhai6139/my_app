// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Library Member", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on('Library Member', {
    before_workflow_action: function (frm) {
        if (frm.selected_workflow_action === "Approve") {
            if (frm.__prompted_once) return;
            frm.__prompted_once = true;

            frappe.validated = false;

            const dialog = new frappe.ui.Dialog({
                title: 'Add Approval Comments',
                fields: [
                    {
                        label: 'Approval Comments',
                        fieldname: 'comments',
                        fieldtype: 'Small Text',
                        reqd: 1
                    }
                ],
                primary_action_label: 'Submit',
                primary_action(values) {
                    if (!values.comments) {
                        frappe.msgprint('Comments are required.');
                        return;
                    }

                    dialog.hide();

                    frm.set_value('comments', values.comments).then(() => {
                        setTimeout(() => {
                            frappe.validated = true;
                            frm.save('Submit');
                        }, 200);
                    });
                },
                // Prevent closing on backdrop click or escape
                size: 'small',
                static: true
            });

            dialog.show();
        }
    }
});





