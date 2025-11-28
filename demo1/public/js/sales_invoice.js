


// frappe.ui.form.on('Sales Invoice Item', {
//     item_code: function(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];

//         if (row.item_code) {
//             frappe.call({
//                 method: 'frappe.client.get',
//                 args: {
//                     doctype: 'Item',
//                     name: row.item_code
//                 },
//                 callback: function(response) {
//                     const item = response.message;
//                     const allowed_uoms = (item.uoms || []).map(u => u.uom);
//                     frappe.msgprint(allowed_uoms.join(','))

//                     // Set custom query for the 'uom' field in the grid
//                     frm.fields_dict['items'].grid.get_field('uom').get_query = function(doc, cdt, cdn) {                        
//                             return {
//                                 filters: {
//                                     name: ['in', allowed_uoms]
//                                 }
//                             };
                        
//                         return {};
//                     };

//                     // Force refresh of dropdown so query is applied immediately
//                     frm.fields_dict.items.grid.refresh_field('uom');

                    
//                 }
//             });
//         }
//     }
// });



frappe.ui.form.on('Sales Invoice Item', {
    item_code: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (row.item_code) {
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Item',
                    name: row.item_code
                },
                callback: function(response) {
                    const item = response.message;
                    const allowed_uoms = (item.uoms || []).map(u => u.uom);

                    // Store allowed UOMs temporarily in row
                    row.__allowed_uoms = allowed_uoms;

                    // Trigger a refresh so the UOM field picks up new query
                    frm.fields_dict.items.grid.refresh();
                }
            });
        }
        frm.fields_dict['items'].grid.get_field('uom').get_query = function(doc, cdt, cdn) {
            const row = locals[cdt][cdn];
            return {
                filters: {
                    name: ["in", row.__allowed_uoms || []]
                }
            };
        };
    }
});