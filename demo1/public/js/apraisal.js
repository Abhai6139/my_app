frappe.ui.form.on('Appraisal Cycle',{
    refresh:function(frm){
        frm.set_query('employee','appraisees',()=>{
            return{
                filters:{
                    employment_type:'Full-Time'
                }
            }
        })
    }
})