export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [

				//-Dashboard - Admin
				{
					title: "Dashboards",
					root: true,
					icon: 'flaticon-dashboard',
					alignment: "left",
					page: "/dashboard",
					translate: "MENU.DASHBOARD"
				},
				{
					title: "Edi Mart",
					root: true,
					alignment: "left",
					icon: "flaticon2-group",
					submenu:[
						{
							title: "Manage Enquiries",
							page: "/edi-mart",
						},
						{
							title: "New Enquiry",
							page: "/edi-mart/add-enquiry"
						},
						{
							title: "Material Library",
							page: "/edi-mart/manage-materials"
						}
					]
				},
				{
					title: "Manage Users",
					root: true,
					alignment: "left",
					page: "/user-management",
				}
			]
		},
		aside: {
			self: {},
			//side menu removed
		}
	};

	public get configs(): any {
		return this.defaults;
	}
}
