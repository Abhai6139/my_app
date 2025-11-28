// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Salary Increment", {
	refresh(frm) {
        let has_rows = frm.doc.existing_salary_structure && frm.doc.existing_salary_structure.length > 0;
        frm.toggle_display('delete', has_rows);
        if(!frm.is_new()){
            frm.add_custom_button('Add Salary',function(){
                frappe.db.get_list('Salary Structure Assignment',{
                    filters: [
                        ['employee','=', frm.doc.employee],
                        ['docstatus','=',1],
                    ],
                    fields: ['from_date','name'],
                    order_by: 'from_date desc',
                    limit: 1
                }).then(data=>{
                    if(!data || data.length === 0){
                        frappe.throw('Add base Salary Structure Assignment for this employee')
                    }else{
                        frappe.db.get_doc('Salary Structure Assignment',data[0].name).then(data1=>{
                            if(data1.from_date>frappe.datetime.get_today()){
                                frappe.msgprint(`This current details will affect only from ${data1.from_date}`)
                            }
                            let d=new frappe.ui.Dialog({
                                title: 'Duty Log details',
                                fields: [
                                    {
                                        label: 'Salary Increment',
                                        fieldname: 'name',
                                        fieldtype: 'Data',
                                        default: frm.doc.name,
                                        read_only: 1
                                    },
                                    {
                                        label: 'Employee',
                                        fieldname: 'employee',
                                        fieldtype: 'Link',
                                        options:'Employee',
                                        default: frm.doc.employee,
                                        read_only: 1
                                    },
                                    {
                                        label: '',
                                        fieldname: '',
                                        fieldtype: 'Column Break',
                                        
                                    },
                                    {
                                        label: 'Date',
                                        fieldname: 'date',
                                        fieldtype: 'Date',
                                        default: frappe.datetime.get_today(),
                                    },
                                    {
                                        label: 'Salary Structure',
                                        fieldname: 'salary_structure',
                                        fieldtype: 'Link',
                                        options:'Salary Structure',
                                        default: data1.salary_structure,
                                        read_only: 1
                                    },
                                    {
                                        label: '',
                                        fieldname: '',
                                        fieldtype: 'Section Break',
                                        
                                    },
                                    {
                                        label: 'Basic',
                                        fieldname: 'basic',
                                        fieldtype: 'Currency',
                                        default: data1.custom_basic,
                                        onchange: function () {
                                            let change = (d.get_value('basic'))-data1.custom_basic
                                            let incr = d.get_value('increment_amount') || 0;
                                            let total=d.get_value('net_amount')
                                            if(change<=0){
                                                frappe.throw('New amount must be greater than previous amount')
                                                d.set_value('basic', 0);
                                            }else{
                                                d.set_value('increment_amount', incr + change);
                                                d.set_value('net_amount', total + change);
                                            }
                                        }
                                    },
                                    {
                                        label: 'HRA',
                                        fieldname: 'hra',
                                        fieldtype: 'Currency',
                                        default: data1.custom_hra,
                                        onchange: function () {
                                            let change = (d.get_value('hra'))-data1.custom_hra
                                            let incr = d.get_value('increment_amount') || 0;
                                            let total=d.get_value('net_amount')
                                            if(change<=0){
                                                frappe.throw('New amount must be greater than previous amount')
                                                d.set_value('hra', 0);
                                            }else{
                                                d.set_value('increment_amount', incr + change);
                                                d.set_value('net_amount', total + change);
                                            }
                                        }
                                    },
                                    {
                                        label: '',
                                        fieldname: '',
                                        fieldtype: 'Column Break',
                                        
                                    },
                                    {
                                        label: 'Transport Allowance',
                                        fieldname: 'transport',
                                        fieldtype: 'Currency',
                                        default: data1.custom_transport_allowance,
                                        onchange: function () {
                                            let change = (d.get_value('transport'))-data1.custom_transport_allowance
                                            let incr = d.get_value('increment_amount') || 0;
                                            let total=d.get_value('net_amount')
                                            if(change<=0){
                                                frappe.throw('New amount must be greater than previous amount')
                                                d.set_value('transport', 0);
                                            }else{
                                                d.set_value('increment_amount', incr + change);
                                                d.set_value('net_amount', total + change);
                                            }
                                        }
                                    },
                                    {
                                        label: 'Food Allowance',
                                        fieldname: 'food',
                                        fieldtype: 'Currency',
                                        default: data1.custom_food_allowance,
                                        onchange: function () {
                                            let change = (d.get_value('food'))-data1.custom_food_allowance
                                            let incr = d.get_value('increment_amount') || 0;
                                            let total=d.get_value('net_amount')
                                            if(change<=0){
                                                frappe.throw('New amount must be greater than previous amount')
                                                d.set_value('food', 0);
                                            }else{
                                                d.set_value('increment_amount', incr + change);
                                                d.set_value('net_amount', total + change);
                                            }
                                        }
                                    },
                                    {
                                        label: '',
                                        fieldname: '',
                                        fieldtype: 'Column Break',
                                        
                                    },
                                    {
                                        label: 'Fixed Allowance',
                                        fieldname: 'fixed',
                                        fieldtype: 'Currency',
                                        default: data1.custom_fixed_allowance,
                                        onchange: function () {
                                            let change = (d.get_value('fixed'))-data1.custom_fixed_allowance
                                            let incr = d.get_value('increment_amount') || 0;
                                            let total=d.get_value('net_amount')
                                            if(change<=0){
                                                frappe.throw('New amount must be greater than previous amount')
                                                d.set_value('fixed', 0);
                                            }else{
                                                d.set_value('increment_amount', incr + change);
                                                d.set_value('net_amount', total + change);
                                            }
                                        }
                                    },
                                    {
                                        label: 'Other Allowance',
                                        fieldname: 'other',
                                        fieldtype: 'Currency',
                                        default: data1.custom_other_allowance,
                                        onchange: function () {
                                            let change = (d.get_value('other'))-data1.custom_other_allowance
                                            let incr = d.get_value('increment_amount') || 0;
                                            let total=d.get_value('net_amount')
                                            if(change<=0){
                                                frappe.throw('New amount must be greater than previous amount')
                                                d.set_value('other', 0);
                                            }else{
                                                d.set_value('increment_amount', incr + change);
                                                d.set_value('net_amount', total + change);
                                            }
                                        }
                                    },
                                    {
                                        label: '',
                                        fieldname: '',
                                        fieldtype: 'Section Break',
                                        
                                    },
                                    {
                                        label: 'Increment Amount',
                                        fieldname: 'increment_amount',
                                        fieldtype: 'Currency',
                                        default:0,
                                        read_only: 1
                                    },
                                    {
                                        label: '',
                                        fieldname: '',
                                        fieldtype: 'Column Break',
                                        
                                    },
                                    {
                                        label: 'Net Amount',
                                        fieldname: 'net_amount',
                                        fieldtype: 'Currency',
                                        default: data1.custom_gross_salary,
                                        read_only: 1
                                    },
                                ],
                                size:'Large',
                                primary_action_label:'Submit',
                                primary_action(values){
                                    if(values){
                                        if(values.increment_amount>0){
                                            if(values.date==data1.from_date){
                                                frappe.throw('One New Salary structure assignment is created today for this employee')
                                            }else{
                                                if(frm.doc.existing_salary_structure){
                                                    frm.doc.existing_salary_structure.forEach(row=>{
                                                        let newdata=frm.add_child('previous_salary_history')
                                                        newdata.basic=row.basic
                                                        newdata.hra=row.hra
                                                        newdata.transport=row.transport
                                                        newdata.food=row.food
                                                        newdata.fixed=row.fixed
                                                        newdata.other=row.other
                                                        newdata.increment_date=row.increment_date
                                                        newdata.increment_amount=row.increment_amount
                                                        newdata.net_amount=row.net_amount
                                                        frm.refresh_field('previous_salary_history')
                                                    })
                                                }
                                                
                                                frm.clear_table('existing_salary_structure')
                                                let row=frm.add_child('existing_salary_structure')
                                                row.basic=values.basic
                                                row.hra=values.hra
                                                row.transport=values.transport
                                                row.food=values.food
                                                row.fixed=values.fixed
                                                row.other=values.other
                                                row.increment_date=values.date
                                                row.increment_amount=values.increment_amount
                                                row.net_amount=values.net_amount
                                                frm.refresh_field('existing_salary_structure')
                                                frappe.call({
                                                    method:'frappe.client.submit',
                                                    args:{
                                                        doc:{
                                                            doctype:'Salary Structure Assignment',
                                                            employee:frm.doc.employee,
                                                            salary_structure:data1.salary_structure,
                                                            from_date:values.date,
                                                            custom_basic:values.basic,
                                                            custom_hra:values.hra,
                                                            custom_transport_allowance:values.transport,
                                                            custom_food_allowance:values.food,
                                                            custom_fixed_allowance:values.fixed,
                                                            custom_other_allowance:values.other,
                                                            custom_salary_increment:frm.doc.name
                                                        }
                                                    },
                                                    callback:function(r){
                                                        if(r.message){
                                                            frappe.show_alert('Salary Structure Assignment Created', 5);
                                                        }else{
                                                            frappe.throw('Cannot create Salary Structure Assignment ')
                                                        }
                                                    }
                                                })
                                                frm.save()
                                            }
                                            d.hide()
                                        }else{
                                            frappe.throw('There is no increment in salary')
                                        }
                                    }
                                }
                            })
                            d.show()
                        })
                    }
                })
                
            })
        }
	},
    delete:function(frm){
        if(frm.doc.existing_salary_structure){
            frm.doc.existing_salary_structure.forEach(row=>{
                frappe.db.get_value(
                    'Salary Structure Assignment',
                    { from_date: row.increment_date,employee:frm.doc.employee },
                    'name',
                    (r) => {
                        if (r && r.name) {
                            frappe.confirm(
                                `Are you sure you want to delete Salary Structure Assignment linked with this row 
                                <a href="/app/salary-structure-assignment/${r.name}" target="_blank">${r.name}</a>?`,
                                () => {
                                    frm.clear_table('existing_salary_structure')
                                    let row2=frm.add_child('existing_salary_structure')
                                    row2.basic=" "
                                    row2.hra=" "
                                    row2.transport=" "
                                    row2.food=" "
                                    row2.fixed=" "
                                    row2.other=" "
                                    row2.increment_amount=" "
                                    row2.net_amount=" "
                                    frm.refresh_field('existing_salary_structure')
                                    frappe.call({
                                        method: 'frappe.client.cancel',
                                        args: {
                                            doctype: 'Salary Structure Assignment',
                                            name: r.name
                                        },
                                        callback: function(res) {
                                            if (!res.exc) {
                                                frappe.call({
                                                    method: 'frappe.client.delete',
                                                    args: {
                                                        doctype: 'Salary Structure Assignment',
                                                        name: r.name
                                                    },
                                                    callback: function(res1) {
                                                        if (!res1.exc) {
                                                            frappe.show_alert('Salary Structure Assignment deleted',5);
                                                            frm.save()
                                                        }
                                                    }
                                                });
                                                frm.save()
                                            }
                                        }
                                        
                                    });
                                },
                                () => {
                                    frappe.msgprint('Deletion Cancelled');
                                }
                            );
                        }
                    }
                );
        
            })
            
        }
    },
    
});
frappe.ui.form.on('Salary Structure Details',{
    basic:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        let total=(row.basic||0)+(row.hra||0)+(row.transport||0)+(row.food||0)+(row.fixed||0)+(row.other||0)
        frappe.model.set_value(cdt,cdn,'net_amount',total)
    },
    hra:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        let total=(row.basic||0)+(row.hra||0)+(row.transport||0)+(row.food||0)+(row.fixed||0)+(row.other||0)
        frappe.model.set_value(cdt,cdn,'net_amount',total)
    },
    transport:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        let total=(row.basic||0)+(row.hra||0)+(row.transport||0)+(row.food||0)+(row.fixed||0)+(row.other||0)
        frappe.model.set_value(cdt,cdn,'net_amount',total)
    },
    food:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        let total=(row.basic||0)+(row.hra||0)+(row.transport||0)+(row.food||0)+(row.fixed||0)+(row.other||0)
        frappe.model.set_value(cdt,cdn,'net_amount',total)
    },
    fixed:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        let total=(row.basic||0)+(row.hra||0)+(row.transport||0)+(row.food||0)+(row.fixed||0)+(row.other||0)
        frappe.model.set_value(cdt,cdn,'net_amount',total)
    },
    other:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        let total=(row.basic||0)+(row.hra||0)+(row.transport||0)+(row.food||0)+(row.fixed||0)+(row.other||0)
        frappe.model.set_value(cdt,cdn,'net_amount',total)
    },
})