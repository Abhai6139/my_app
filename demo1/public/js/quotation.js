
frappe.ui.form.on('Quotation Item',{
    custom_thickness:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.custom_thickness){
            let rate=0
            frappe.db.get_doc('Thickness',row.custom_thickness).then(data=>{
                let thickness1=data.maximum_thickness
                if(thickness1){
                    frappe.db.get_doc('SCRA',row.custom_scra).then(data1=>{
                        data1.scra_details.forEach(eachrow=>{
                            let unit=eachrow.unit
                            frappe.db.get_doc('UOM',unit).then(data2=>{
                                if(data2.custom_calculate_unit_ratem2_based_on_formula==1&&data2.custom_formula2){
                                    let unit_rate=eachrow.unit_rate
                                    let thickness=thickness1
                                    let total2=eval(data2.custom_formula2)
                                    rate+=total2
                                    frappe.model.set_value(cdt,cdn,'custom_scra_rate',rate)
                                    frappe.model.set_value(cdt,cdn,'rate',rate)
                                }
                            })
                        })
                    })
                }
            })
        }
    },
    items_remove: function(frm) {
        let existing_items = (frm.doc.items || []).map(d => d.item_code);
        frm.doc.custom_labour_detail = (frm.doc.custom_labour_detail || []).filter(
            d => existing_items.includes(d.item)
        );

        frm.refresh_field("custom_labour_detail");
    }  
})





frappe.ui.form.on('Quotation', {
    refresh: function(frm) {
        frm.set_query('designation','custom_labour_detail',function(){
            return{
                filters:[
                    ['name','in',['Group Lead','Mason','Helper','Operator']]
                ]
            }
        })
        frm.fields_dict['custom_labour_detail'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
            return {
                filters: [
                    ['name', 'in', (frm.doc.items || []).map(row => row.item_code)]
                ]
            };
        };
        frm.fields_dict['custom_expense_details'].grid.get_field('quotation_item').get_query = function(doc, cdt, cdn) {
            return {
                filters: [
                    ['name', 'in', (frm.doc.items || []).map(row => row.item_code)]
                ]
            };
        };
        frm.add_custom_button('SCRA', function() {
            const msd = new frappe.ui.form.MultiSelectDialog({
                doctype: "SCRA",
                target: frm,
                add_filters_group: true,
                setters: {
                    mix_design:null,
                    scope_of_work:null
                },
                get_query: function() {
                    
                    let filters = {
                        docstatus: ['!=', 2] 
                    };
                    const existing_scras = (frm.doc.items || [])
                        .map(i => i.custom_scra)
                        .filter(Boolean);

                    if (existing_scras.length) {
                        filters.name = ['not in', existing_scras];
                    }

                    const mix_design = this.dialog.fields_dict.mix_design.get_value();
                    const scope_of_work = this.dialog.fields_dict.scope_of_work.get_value();

                    if (mix_design) {
                        filters.mix_design = ['like', `%${mix_design}%`]
                    }
                    if (scope_of_work) {
                        filters.scope_of_work = ['like', `%${scope_of_work}%`];
                    }

                    return { filters };
                },
                action: function(selections) {
                    if (!selections || !selections.length) {
                        frappe.msgprint('Please select SCRA records');
                        return;
                    }
                    console.log(selections)
                    selections.forEach(emp_id => {
                        frappe.db.get_doc('SCRA',emp_id).then(data=>{
                            let row = frm.add_child("items")
                            row.item_code = data.mix_design
                            row.item_name = data.mix_design
                            row.qty = 1
                            row.uom='M^2'
                            row.custom_scope_of_work=data.scope_of_work
                            row.custom_scra=emp_id
                            row.custom_mix_design=data.mix_design
                            frm.refresh_field("items")
                        })
                    })
                    msd.dialog.hide();
                }
            });
        }, 'Get Items From');
    }
});

frappe.ui.form.on('Labour Details',{
    item: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (row.item) {
            let default_row = (frm.doc.items || []).find(d => d.item_code === row.item);

            if (default_row) {
                frappe.model.set_value(cdt, cdn, 'thickness', default_row.custom_thickness);
                frappe.model.set_value(cdt, cdn, 'scope_of_work', default_row.custom_scope_of_work);
            }
    //         if(row.designation&&row.scope_of_work){
    //             frappe.db.get_list('Rate', {
    //                 filters: {
    //                     scope_of_work: row.scope_of_work 
    //                 },
    //                 fields: ['name']
    //             }).then(data=>{
    //                 if(data){
    //                     data.forEach(data1=>{
    //                         frappe.db.get_doc('Rate',data1.name).then(data2=>{
    //                             if(data2.details){
    //                                 data2.details.forEach(data3=>{
    //                                     if(data3.thickness==row.thickness&&data3.designation==row.designation){
    //                                         frappe.model.set_value(cdt,cdn,'labour_ratesqmt',data3.rate)
    //                                         frappe.model.set_value(cdt,cdn,'labour_rate',data3.rate*row.noof_labours)
    //                                     }
    //                                 })
    //                             }
    //                         })
    //                     })
    //                 }
    //             })
    //         }
    //     }
    // },
    // designation:function(frm,cdt,cdn){
    //     let row=locals[cdt][cdn]
    //     if(row.item&&row.scope_of_work){
    //         frappe.db.get_list('Rate', {
    //             filters: {
    //                 scope_of_work: row.scope_of_work  
    //             },
    //             fields: ['name']
    //         }).then(data=>{
    //             if(data){
    //                 data.forEach(data1=>{
    //                     frappe.db.get_doc('Rate',data1.name).then(data2=>{
    //                         if(data2.details){
    //                             data2.details.forEach(data3=>{
    //                                 if(data3.thickness==row.thickness&&data3.designation==row.designation){
    //                                     frappe.model.set_value(cdt,cdn,'labour_ratesqmt',data3.rate)
    //                                     if(row.noof_labours){
    //                                         frappe.model.set_value(cdt,cdn,'labour_rate',data3.rate*row.noof_labours)
    //                                     }
    //                                 }
    //                             })
    //                         }
    //                     })
    //                 })
    //             }
    //         })
        }
    },
    noof_labours:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.labour_ratesqmt){
            frappe.model.set_value(cdt,cdn,'labour_rate',row.labour_ratesqmt*row.noof_labours)
        }
    }
})

