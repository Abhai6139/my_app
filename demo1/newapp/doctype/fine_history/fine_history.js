// // Copyright (c) 2025, NA and contributors
// // For license information, please see license.txt
// frappe.ui.form.on('Fine History',{
//     refresh:function(frm){
//         if (frm.doc.paid_on && frm.doc.docstatus === 0) {
//             frm.enable_save();
//         } else {
//             frm.disable_save();
//         }
//     }
// })
// frappe.ui.form.on("Fine History", {
//     on_submit: function(frm) {
//         frappe.db.get_doc('Vehicle', frm.doc.vehicle).then(function(r) {
//             let html = `
//                 <table class="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th>Fine Date</th>
//                             <th>Fine Amount</th>
//                             <th>Reason</th>
//                             <th>Paid By</th>
//                             <th>Paid On</th>
//                             <th>Fine Place</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>${frm.doc.fine_date || ''}</td>
//                             <td>${frm.doc.fine_amount || ''}</td>
//                             <td>${frm.doc.reason || ''}</td>
//                             <td>${frm.doc.paid_by || ''}</td>
//                             <td>${frm.doc.paid_on || ''}</td>
//                             <td>${frm.doc.fine_place || ''}</td>
//                         </tr>
//                     </tbody>
//                 </table>
//             `;
//             frm.fields_dict.custom_fine.$wrapper.html(html); 
//         });
//     }
// });

