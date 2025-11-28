frappe.ui.form.on('Sales Invoice Item',{
    item_code:function(frm, cdt, cdn){
        let row=locals[cdt][cdn]
        if(row.item){
            frm.fields_dict['items'].grid.get_field('uom').get_query=function(doc,cdt,cdn){
                return{
                    query:'frappe.defaults.get_uom_list',
                    filters:{
                        item:row.item_code
                    }
                }
            }
        }
    }
})