// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Mix Design", {
	refresh(frm) {
        frm.set_query('material_type','mix_design_details',function(){
            return{
                filters:{
                    name:['in',['Item','Item Group']]
                }
            }
        })
        frm.fields_dict['mix_design_details'].grid.get_field('product').get_query = function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: {
                    item_group: row.materials
                }
            }
        }
        if(!frm.is_new()){
            frm.add_custom_button('View Details',function(){
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
                                    `;

                                    for (let thickness = 10; thickness <= 200; thickness += 5) {
                                        html += `<th>${thickness}mm</th>`;
                                    }

                                    html += `
                                                    </tr>
                                                </thead>
                                                <tbody>
                                    `;

                    frm.doc.mix_design_details.forEach(row => {
                        html += `<tr>
                            <td>${row.material_type || ""}</td>
                            <td>${row.materials || ""}</td>
                            <td>${row.unit || ""}</td>
                            <td>${row._part || ""}</td>
                            <td>${row.depletion || ""}</td>
                            <td>${row._wastage || ""}</td>
                        `;

                        for (let thickness = 10; thickness <= 200; thickness += 5) {
                            const depletion = parseFloat(row.depletion || 0);
                            const part = parseFloat(row._part || 0);
                            const wastage = parseFloat(row._wastage || 0);

                            const val = ((depletion * part * (1 + (wastage / 100))) / 1000) * thickness * 0.01;
                            const formattedVal = val.toFixed(3);

                            html += `<td>${formattedVal}</td>`;
                        }

                        html += `</tr>`;
                    });


                    html += `
                                </tbody>
                            </table>
                        </div>
                    `;
                
                // frm.fields_dict.custom_html_preview.$wrapper.html(html)
                let d=new frappe.ui.Dialog({
                    title: 'Mix Design Table',
                    fields:[
                        {
                            fieldtype:'HTML',
                            fieldname:'table',
                            options:html
                        }
                    ],
                    size:'large'

                    
                })
                d.show()
            })
            frm.add_custom_button("SCRA",function(){
                frappe.call({
                    method:"frappe.client.insert",
                    args:{
                        doc:{
                            doctype:'SCRA',
                            mix_design:frm.doc.name,
                            scra_details:frm.doc.mix_design_details.map(row=>({
                                material_type:row.material_type,
                                materials:row.materials,
                                unit:row.unit,
                                part:row._part,
                                depletion:row.depletion,
                                wastage:row._wastage,
                                thickness:row.thickness,
                                product:row.product,
                                product_name:row.product_name
                            }))
                        }
                    },
                    callback:function(r){
                        if(r.message){
                            frappe.set_route('Form','SCRA',r.message.name)
                        }
                    }
                })
            })
        }
        
	},
    scope_of_works:function(frm){
        if(frm.doc.scope_of_works){
            frappe.db.get_doc('Scope Of Works',frm.doc.scope_of_works).then(data=>{
                frm.clear_table('mix_design_details')
                data.material_details.forEach(row1=>{
                    let add_row=frm.add_child('mix_design_details')
                    add_row.material_type=row1.material_type
                    add_row.materials=row1.material
                    if(row1.material_type=='Item'){
                        frappe.db.get_doc('Item',row1.material).then(data1=>{
                            add_row.unit=data1.stock_uom
                            frm.refresh_field('mix_design_details');
                        })
                    }
                })
                frm.refresh_field('mix_design_details')
            })
        }
        if(!frm.doc.scope_of_works){
            frm.set_value('mix_design_details',[])
        }
    }
});

frappe.ui.form.on('Mix Design Details',{
    product:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.material_type=='Item Group'){
            frappe.db.get_doc('Item',row.product).then(data=>{
                frappe.model.set_value(cdt,cdn,'unit',data.stock_uom)
            })
        }
    },
    material_type:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.material_type=='Item'){
            frappe.db.get_doc('Item',row.materials).then(data=>{
                frappe.model.set_value(cdt,cdn,'unit',data.stock_uom)
            })
        }
    },
    _part:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.depletion&&row._wastage&&row.thickness){
            let total=(row.depletion*row._part*(1+row._wastage/100)/1000)*row.thickness*0.01
            frappe.model.set_value(cdt,cdn,'qty',total)
        }
    },
    depletion:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row._part&&row._wastage&&row.thickness){
            let total1=(row.depletion*row._part*(1+row._wastage/100)/1000)*row.thickness*0.01
            frappe.model.set_value(cdt,cdn,'qty',total1)
        }
    },
    _wastage:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row._part&&row.depletion&&row.thickness){
            let total2=(row.depletion*row._part*(1+row._wastage/100)/1000)*row.thickness*0.01
            frappe.model.set_value(cdt,cdn,'qty',total2)
        }
    },
    thickness:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row._part&&row.depletion&&row._wastage){
            let total3=(row.depletion*row._part*(1+row._wastage/100)/1000)*row.thickness*0.01
            frappe.model.set_value(cdt,cdn,'qty',total3)
        }
    }
})
