frappe.ready(function () {
    frappe.web_form.on('member_name', (field, value) => {
        if (value) {
			frappe.web_form.set_df_property('dob', 'reqd', 1)
			frappe.web_form.set_df_property('status', 'reqd', 1)
			let data=frappe.web_form.get_value('member_name')
            frappe.web_form.set_value('status', 'Active')
			frappe.web_form.set_value('email', data)

        }
    });
	frappe.web_form.on('dob',(field,value)=>{
		if (value) { 
            const dob = new Date(value)
            const today = new Date()
            let age = today.getFullYear() - dob.getFullYear()
            const m = today.getMonth() - dob.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--
            }
			if(age<20){
				frappe.msgprint('Age must be greater than 20')
				field.set_value(0)
				
			}
			else{
				frappe.web_form.set_value('age', age)
				frappe.web_form.set_df_property('age', 'hidden', 0)
			}
            
			
        }
		else{
			frappe.web_form.set_df_property('age', 'hidden', 1)
		}
		
	})

	frappe.web_form.validate = () => {
		let data = frappe.web_form.get_values();
		if (data.status === 'Inactive') {
		frappe.msgprint('Status must be Active');
		return false;
		}
	};
	
	

});


// frappe.ready(function () {
//     // When member_name is entered
//     frappe.web_form.on('member_name', (field, value) => {
//         if (value) {
//             frappe.web_form.set_df_property('email', 'reqd', 1);
//             frappe.web_form.set_value('status', 'Active');
//         }
//     });

//     // When DOB is selected
//     frappe.web_form.on('dob', (field, value) => {
//         if (value) {
//             const dob = new Date(value);
//             const today = new Date();
//             let age = today.getFullYear() - dob.getFullYear();
//             const m = today.getMonth() - dob.getMonth();
//             if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
//                 age--;
//             }

//             frappe.web_form.set_value('age', age);
//             frappe.web_form.set_df_property('age', 'hidden', 0);  // ✅ unhide the field
//         } else {
//             frappe.web_form.set_df_property('age', 'hidden', 1);  // ✅ hide it only when DOB is empty
//         }
//     });
// });
