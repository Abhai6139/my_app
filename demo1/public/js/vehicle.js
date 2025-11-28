
frappe.ui.form.on('Vehicle', {
    onload: function(frm) {
        if (!frm.doc.name) return;

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Fine History",
                filters: [
                    ['vehicle','=',frm.doc.name],
                    ['docstatus', 'in', [0,1]]
                ],
                fields: ["fine_date", "fine_amount", "reason", "name1","paid_by", "paid_on", "fine_place","fine_status","name"],
                order_by: "fine_date asc"
            },
            callback: function(r) {
                let data = r.message;
                if (!data || data.length === 0) {
                    frm.fields_dict.custom_fine.$wrapper.html("<p>No fine history available.</p>");
                    return;
                }

                let html = `
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Fine</th>
                                <th>Fine Date</th>
                                <th>Amount</th>
                                <th>Reason</th>
                                <th>Paid By</th>
                                <th>Paid On</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                data.forEach(function(row) {
                    html += `
                        <tr>
                            <td>${row.name || ""}</td>
                            <td>${frappe.format(row.fine_date, {fieldtype: "Date"})}</td>
                            <td>${row.fine_amount || ""}</td>
                            <td>${row.reason || ""}</td>
                            <td>${row.name1 || ""}(${row.paid_by})</td>
                            <td>${row.paid_on ? frappe.format(row.paid_on, {fieldtype: "Date"}) : ""}</td>
                            <td>${row.fine_status || ""}</td>
                        </tr>
                    `;
                });

                html += `</tbody></table>`;

                frm.fields_dict.custom_fine.$wrapper.html(html);
            }
        });
    }
});














// frappe.ui.form.on('Vehicle', {
//     onload: function(frm) {
//         if (!frm.doc.name) return;

//         frappe.call({
//             method: 'demo1.newapp.doctype.fine_history.fine_history.get_fine_history_html',
//             args: {
//                 vehicle: frm.doc.name
//             },
//             callback: function(r) {
//                 if (r.message) {
//                     frm.fields_dict.custom_fine.$wrapper.html(r.message);
//                 }
//             }
//         });
//     }
// });