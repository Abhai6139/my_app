// frappe.ui.form.on('Appraisal Cycle', {
//   detail_add: function(frm, cdt, cdn) {
//     frm.fields_dict['appraisees'].grid.get_field('employee').get_query = function(doc, cdt, cdn) {
//       return {
//         filters: {
//           employment_type: 'Full-Time'
//         }
//       };
//     };
//   }
// });


frappe.ui.form.on("Appraisal Cycle",{
    refresh:function(frm){
        frm.set_query("employee","appraisees",()=>{
            return {
                filters: {
                    employment_type : "Full-Time"
                }
            };
        });
    }
});



if(detail.material_type=="Item"){
    item_row.item_code = detail.material
    let uom_doc= await frappe.db.get_doc('Item',detail.material)
    for(let detail1 of uom_doc.uoms || []){
        if(detail1.uom==detail.uom){
            item_row.conversion_factor=detail1.conversion_factor
        }
    }
}else if(detail.material_type=="Item Group"){
    item_row.item_code = detail.product_name
    item_row.description=detail.material
    let uom_doc= await frappe.db.get_doc('Item',detail.product_name)
    for(let detail1 of uom_doc.uoms || []){
        if(detail1.uom==detail.uom){
            item_row.conversion_factor=detail1.conversion_factor
        }
    }
}