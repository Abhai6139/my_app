// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("SCRA", {
	refresh(frm) {
        frm.set_query('material_type','scra_details',function(){
            return{
                filters:{
                    name:['in',['Item','Item Group']]
                }
            }
        })
        frm.fields_dict['scra_details'].grid.get_field('product').get_query = function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: {
                    item_group: row.materials
                }
            };
        };
        
        if (!frm.is_new()) {
            frm.add_custom_button('View Details', async function() {
                let html = `
                    <div style="max-height: 400px; overflow-y: auto;">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Material Type</th>
                                    <th>Materials</th>
                                    <th>Unit</th>
                                    <th>% Part</th>
                                    <th>Depletion</th>
                                    <th>% Wastage</th>
                                    <th>Unit Price</th>
                                    <th>Unit Rate</th>
                `;
                for (let th = 10; th <= 200; th += 5) {
                    html += `<th>${th}mm</th>`;
                }
                html += `</tr></thead><tbody>`;

                
                const detail_rows = frm.doc.scra_details || [];

                
                const uom_cache = {};

                for (const row of detail_rows) {
                    
                    html += `<tr>
                        <td>${row.material_type || ""}</td>
                        <td>${row.materials || ""}</td>
                        <td>${row.unit || ""}</td>
                        <td>${row.part || 0}</td>
                        <td>${row.depletion || 0}</td>
                        <td>${row.wastage || 0}</td>
                        <td>${row.unit_price || 0}</td>
                        <td>${row.unit_rate || 0}</td>
                    `;

                    let uom_doc = null;
                    if (row.unit) {
                        if (uom_cache[row.unit]) {
                            uom_doc = uom_cache[row.unit];
                        } else {
                            try {
                                uom_doc = await frappe.db.get_doc('UOM', row.unit);
                                uom_cache[row.unit] = uom_doc;
                            } catch (e) {
                                console.warn(`Failed to fetch UOM ${row.unit}:`, e);
                            }
                        }
                    }

                    if (uom_doc && uom_doc.custom_calculate_unit_ratem2_based_on_formula == 1) {
                        
                        let formulaFn = null;
                        try {
                            
                            formulaFn = new Function('thickness', 'unit_rate', `return ${uom_doc.custom_formula2};`);
                        } catch (e) {
                            
                            html += `<td colspan="${(200 - 10)/5 + 1}">Invalid formula: ${e.message}</td>`;
                            html += `</tr>`;
                            continue;
                        }

                        const unit_rate = parseFloat(row.unit_rate || 0);
                        for (let th = 10; th <= 200; th += 5) {
                            let rateVal = 0;
                            try {
                                rateVal = formulaFn(th, unit_rate);
                                if (typeof rateVal !== 'number' || isNaN(rateVal)) {
                                    rateVal = 0;
                                }
                            } catch (e) {
                                rateVal = 0;
                            }
                            const formattedVal = parseFloat(rateVal).toFixed(2);
                            html += `<td>${formattedVal}</td>`;
                        }
                    } else {
                        
                        for (let th = 10; th <= 200; th += 5) {
                            html += `<td>—</td>`;
                        }
                    }

                    html += `</tr>`;
                }

                html += `</tbody></table></div>`;

                const d = new frappe.ui.Dialog({
                    title: 'Mix Design Table',
                    fields: [
                        {
                            fieldtype: 'HTML',
                            fieldname: 'table',
                            options: html
                        }
                    ],
                    size: 'large'
                });
                d.show();
            });
        }
        if(frm.doc.docstatus==1){
            frm.add_custom_button('Quotation',function(){
                if (!frm.doc.mix_design) {
                    frappe.msgprint("mix_design is empty.")
                    
                }
                let exists = frappe.db.exists("Item", frm.doc.mix_design)
                if (!exists) {
                    frappe.msgprint(`Item "${frm.doc.mix_design}" does not exist.`)
                }
                frappe.call({
                    method: "demo1.newapp.doctype.scra.scra.create_prefilled_quotation",
                    args: {
                        mix_design: frm.doc.mix_design,
                        scope_of_work: frm.doc.scope_of_work,
                        scra: frm.doc.name
                    },
                    callback: function(r) {
                        if (r.message) {
                            frappe.model.sync(r.message);
                            frappe.set_route("Form", "Quotation", r.message.name);
                        }
                    }
                });
                // const quotation = frappe.model.get_new_doc("Quotation")
                // quotation.naming_series='SAL-QTN-.YYYY.-'
                // quotation.quotation_to='Customer'
                // quotation.order_type='Sales'
                // quotation.company='Craft'
                // quotation.transaction_date=frappe.datetime.get_today()
                // const row = frappe.model.add_child(quotation, "Quotation Item", "items")
                // row.item_code = frm.doc.mix_design
                // row.item_name=frm.doc.mix_design
                // row.uom='M^2'
                // row.qty = 1
                // row.custom_scope_of_work=frm.doc.scope_of_work
                // row.custom_scra = frm.doc.name
                // row.custom_mix_design = frm.doc.mix_design
                // frappe.set_route("Form", "Quotation", quotation.name)
                
            },'Create')
        }
       

   
	},
    mix_design:function(frm){
        if(frm.doc.mix_design){
            frappe.msgprint('hiiiii')
            frappe.db.get_doc('Mix Design',frm.doc.mix_design).then(data=>{
                frm.clear_table('scra_details')
                data.mix_design_details.forEach(row=>{
                    let addrow=frm.add_child('scra_details')
                    addrow.material_type=row.material_type
                    addrow.materials=row.materials
                    addrow.unit=row.unit
                    addrow.part=row._part
                    addrow.depletion=row.depletion
                    addrow.wastage=row._wastage
                    addrow.thickness=row.thickness
                    addrow.product=row.product
                    addrow.product_name=row.product_name
                    frm.refresh_field('scra_details')
                })
                
            })
        }
    }

});
frappe.ui.form.on("SCRA Details",{
    product:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.material_type=='Item Group'){
            frappe.db.get_doc('Item',row.product).then(data=>{
                frappe.model.set_value(cdt,cdn,'unit',data.stock_uom)
            })
        }
    },
    materials:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.material_type=='Item'){
            frappe.db.get_doc('Item',row.materials).then(data=>{
                frappe.model.set_value(cdt,cdn,'unit',data.stock_uom)
            })
        }
    },
    part:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if (row.depletion&&row.wastage&&row.unit_price){
            frappe.db.get_doc('UOM',row.unit).then(data=>{
                if(data.custom_calculate_rate_based_on_formula==1){
                    let part = row.part;
                    let depletion = row.depletion;
                    let wastage = row.wastage;
                    let unit_price = row.unit_price;
                    let total=eval(data.custom_formula)
                    frappe.model.set_value(cdt,cdn,'unit_rate',total)
                }
                if(row.thickness){
                    if(data.custom_calculate_unit_ratem2_based_on_formula==1){
                        let thickness=row.thickness
                        let unit_rate=row.unit_rate
                        let total2=eval(data.custom_formula2)
                        frappe.model.set_value(cdt,cdn,'rate',total2)
                    }
                }
            })
        }
    },
    depletion:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if (row.part&&row.wastage&&row.unit_price){
            frappe.db.get_doc('UOM',row.unit).then(data=>{
                if(data.custom_calculate_rate_based_on_formula==1){
                    let part = row.part;
                    let depletion = row.depletion;
                    let wastage = row.wastage;
                    let unit_price = row.unit_price;
                    let total=eval(data.custom_formula)
                    frappe.model.set_value(cdt,cdn,'unit_rate',total)
                }
                if(row.thickness){
                    if(data.custom_calculate_unit_ratem2_based_on_formula==1){
                        let thickness=row.thickness
                        let unit_rate=row.unit_rate
                        let total2=eval(data.custom_formula2)
                        frappe.model.set_value(cdt,cdn,'rate',total2)
                    }
                }
            })
        }
    },
    wastage:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if (row.depletion&&row.part&&row.unit_price){
            frappe.db.get_doc('UOM',row.unit).then(data=>{
                if(data.custom_calculate_rate_based_on_formula==1){
                    let part = row.part;
                    let depletion = row.depletion;
                    let wastage = row.wastage;
                    let unit_price = row.unit_price;
                    let total=eval(data.custom_formula)
                    frappe.model.set_value(cdt,cdn,'unit_rate',total)
                }
                if(row.thickness){
                    if(data.custom_calculate_unit_ratem2_based_on_formula==1){
                        let thickness=row.thickness
                        let unit_rate=row.unit_rate
                        let total2=eval(data.custom_formula2)
                        frappe.model.set_value(cdt,cdn,'rate',total2)
                    }
                }
            })
        }
    },
    unit_price:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if (row.depletion&&row.wastage&&row.part){
            frappe.db.get_doc('UOM',row.unit).then(data=>{
                if(data.custom_calculate_rate_based_on_formula==1){
                    let part = row.part;
                    let depletion = row.depletion;
                    let wastage = row.wastage;
                    let unit_price = row.unit_price;
                    let total=eval(data.custom_formula)
                    frappe.model.set_value(cdt,cdn,'unit_rate',total)
                }
                if(row.thickness){
                    if(data.custom_calculate_unit_ratem2_based_on_formula==1){
                        let thickness=row.thickness
                        let unit_rate=row.unit_rate
                        let total2=eval(data.custom_formula2)
                        frappe.model.set_value(cdt,cdn,'rate',total2)
                    }
                }
            })
        }
    },
    thickness:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if (row.depletion&&row.wastage&&row.part){
            frappe.db.get_doc('UOM',row.unit).then(data=>{
                if(data.custom_calculate_rate_based_on_formula==1){
                    let part = row.part;
                    let depletion = row.depletion;
                    let wastage = row.wastage;
                    let unit_price = row.unit_price;
                    let total=eval(data.custom_formula)
                    frappe.model.set_value(cdt,cdn,'unit_rate',total)
                }
                if(row.thickness){
                    if(data.custom_calculate_unit_ratem2_based_on_formula==1){
                        let thickness=row.thickness
                        let unit_rate=row.unit_rate
                        let total2=eval(data.custom_formula2)
                        frappe.model.set_value(cdt,cdn,'rate',total2)
                    }
                }
            })
        }
    }
    
})




frappe.ui.form.on("YourDocType", {
    refresh(frm) {
        frm.add_custom_button("Quotation", async () => {
            const mix_design_code = frm.doc.mix_design;
            if (!mix_design_code) {
                frappe.msgprint("mix_design (item code) is empty.");
                return;
            }

            // Ensure the item exists
            const exists = await frappe.db.exists("Item", mix_design_code);
            if (!exists) {
                frappe.msgprint(`Item "${mix_design_code}" does not exist.`);
                return;
            }

            try {
                // Create new Quotation document
                const quotation = frappe.model.get_new_doc("Quotation");
                // Prefill header fields as needed
                quotation.customer = frm.doc.customer || "";
                quotation.transaction_date = frappe.datetime.get_today();

                // Add item row
                const row = frappe.model.add_child(quotation, "Quotation Item", "items");
                row.item_code = mix_design_code;
                row.qty = 1;
                row.custom_scra = frm.doc.name;
                row.custom_mix_design = frm.doc.mix_design;

                // Insert (save) the quotation
                await quotation.insert(); // returns a promise

                // Navigate to the created quotation
                frappe.set_route("Form", "Quotation", quotation.name);
            } catch (e) {
                frappe.msgprint({
                    message: `Failed to create Quotation: ${e.message || e}`,
                    indicator: "red",
                });
            }
        });
    },
});
