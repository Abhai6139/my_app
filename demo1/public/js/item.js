frappe.ui.form.on("Item",{
    refresh:function(frm){
        frm.set_query('custom_shelf_or_trolley',function(){
            return{
                filters:{
                    name:['in', ['Shelf','Trolley']]
                }
            }
        })
    }
});