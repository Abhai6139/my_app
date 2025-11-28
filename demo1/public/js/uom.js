frappe.ui.form.on('UOM',{
    refresh:function(frm){
        frm.trigger("set_autocompletions_for_final_score_formula");
    },
    set_autocompletions_for_final_score_formula: async (frm) => {
        const autocompletions = [];

        const doctypes = ["Mix Design", "SCRA","SCRA Details", "Mix Design Details"];

        await Promise.all(
            doctypes.map((doctype) =>
                new Promise((resolve) => {
                    frappe.model.with_doctype(doctype, () => {
                        // Assuming you have a helper like this or want to use all fields
                        const fields = frappe.meta.get_docfields(doctype)
                            .filter(df => df.fieldtype !== "Section Break" && df.fieldtype !== "Column Break")
                            .map(df => ({
                                value: df.fieldname,
                                score: 10,
                                meta: `${doctype}: ${df.label}`,
                            }));
                        
                        autocompletions.push(...fields);
                        resolve();
                    });
                })
            )
        );

        frm.set_df_property("custom_formula", "autocompletions", autocompletions);
        frm.set_df_property("custom_formula2", "autocompletions", autocompletions);
    },
})