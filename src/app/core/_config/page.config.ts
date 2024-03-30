export class PageConfig {
	public defaults: any = {
		dashboard: {
			page: {
				title: "Dashboard",
				desc: ""
			}
		},		
		'edi-mart': {
			'manage-enquiries':{
				page: { title: "Manage Enquiries", desc: "" }
			},
			'add-enquiry': {
				page: { title: "Add Enquiry", desc: "" }
			},
			'manage-materials': {
				page: { title: "Manage Material Library", desc: "" }
			}
		},
		'user-management': {
			'users':{
				page: { title: "Manage Users", desc: "" }
			},
		},
		profile: {
			page: { title: "User Profile", desc: "" }
		}
	};

	public get configs(): any {
		return this.defaults;
	}
}
