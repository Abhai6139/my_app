// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Quick Invoice", {
	validate:function(frm){
        if(frm.doc.grand_total==0){
            frappe.throw('Add Items with qty')
        }
        if(frm.doc.discount<0){
            frappe.throw('Discount cannot be less than zero')
        }
        if(!frm.doc.price_list){
            frappe.throw('Add Price list')
        }
        
    },
    
    
    discount:function(frm){
        update_total(frm)
    },

    refresh: function (frm) {
        if(!frm.doc.docstatus==1){
            frm.set_value('sales_invoice_reference',"")
            if(frm.doc.status=="In Progress"){
                frm.set_value('status',"In Progress")
            }else{
                frm.set_value('status','Draft')
            }
        }
        if (frm.doc.status === "In Progress") {
            frm.page.set_indicator(__('In Progress'), 'orange');
        }
        else if (frm.doc.docstatus === 1) {
            frm.page.set_indicator(__('Submitted'), 'blue');
        }
        else {
            frm.page.set_indicator(__('Draft'), 'red');
        }
        if (!frm.is_new()&& !frm.doc.docstatus==1) {
            if (frm.doc.status === "Draft") {
                frm.add_custom_button('In Progress', function () {
                    frm.set_value('status', 'In Progress');
                    frm.remove_custom_button('In Progress');
                    frm.save()
                    
                });
            }
            else if(frm.doc.status === "In Progress"){
                frm.add_custom_button('Checkout', function () {
                    let d = new frappe.ui.Dialog({
                        title: 'Duty Log details',
                        fields: [
                            {
                                label: 'Total',
                                fieldname: 'total',
                                fieldtype: 'Currency',
                                default: frm.doc.table_total,
                                read_only: 1
                            },
                            {
                                label: 'Vat',
                                fieldname: 'vat',
                                fieldtype: 'Currency',
                                default: frm.doc.vat,
                                read_only: 1
                            },
                            {
                                label: 'Grand Total',
                                fieldname: 'grand_total',
                                fieldtype: 'Currency',
                                default: frm.doc.grand_total,
                                read_only: 1
                            },
                            {
                                label: 'Discount',
                                fieldname: 'discount',
                                fieldtype: 'Currency',
                                default: frm.doc.discount,
                                read_only: 1
                            },
                            {
                                label: 'Payment Mode',
                                fieldname: 'payment_mode',
                                fieldtype: 'Select',
                                options: [" ", "Cash", "Card"],
                                reqd:1
                            },
                            {
                                label: 'Paid Amount',
                                fieldname: 'paid_amount',
                                fieldtype: 'Currency',
                                reqd:1,
                                onchange: function () {
                                    let paid = d.get_value('paid_amount') || 0;
                                    let grand = d.get_value('grand_total') || 0;
                                    d.set_value('change', paid - grand);
                                }
                            },
                            {
                                label: 'Change',
                                fieldname: 'change',
                                fieldtype: 'Currency',
                            },
                        ],
                        primary_action_label: 'Checkout',
                        primary_action(values) {
                            if(values.paid_amount<values.grand_total){
                                frappe.throw('Paid amount cannot be less than total amount')
                            }
                            frappe.confirm('Are you sure you want to proceed?', () => {
                                frm.set_value('payment_mode', values.payment_mode);
                                frm.set_value('paid_amount', values.paid_amount);
                                frm.set_value('change_amount', values.change);
                                d.hide();
                                frappe.call({
                                    method: 'frappe.client.insert',
                                    args: {
                                        doc: {
                                            doctype: 'Sales Invoice',
                                            customer: frm.doc.customer,
                                            currency: "INR",
                                            selling_price_list: frm.doc.price_list,
                                            update_stock: 1,
                                            set_warehouse: frm.doc.warehouse,
                                            is_pos: 1,
                                            apply_discount_on: "Grand Total",
                                            discount_amount: frm.doc.discount || 0,
                                            net_total: frm.doc.sub_total,

                                            items: frm.doc.items.map(data => ({
                                                item_code: data.item_code,
                                                qty: data.qty,
                                                rate: data.rate
                                            })),

                                            payments: [
                                                {
                                                    mode_of_payment: frm.doc.payment_mode || "Cash",
                                                    amount: frm.doc.grand_total
                                                }
                                            ],

                                            taxes: [
                                                {
                                                    charge_type: "On Net Total",
                                                    account_head: "TDS - C",
                                                    rate: 5,
                                                    included_in_print_rate: 1,
                                                    description: "TDS"
                                                }
                                            ]
                                        }
                                    },
                                    callback: function(r) {
                                        if (r.message) {
                                            frappe.call({
                                                method: 'frappe.client.submit',
                                                args: { doc: r.message },
                                                callback: function(submit_res) {
                                                    frappe.show_alert('Sales Invoice Created & Submitted', 5);
                                                    frm.set_value('sales_invoice_reference',r.message.name)
                                                    frm.set_value('status','Submitted')
                                                    frm.save("Submit");
                                                }
                                            });
                                        } else {
                                            frappe.throw("Failed to create Sales Invoice");
                                        }
                                    }

                                });

                                frm.remove_custom_button('Checkout');
                            }, () => {
                                frappe.msgprint('Submission Cancelled');
                            });
                        },
                    });
                    d.show();
                });
            }
        }
    },
    on_submit:function(frm){
        frappe.call({
            method: 'frappe.client.insert',
            args: {
                doc: {
                    doctype: 'Sales Invoice',
                    customer: frm.doc.customer,
                    currency: "INR",
                    selling_price_list: frm.doc.price_list,
                    update_stock: 1,
                    set_warehouse: frm.doc.warehouse,
                    is_pos: 1,
                    apply_discount_on: "Grand Total",
                    discount_amount: frm.doc.discount || 0,
                    net_total: frm.doc.sub_total,
                    custom_quick_invoice:frm.doc.name,
                    items: frm.doc.items.map(data => ({
                        item_code: data.item_code,
                        qty: data.qty,
                        rate: data.rate
                    })),

                    payments: [
                        {
                            mode_of_payment: frm.doc.payment_mode || "Cash",
                            amount: frm.doc.grand_total
                        }
                    ],

                    taxes: [
                        {
                            charge_type: "On Net Total",
                            account_head: "TDS - C",
                            rate: 5,
                            included_in_print_rate: 1,
                            description: "TDS"
                        }
                    ]
                }
            },
            callback: function(r) {
                if (r.message) {
                    frappe.call({
                        method: 'frappe.client.submit',
                        args: { doc: r.message },
                        callback: function(submit_res) {
                            frappe.show_alert('Sales Invoice Created & Submitted', 5);
                            frm.set_value('sales_invoice_reference',r.message.name)
                            frm.set_value('status','Submitted')
                            frm.save("Submit");
                            
                        }
                    });
                } else {
                    frappe.throw("Failed to create Sales Invoice");
                }
            }

        });
    },
    
});





frappe.ui.form.on('Itemss',{
    qty:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.qty&&row.rate){
            frappe.model.set_value(cdt,cdn,'amount',row.qty*row.rate)
        }
        update_total(frm)
    },
    item_code:function(frm,cdt,cdn){
        let row=locals[cdt][cdn]
        if(row.item_code){
            if(row.qty&&row.rate){
                frappe.model.set_value(cdt,cdn,'amount',row.qty*row.rate)
            }
            if(frm.doc.price_list){
                if(row.item_code){
                    frappe.db.get_list('Item Price',{
                        filters: [
                            ['item_code','=', row.item_code],
                            ['price_list','=',frm.doc.price_list],
                            ['valid_from','<=',frappe.datetime.get_today()]
                        ],
                        fields: ['price_list_rate', 'valid_from'],
                        order_by: 'valid_from desc',
                        limit: 1
                    }).then(res => {
                        if(res && res.length > 0){
                            frappe.model.set_value(cdt,cdn,'rate',res[0].price_list_rate)
                            frappe.model.set_value(cdt,cdn,'qty',0)
                            frappe.model.set_value(cdt,cdn,'amount',0)
                        }else{
                            frappe.model.set_value(cdt,cdn,'rate',0)
                            frappe.model.set_value(cdt,cdn,'qty',0)
                            frappe.model.set_value(cdt,cdn,'amount',0)
                            
                        }
                    })
                }
            }else{
                frappe.throw('Add Price List')
                frappe.model.set_value(cdt,cdn,'item_code'," ")
            }
        }else{
            frappe.model.set_value(cdt,cdn,'qty',0)
            frappe.model.set_value(cdt,cdn,'rate',0)
            frappe.model.set_value(cdt,cdn,'amount',0)
        }
        
        
    },
    items_remove:function(frm){
        update_total(frm)
        console.log(frm.doc.table_total)
    },
    items_add:function(frm){
        update_total(frm)
    }
})



function update_total(frm) {
    let total = 0;
    let grnd_ttl = 0;
    let vt = 0;
    let sb_ttl = 0;

    frm.set_value('table_total', 0);
    frm.set_value('grand_total', 0);
    frm.set_value('vat', 0);
    frm.set_value('sub_total', 0);

    if (frm.doc.items && frm.doc.items.length > 0) {
        frm.doc.items.forEach(row => {
            if (row.amount) {
                total += row.amount;
            }
        });

        frm.set_value('table_total', total || 0);

        grnd_ttl = total - (frm.doc.discount || 0);
        frm.set_value('grand_total', grnd_ttl || 0);

        if (grnd_ttl) {
            vt = grnd_ttl * (5 / 105);
            sb_ttl = grnd_ttl * (100 / 105);
            frm.set_value('vat', vt || 0);
            frm.set_value('sub_total', sb_ttl || 0);
        }
    }
}


// function update_total(frm){
//     let total=0
//     let grnd_ttl=0
//     let vt=0
//     let sb_ttl=0
//     frm.doc.items.forEach(row=>{
//         if(row.amount){
//             total+=row.amount
//         }
        
//         frm.set_value('table_total',total||0)
//         grnd_ttl+=total-(frm.doc.discount||0)
//         frm.set_value('grand_total',grnd_ttl||0)
//         if(frm.doc.grand_total){
//             vt+=frm.doc.grand_total*(5/105)
//             sb_ttl+=frm.doc.grand_total*(100/105)
//             frm.set_value('vat',vt||0)
//             frm.set_value('sub_total',sb_ttl||0)
//         }
//     })
// }