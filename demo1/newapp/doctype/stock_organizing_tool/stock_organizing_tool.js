// Copyright (c) 2025, NA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Stock Organizing Tool", {
	refresh(frm) {
        frm.set_query('box_shelf_trolley',function(){
            return{
                filters:{
                    name:['in', ['Box','Shelf','Trolley']]
                }
            }
        })
        frm.set_query('shelf_or_trolley','items',function(){
            return{
                filters:{
                    name:['in', ['Shelf','Trolley']]
                }
            }
        })
        frm.set_query('shelf_or_trolley',function(){
            return{
                filters:{
                    name:['in', ['Shelf','Trolley']]
                }
            }
        })
        frm.add_custom_button('Get Serial Numbers',function(){
            let d=new frappe.ui.Dialog({
                title: 'Get Serial Numbers',
                fields: [
                    {
                        label: 'Item Code',
                        fieldname: 'item_code',
                        fieldtype: 'Link',
                        options: 'Item',
                        get_query:function(){
                            return{
                                filters:{
                                    'is_stock_item':1,
                                    'has_serial_no':1
                                }
                            }
                        }
                        
                    },
                ],
                size:'small',
                primary_action_label:'Submit',
                primary_action(values){
                    if(values.item_code){
                        frappe.call({
                            method:'frappe.client.get_list',
                            args:{
                                doctype:'Serial No',
                                filters:{
                                    'item_code':values.item_code
                                },
                                fields:['name','custom_box','custom_shelf_or_trolley','custom_shelftrolley']
                            },
                            callback:function(r){
                                if(r.message){
                                    frm.clear_table('items')
                                    r.message.forEach(data=>{
                                        let new_row=frm.add_child('items')
                                        new_row.serial_no=data.name
                                        new_row.box=data.custom_box
                                        new_row.shelf_or_trolley=data.custom_shelf_or_trolley
                                        new_row.shelftrolley=data.custom_shelftrolley
                                    })
                                    frm.refresh_field('items')
                                }
                            }
                        })
                    }
                    d.hide()
                }
                
            })
            d.show()
        })
	},
    boxshelftrolley:function(frm){
        if(frm.doc.boxshelftrolley){
            frm.set_value('serial_no')
            frappe.call({
                method:'frappe.client.get_list',
                args:{
                    doctype:'Serial No',
                    fields:['name','custom_box','custom_shelf_or_trolley','custom_shelftrolley'],
                },
                callback:function(r){
                    frm.clear_table('items')
                    let filtered = r.message.filter(emp =>
                        ( emp.custom_box === frm.doc.boxshelftrolley) ||
                        (emp.custom_shelftrolley===frm.doc.boxshelftrolley)
                    );
                    if(filtered.length > 0) {
                        filtered.forEach(serial=>{
                            let row=frm.add_child('items')
                            row.serial_no=serial.name
                            row.box=serial.custom_box
                            row.shelf_or_trolley=serial.custom_shelf_or_trolley
                            row.shelftrolley=serial.custom_shelftrolley
                        })
                        frm.refresh_field('items')
                    }else{
                        frm.clear_table('items')
                        frm.refresh_field('items')
                    }
                }

            })
        }
    },
    serial_no:function(frm){
        if(frm.doc.serial_no){
            frm.clear_table('items')
            frappe.db.get_doc('Serial No',frm.doc.serial_no).then(r=>{
                console.log(r)
                let row=frm.add_child('items')
                row.serial_no=r.name
                row.box=r.custom_box
                row.shelf_or_trolley=r.custom_shelf_or_trolley
                row.shelftrolley=r.custom_shelftrolley
                frm.refresh_field('items')
            })
            
        }
    },
    box_barcode:function(frm){
        if(frm.doc.box_barcode){
            frappe.db.get_doc('Box',frm.doc.box_barcode).then(row=>{
                if(row){
                    frm.set_value('box',frm.doc.box_barcode)
                }else{
                    frappe.msgprint('This Box is not available')
                }
            })
        }
    },
    shelf_or_trolley_barcode:function(frm){
        if(frm.doc.shelf_or_trolley_barcode){
            frappe.db.exists('Shelf',frm.doc.shelf_or_trolley_barcode).then(exist=>{
                if(exist){
                    frm.set_value('shelf_or_trolley','Shelf')
                    frm.set_value('shelftrolley',frm.doc.shelf_or_trolley_barcode) 
                }
                else{
                    frappe.db.exists('Trolley',frm.doc.shelf_or_trolley_barcode).then(exist1=>{
                        if(exist1){
                            frm.set_value('shelf_or_trolley','Trolley')
                            frm.set_value('shelftrolley',frm.doc.shelf_or_trolley_barcode) 
                        }
                    })
                }
            })
        }
    },
    before_submit:function(frm){
        let d=new frappe.ui.Dialog({
                title: 'Are you sure you want to submit?',
                size:'small',
                primary_action_label:'Submit',
                primary_action(values){
                    frm.save('Submit')                  
                    d.hide()
                },
                secondary_action_label:'Cancel',
                secondary_action(){
                    d.hide()
                }
            })
            d.show()
        frappe.throw()
    }

});
























// frappe.db.get_all('Serial No',
            //     filters={
            //         'custom_box':frm.doc.boxshelftrolley
            //     },
            //     fields=['name','custom_box','custom_shelf_or_trolley','custom_shelftrolley']
            // ).then(r=>{
            //     if(r && r.length>0){
            //         frm.clear_table('items')
            //         r.forEach(serial=>{
            //             let row=frm.add_child('items')
            //             row.serial_no=serial.name
            //             row.box=serial.custom_box
            //             row.shelf_or_trolley=serial.custom_shelf_or_trolley
            //             row.shelftrolley=serial.custom_shelftrolley
            //         })
            //         frm.refresh_field('items')
                    
            //     }
            // })