// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("MixDesign BOQ", {
	refresh(frm) {
        frm.set_df_property('items','cannot_add_rows',true)
        frm.set_df_property('items','cannot_delete_rows',true)
        frm.set_query('material_type','boq_details',function(){
            return{
                filters:{
                    name:['in',['Item','Item Group']]
                }
            }
        })
        frm.fields_dict['boq_details'].grid.get_field('product').get_query = function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: {
                    item_group: row.materials
                }
            }
        }
	},
});
frappe.ui.form.on('BOQ Details',{
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
// frappe.ui.form.on('Items',{
//     items_remove:function(frm,cdt,cdn){
//         let row=locals[cdt][cdn]
//         if(row.item_code){
//             frappe.call({
//                 method:"demo1.newapp.doctype.mixdesign_boq.mixdesign_boq.remove_rows",
//                 args:{
//                     mixdesign:row.item_code,
//                     doc:frm.doc.name
//                 },
//                 callback:function(r){
//                     if(r.message){
//                         frappe.msgprint(r.message)
//                         cur_frm.reload_doc()
//                     }
//                 }
//             })
//         }
//     }
// })
