
frappe.ui.form.on('Sales Order', {
    // onload: function(frm) {
    //     frappe.call({
    //         method: "demo1.events.sales_invoice.get_parent",
    //         args: {
    //             doctype: "Sales Invoice Item",
    //             name:frm.doc.name,
    //         },
    //         callback: async function(r) {
    //             let data = r.message;
    //             if (!data || data.length === 0) {
    //                 frm.fields_dict.custom_sales_invoice_details.$wrapper.html("<p>No invoice is created against this sales order.</p>");
    //                 return;
    //             }
    //             console.log(r.message)

    //             let html = `
    //                 <table class="table table-bordered">
    //                     <thead>
    //                         <tr>
    //                             <th>Sales Invoice</th>
    //                             <th>Invoice Date</th>
    //                             <th>Amount</th>
    //                             <th>Status</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //             `;
    //             let seen = new Set(); 
    //             for (let row of data) {
    //                 if (seen.has(row.parent)) {
    //                     continue; 
    //                 }
    //                 seen.add(row.parent);
    //                 const invoice = await frappe.db.get_doc('Sales Invoice', row.parent);
    //                 html += `
    //                         <tr>
    //                             <td>${row.parent || ""}</td>
    //                             <td>${frappe.format(invoice.posting_date, {fieldtype: "Date"})}</td>
    //                             <td>${invoice.rounded_total || ""}</td>
    //                             <td>${invoice.status || ""}</td>
                                
    //                         </tr>
    //                     `;
    //             }                  
                

    //             html += `</tbody></table>`;

    //             frm.fields_dict.custom_sales_invoice_details.$wrapper.html(html);
    //         }
    //     });
    // }
    on_submit:function(frm){
        if(!frm.doc.project){
            frappe.call({
                method:'frappe.client.submit',
                args:{
                    doc:{
                        doctype:'Project',
                        project_name:frm.doc.custom_project_reference,
                        customer:frm.doc.customer,
                        sales_order:frm.doc.name
                    }
                },
                callback:function(r){
                    if(r.message){
                        frappe.show_alert('New project is created', 5);
                    }
                    else{
                        frappe.throw('Project cannot create')
                    }
                }
            })
            
        }
    },
    // refresh: function(frm) {
    //     if (frm.doc.docstatus === 1) {                
    //                 frm.add_custom_button('BOQ', async function() {
    //                     const items = [];

                        
    //                     for (const row of frm.doc.items || []) {
    //                         let thickness_value = row.custom_thickness;

    //                         if (row.custom_thickness) {
    //                             try {
    //                                 const thickness_doc = await frappe.db.get_doc('Thickness', row.custom_thickness);
    //                                 thickness_value = thickness_doc.maximum_thickness;
    //                             } catch (err) {
    //                                 return;
    //                             }
    //                         }

    //                         items.push({
    //                             item_code: row.item_code,
    //                             item_name: row.item_name,
    //                             qty: row.qty,
    //                             uom: row.uom,
    //                             thickness: thickness_value,
    //                             scra: row.custom_scra,
    //                             mix_design: row.custom_mix_design,
    //                             rate: row.rate,
    //                             amount: row.amount
    //                         });
    //                     }

                    
    //                     const mixDesignNames = [...new Set(items.map(row => row.mix_design).filter(Boolean))];

    //                     const boq_details = [];

                        
    //                     for (const name of mixDesignNames) {
    //                         try {
    //                             const data = await frappe.db.get_doc('Mix Design', name);
    //                             data.mix_design_details.forEach(detail => {
    //                                 const related_item = items.find(i => i.mix_design === name);
    //                                 boq_details.push({
    //                                     material_type: detail.material_type,
    //                                     materials: detail.materials,
    //                                     _part: detail._part,
    //                                     depletion: detail.depletion,
    //                                     unit: detail.unit,
    //                                     _wastage: detail._wastage,
    //                                     thickness: related_item ? related_item.thickness : null,
    //                                     product: detail.product,
    //                                     product_name: detail.product_name,
    //                                     mix_design: name
    //                                 });
    //                             });
    //                         } catch (err) {
    //                             return;
    //                         }
    //                     }

                        
    //                     frappe.call({
    //                         method:'frappe.client.insert', 
    //                         args:{
    //                             doc: {
    //                                 doctype: 'MixDesign BOQ',
    //                                 customer: frm.doc.customer,
    //                                 customer_name: frm.doc.customer_name,
    //                                 sales_order: frm.doc.name,
    //                                 items: items,
    //                                 boq_details: boq_details
    //                             }
    //                         },
    //                         callback:function(r){
    //                             if (r.message) {
    //                                 frappe.set_route('Form', 'MixDesign BOQ', r.message.name);
    //                             }
    //                         }
    //                     })

    //                 }, 'Create');
    //     }
    // }



    refresh: function(frm) {
        if (frm.doc.docstatus === 1) {                
            frm.add_custom_button('BOQ', async function() {
                const items = [];
                const boq_details = [];

                const mixDesignNames = new Set();

                for (const row of frm.doc.items || []) {
                    let thickness_value = row.custom_thickness;
                    let maximum_thickness_value = null;

                    if (row.custom_thickness) {
                        try {
                            const thickness_doc = await frappe.db.get_doc('Thickness', row.custom_thickness);
                            thickness_value = row.custom_thickness;  // Store as-is in item table
                            maximum_thickness_value = thickness_doc.maximum_thickness; // For boq_details
                        } catch (err) {
                            frappe.msgprint(`Error fetching thickness: ${row.custom_thickness}`);
                            return;
                        }
                    }

                    items.push({
                        item_code: row.item_code,
                        item_name: row.item_name,
                        qty: row.qty,
                        uom: row.uom,
                        thickness: thickness_value, // Save original custom_thickness (Link) in item table
                        scra: row.custom_scra,
                        mix_design: row.custom_mix_design,
                        rate: row.rate,
                        amount: row.amount
                    });

                    if (row.custom_mix_design) {
                        mixDesignNames.add(row.custom_mix_design);
                    }

                    // Build BOQ detail for each material under mix design
                    if (row.custom_mix_design) {
                        try {
                            const mix_doc = await frappe.db.get_doc('Mix Design', row.custom_mix_design);

                            mix_doc.mix_design_details.forEach(detail => {
                                boq_details.push({
                                    material_type: detail.material_type,
                                    materials: detail.materials,
                                    _part: detail._part,
                                    depletion: detail.depletion,
                                    unit: detail.unit,
                                    _wastage: detail._wastage,
                                    thickness: maximum_thickness_value, // Use max thickness from Thickness Doc
                                    product: detail.product,
                                    product_name: detail.product_name,
                                    mix_design: row.custom_mix_design
                                });
                            });
                        } catch (err) {
                            frappe.msgprint(`Failed to fetch Mix Design: ${row.custom_mix_design}`);
                            return;
                        }
                    }
                }

                // Insert the BOQ document
                frappe.call({
                    method: 'frappe.client.insert', 
                    args: {
                        doc: {
                            doctype: 'MixDesign BOQ',
                            customer: frm.doc.customer,
                            customer_name: frm.doc.customer_name,
                            sales_order: frm.doc.name,
                            items: items,
                            boq_details: boq_details
                        }
                    },
                    callback: function(r) {
                        if (r.message) {
                            frappe.set_route('Form', 'MixDesign BOQ', r.message.name);
                        }
                    }
                });

            }, 'Create');
        }
    }

});



