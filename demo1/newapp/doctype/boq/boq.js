// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("BOQ", {
	refresh:function(frm){
        frm.set_query('service_item',function(){
            return{
                filters:{
                    is_stock_item:0
                }
            }
        })
        frm.set_query('item_code','itemm',function(){
            return{
                filters:{
                    is_stock_item:1
                }
            }
        })
    },
    // service_item: function (frm) {
    //     if (frm.doc.service_item) {
    //         frappe.call({
    //             method: 'demo1.newapp.doctype.boq.boq.get_detail',
    //             args: {
    //                 itemcode: frm.doc.service_item
    //             },
    //             callback: function (r) {
    //                 if (r.message) {
    //                     frm.clear_table('itemm');
    //                     r.message.forEach(rowData => {
    //                         let row = frm.add_child('itemm');
    //                         row.item_code = rowData.name;
    //                     });
    //                     frm.refresh_field('itemm');
    //                 }
    //             }
    //         });
    //     }
    // },


    service_item: function(frm) {
        if (!frm.doc.service_item) return;

        // Step 1: Get the selected item's item group
        frappe.db.get_value("Item", frm.doc.service_item, "item_group").then(item_res => {
            const item_group = item_res.message.item_group;

            // Step 2: Get lft and rgt of the selected item group
            frappe.db.get_value("Item Group", item_group, ["lft", "rgt"]).then(group_info => {
                const { lft, rgt } = group_info.message;

                // Step 3: Get all child item groups under this item group
                frappe.call({
                    method: "frappe.client.get_list",
                    args: {
                        doctype: "Item Group",
                        filters: [
                            ["lft", ">=", lft],
                            ["rgt", "<=", rgt]
                        ],
                        fields: ["name"]
                    },
                    callback: function(group_list) {
                        const group_names = group_list.message.map(g => g.name);

                        // Step 4: Get items from these groups that are stock items
                        frappe.call({
                            method: "frappe.client.get_list",
                            args: {
                                doctype: "Item",
                                filters: [
                                    ["item_group", "in", group_names],
                                    ["is_stock_item", "=", 1]
                                ],
                                fields: ["name", "item_name", "item_group"]
                            },
                            callback: function(item_list) {
                                frm.clear_table("itemm");
                                item_list.message.forEach(item => {
                                    let row = frm.add_child("itemm");
                                    row.item_code = item.name;
                                    row.item_name = item.item_name;
                                    row.item_group = item.item_group;
                                });
                                frm.refresh_field("itemm");
                            }
                        });
                    }
                });
            });
        });
    }

});
frappe.ui.form.on('Itemm',{
    rate:function(frm,cdt,cdn){
        let doc=locals[cdt][cdn]
        if(doc.rate&&doc.qty){
            frappe.model.set_value(cdt,cdn,'amount',doc.qty*doc.rate)
        }
    },
    qty:function(frm,cdt,cdn){
        let doc1=locals[cdt][cdn]
        if(doc1.qty&&doc1.rate){
            frappe.model.set_value(cdt,cdn,'amount',doc1.rate*doc1.qty)
        }
    },
})


