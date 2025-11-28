frappe.listview_settings['Quick Invoice'] = {
    add_fields: ["status"],
    has_indicator_for_draft: 1,
    get_indicator: function (doc) {
        if (doc.status === "In Progress") {
            return [__("In Progress"), "orange", "status,=,In Progress"];
        } 
        else if (doc.status === "Draft") {
            return [__("Draft"), "red", "status,=,Draft"];
        } 
        else if (doc.status === "Submitted") {
            return [__("Submitted"), "blue", "status,=,Submitted"];
        } 
        
    }
};