// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	authTokenKey: 'EDIFY_AUTH_27022024',
    appVersion:'v1.0.0',
	// baseUrl: 'http://drs.ezufy.com', //Change this to the address of your backend API if different from frontend address
	// tokenUrl: 'http://drs.ezufy.com/api/authenticate/token', // For IdentityServer/Authorization Server API.You can set to null if same as baseUrl
	apiUrl: 'http://localhost:5011', // Change this to the address of your backend API if different from frontend address
	tokenUrl: 'http://localhost:5011/v1/iam/edi-hub/token', // For IdentityServer/Authorization Server API.You can set to null if same as baseUrl
	loginUrl: '/auth/login',
	azure:{
		sasToken:'sp=r&st=2023-10-31T12:37:18Z&se=2043-10-31T20:37:18Z&sv=2022-11-02&sr=c&sig=ZsK%2FI1fujIZnvlT09O1bCRDR4Utu0fFtbKJTTdM6UuU%3D',
		storageAccountName:'eshgroupstorageaccount',
		storageContainerName:'eshdocumentcontainer-dev',
		accessKey:'g4z6rbHdn409LnIzDtGcLGMbcqvUG2Z4vgEbjAWUnoeOv9QxMCXIpd7BjOPqFsr5nZ/BqeqCpNXZ+AStntEcvw=='
	  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
