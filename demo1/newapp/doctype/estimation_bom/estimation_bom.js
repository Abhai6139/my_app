// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Estimation BOM", {
	refresh(frm) {
        update_val1(frm)
        update_val2(frm)
	},
})

frappe.ui.form.on("Spare Parts",{
    qty:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.qty&&row.unit_cost){
            let total=row.qty*row.unit_cost
            frappe.model.set_value(cdt,cdn,'total_cost',total)
            update_val1(frm)
        }else{
            frappe.model.set_value(cdt,cdn,'total_cost',0)
        }
        if(row.margin&&row.unit_cost){
            let unt_sell=row.unit_cost*row.margin/100
            frappe.model.set_value(cdt,cdn,'unit_selling',unt_sell+row.unit_cost)
            if(row.qty){
                frappe.model.set_value(cdt,cdn,'total_selling',row.unit_selling*row.qty)
                update_val2(frm)
            }else{
                frappe.model.set_value(cdt,cdn,'total_selling',0)
            }
        }else{
            frappe.model.set_value(cdt,cdn,'unit_selling',0)
        }
    },
    unit_cost:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.qty&&row.unit_cost){
            let total=row.qty*row.unit_cost
            frappe.model.set_value(cdt,cdn,'total_cost',total)
            update_val1(frm)
        }else{
            frappe.model.set_value(cdt,cdn,'total_cost',0)
        }
        if(row.margin&&row.unit_cost){
            let unt_sell=row.unit_cost*row.margin/100
            frappe.model.set_value(cdt,cdn,'unit_selling',unt_sell+row.unit_cost)
            if(row.qty){
                frappe.model.set_value(cdt,cdn,'total_selling',row.unit_selling*row.qty)
                update_val2(frm)
            }else{
                frappe.model.set_value(cdt,cdn,'total_selling',0)
            }
        }else{
            frappe.model.set_value(cdt,cdn,'unit_selling',0)
        }
    },
    margin:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.margin&&row.unit_cost){
            let unt_sell=row.unit_cost*row.margin/100
            frappe.model.set_value(cdt,cdn,'unit_selling',unt_sell+row.unit_cost)
            if(row.qty){
                frappe.model.set_value(cdt,cdn,'total_selling',row.unit_selling*row.qty)
                update_val2(frm)
            }else{
                frappe.model.set_value(cdt,cdn,'total_selling',0)
            }
        }else{
            frappe.model.set_value(cdt,cdn,'unit_selling',0)
        }
    },
    spare_parts_remove:function(frm){
        update_val1(frm)
        update_val2(frm)
    }
})
frappe.ui.form.on('Activities',{
    man_hours:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.man_hours&&row.costing_rate){
            let total=row.man_hours*row.costing_rate
            frappe.model.set_value(cdt,cdn,'total_cost',total)
            update_val1(frm)
        }
        if(row.margin&&row.total_cost){
            let sell_amt=row.total_cost*row.margin/100
            frappe.model.set_value(cdt,cdn,'selling_amount',sell_amt+row.total_cost)
            update_val2(frm)
        }
    },
    margin:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.margin&&row.total_cost){
            let sell_amt=row.total_cost*row.margin/100
            frappe.model.set_value(cdt,cdn,'selling_amount',sell_amt+row.total_cost)
            update_val2(frm)
        }
    },
    activities_remove:function(frm){
        update_val1(frm)
        update_val2(frm)
    }
})

function update_val1(frm){
    let total1=0
    let total2=0
    frm.doc.spare_parts.forEach(data=>{
        total1+=data.total_cost
    })
    frm.set_value('total_spare_parts_cost',total1)
    frm.doc.activities.forEach(data1=>{
        total2+=data1.total_cost
    })
    frm.set_value('total_activities_cost',total2)
    frm.set_value('total_cost',total1+total2)
}
function update_val2(frm){
    let total1=0
    let total2=0
    frm.doc.spare_parts.forEach(data=>{
        total1+=data.total_selling
    })
    frm.doc.activities.forEach(data1=>{
        total2+=data1.selling_amount
    })
    frm.set_value('total_selling_amount',total1+total2)
    let total3=(total1+total2)-frm.doc.total_cost
    frm.set_value('margin_amount',total3)
    let total4=(total3*100)/(total1+total2)
    frm.set_value('margin',total4)
}