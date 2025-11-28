frappe.ui.form.on("Serial No",{
    refresh:function(frm){
        frm.set_query('custom_shelf_or_trolley',function(){
            return{
                filters:{
                    name:['in', ['Shelf','Trolley']]
                }
            }
        })
    },
    // custom_box:function(frm){
    //     if(frm.doc.custom_box){
    //         frappe.db.get_doc('Box',frm.doc.custom_box).then(row=>{
    //             if(row){
    //                 frm.set_value('custom_shelf_or_trolley',row.shelf_or_trolley)
    //                 frm.set_value('custom_shelftrolley',row.shelftrolley)
    //             }
    //         })
    //     }
    // }
});