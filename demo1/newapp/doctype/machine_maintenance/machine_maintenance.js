// Copyright (c) 2025, NA
// For license information, please see license.txt

frappe.ui.form.on("Machine Maintenance", {
    
    refresh(frm) {       
        if(frm.doc.docstatus==1 && frm.doc.status!=='Completed'){
            frm.add_custom_button('Mark Completed', function () {
                frm.set_value('status', 'Completed')
                frm.set_value('completion_date', frappe.datetime.get_today())
                frm.save('Submit')
            })
        }
        

        if (!frm.is_new()) {
            show_notes(frm)
        }
        
        
    },

    maintenance_date(frm) {
        if (frm.doc.maintenance_date < frappe.datetime.get_today() && frm.doc.status !== 'Completed') {
            frm.set_value('status', 'Overdue')
        }
    },

    validate(frm) {
        if (frm.doc.completion_date < frm.doc.maintenance_date) {
            frappe.throw('Completion Date cannot be before Maintenance Date')
        }
    }
})


frappe.ui.form.on('Parts', {
    quantity(frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        if (row.rate) {
            frappe.model.set_value(cdt, cdn, 'amount', row.quantity * row.rate)
            update_det(frm)
        }
    },
    rate(frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        if (row.quantity) {
            frappe.model.set_value(cdt, cdn, 'amount', row.quantity * row.rate)
            update_det(frm)
        }
    },
    parts_used_remove(frm) {
        update_det(frm)
    },
    part(frm, cdt, cdn) {
        update_det(frm)
    },
    amount(frm, cdt, cdn) {
        update_det(frm)
    }
});



function update_det(frm) {
    let total = 0;
    (frm.doc.parts_used || []).forEach(row => {
        if (row.amount) total += row.amount;
    });
    frm.set_value('cost', total);
}


function show_notes(frm) {
   
    if (!frm.fields_dict.notes_html) {
        console.warn("Add an HTML field named 'notes_html' to render Notes.");
        return;
    }

    const wrapper = $(frm.fields_dict.notes_html.wrapper);
    wrapper.empty();

    const crm_notes = new erpnext.utils.CRMNotes({
        frm: frm,
        notes_wrapper: wrapper,
    });

    crm_notes.refresh();
}

// function show_notes(frm) {
//     if (!frm.fields_dict.notes_html) return;

//     const wrapper = $(frm.fields_dict.notes_html.wrapper);

//     function render_notes() {
//         wrapper.empty();

//         const notes = frm.doc.notes || [];

//         let html = `
//         <style>
//             .comment-content { border: 1px solid var(--border-color); border-bottom: none; }
//             .comment-content:last-child { border-bottom: 1px solid var(--border-color); }
//             .new-btn { text-align: right; }
//             .notes-section .no-activity { min-height: 100px; text-align: center; }
//             .notes-section .btn { padding: 0.2rem 0.2rem; }
//         </style>

//         <div class="notes-section col-12">
//             <div class="new-btn pb-3">
//                 <button class="btn btn-sm small new-note-btn mr-1">
//                     <svg class="icon icon-sm"><use href="#icon-add"></use></svg>
//                     New Note
//                 </button>
//             </div>
//             <div class="all-notes">
//                 ${notes.length > 0 ? notes.map(note => {
//                     const identifier = note.name || note.idx; // saved row: name, unsaved: idx
//                     return `
//                     <div class="comment-content p-3 row" data-id="${identifier}">
//                         <div class="mb-2 head col-3">
//                             ${note.added_by && note.added_on ? `
//                             <div class="row">
//                                 <div class="col-2">${frappe.avatar(note.added_by)}</div>
//                                 <div class="col-10">
//                                     <div class="mr-2 title font-weight-bold ellipsis" title="${note.added_by}">
//                                         ${note.added_by}
//                                     </div>
//                                     <div class="time small text-muted">${frappe.datetime.global_date_format(note.added_on)}</div>
//                                 </div>
//                             </div>` : ''}
//                         </div>
//                         <div class="content col-8">${note.note}</div>
//                         <div class="col-1 text-right">
//                             <span class="edit-note-btn btn btn-link">
//                                 <svg class="icon icon-sm"><use xlink:href="#icon-edit"></use></svg>
//                             </span>
//                             <span class="delete-note-btn btn btn-link pl-2">
//                                 <svg class="icon icon-xs"><use xlink:href="#icon-delete"></use></svg>
//                             </span>
//                         </div>
//                     </div>`;
//                 }).join('') : `<div class="no-activity text-muted pt-6">No Notes</div>`}
//             </div>
//         </div>`;

//         wrapper.html(html);
//     }

//     render_notes();

//     // 🔹 Add Note
//     wrapper.off('click', '.new-note-btn').on('click', '.new-note-btn', () => {
//         frappe.prompt([
//             { fieldname: 'note', fieldtype: 'Text Editor', label: 'Note' }
//         ], (values) => {
//             const row = frappe.model.add_child(frm.doc, "CRM Note", "notes");
//             row.note = values.note;
//             row.added_by = frappe.session.user;
//             row.added_on = frappe.datetime.now_datetime();

//             frm.refresh_field("notes");
//             frm.save().then(() => render_notes());
//         }, 'Add Note');
//     });

//     // 🔹 Edit Note
//     wrapper.off('click', '.edit-note-btn').on('click', '.edit-note-btn', function () {
//         const identifier = $(this).closest('.comment-content').data('id');
//         const row = frm.doc.notes.find(r => r.name === identifier || r.idx === identifier);

//         if (row) {
//             frappe.prompt([
//                 { fieldname: 'note', fieldtype: 'Text Editor', label: 'Note', default: row.note }
//             ], (values) => {
//                 frappe.model.set_value(row.doctype, row.name, 'note', values.note);
//                 frm.refresh_field("notes");
//                 frm.save().then(() => render_notes());
//             }, 'Edit Note');
//         }
//     });

//     // 🔹 Delete Note
//     wrapper.off('click', '.delete-note-btn').on('click', '.delete-note-btn', function () {
//         const identifier = $(this).closest('.comment-content').data('id');
//         const row = frm.doc.notes.find(r => r.name === identifier || r.idx === identifier);

//         if (!row) return;

//         // Remove from Frappe model
//         frappe.model.clear_doc(row);

//         // Also remove from the child table array if it's still there
//         const arr_idx = frm.doc.notes.indexOf(row);
//         if (arr_idx !== -1) frm.doc.notes.splice(arr_idx, 1);

//         frm.refresh_field("notes");
//         render_notes();
//     });
// }

