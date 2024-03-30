import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';

import { ConfigurationService, EndpointFactory } from '../../../core/_helpers';

export interface ILoginResponse{
    accessToken:string,
    refreshToken:string,
    userId:string,
}

@Injectable()
export class AuthService {
    private get tokenUrl() { return this.configurations.tokenUrl; }

    public get loginUrl() { return this.configurations.loginUrl; }

    // API URLS
    private readonly _allPermissionsUrl = '/v1/iam/permissions';
    private readonly _allRolesUrl: string = '/v1/iam/roles';


    private readonly _userByTokenUrl = '/v1/iam/me';
	private readonly _findUsersUrl: string = '/api/iam/users/find';
	private readonly _registerUrl: string = '/api/iam/users/register';
	private readonly _requestPasswordUrl: string = '/api/iam/users/forgot';
    private readonly _allUsersUrl: string = '/api/iam/users/all';
	private readonly _userByIdUrl: string = '/api/iam/users/id';

    private readonly _deleteUserUrl: string = '/api/account/permissions';
    private readonly _updateUserUrl: string = '/api/account/permissions';
    private readonly _createUserUrl: string = '/api/account/permissions';
    private readonly _rolePermissionsUrl: string = '/api/account/permissions';

    // roles
    private readonly _roleByIdUrl: string = '/api/iam/roles/me';
    private readonly _findRolesUrl: string = '/api/iam/roles/find';
    private readonly _createRoleUrl: string = '/api/iam/roles/create';
    private readonly _updateRoleUrl: string = '/api/iam/roles/update';
    private readonly _deleteRoleUrl: string = '/api/iam/roles/delete';
    private readonly _isRoleAssignedToUsersUrl: string = '/api/iam/roles/isroleassigned';


    get allPermissionsUrl() { return this.configurations.baseUrl + this._allPermissionsUrl; }
    get userByToken() { return this.configurations.baseUrl + this._userByTokenUrl; }
    get allRolesUrl() { return this.configurations.baseUrl + this._allRolesUrl; }
    get roleByIdUrl() { return this.configurations.baseUrl + this._roleByIdUrl; }

    get registerUrl() { return this.configurations.baseUrl + this._registerUrl; }
    get requestPasswordUrl() { return this.configurations.baseUrl + this._requestPasswordUrl; }
    get allUsersUrl() { return this.configurations.baseUrl + this._allUsersUrl; }
    get userByIdUrl() { return this.configurations.baseUrl + this._userByIdUrl; }
    get deleteUserUrl() { return this.configurations.baseUrl + this._deleteUserUrl; }
    get updateUserUrl() { return this.configurations.baseUrl + this._updateUserUrl; }
    get createUserUrl() { return this.configurations.baseUrl + this._createUserUrl; }
    get findUsersUrl() { return this.configurations.baseUrl + this._findUsersUrl; }
    get rolePermissionsUrl() { return this.configurations.baseUrl + this._rolePermissionsUrl; }
    get createRoleUrl() { return this.configurations.baseUrl + this._createRoleUrl; }
    get updateRoleUrl() { return this.configurations.baseUrl + this._updateRoleUrl; }
    get deleteRoleUrl() { return this.configurations.baseUrl + this._deleteRoleUrl; }
    get isRoleAssignedToUsersUrl() { return this.configurations.baseUrl + this._isRoleAssignedToUsersUrl; }
    get findRolesUrl() { return this.configurations.baseUrl + this._findRolesUrl; }

    constructor(private http: HttpClient,
                private configurations: ConfigurationService,
                private endpointFactory: EndpointFactory) { }
    // Authentication/Authorization
    login(email: string, password: string): Observable<User> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');

        return this.http.post<User>(this.tokenUrl, { UserName: email, Password: password }, { headers: httpHeaders });
    }

    getUserByToken(): Observable<User> {
        return this.http.get<User>(this.userByToken, this.endpointFactory.getRequestHeaders()).pipe<User>(
            catchError(error => {
                return this.endpointFactory.handleError(error, () => this.getUserByToken());
            }));
    }

    register(user: User): Observable<any> {
        return this.http.post<User>(this.registerUrl, user, this.endpointFactory.getRequestHeaders())
            .pipe(catchError(this.handleHttpError('login', []))
            );
    }

    /*
     * Submit forgot password request
     *
     * @param {string} email
     * @returns {Observable<any>}
     */
    public requestPassword(email: string): Observable<any> {
        return this.http.get(`${this.requestPasswordUrl}?username=${email}`)
            .pipe(
                catchError(this.handleHttpError('forgot-password', []))
            );
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.allUsersUrl, this.endpointFactory.getRequestHeaders());
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(this.userByIdUrl + `/${userId}`, this.endpointFactory.getRequestHeaders());
    }

    // DELETE => delete the user from the server
    deleteUser(userId: number) {
        const url = `${this.deleteUserUrl}/${userId}`;
        return this.http.delete(url, this.endpointFactory.getRequestHeaders());
    }

    // UPDATE => PUT: update the user on the server
    updateUser(user: User): Observable<any> {
        return this.http.put(this.updateUserUrl, user, this.endpointFactory.getRequestHeaders());
    }

    // CREATE =>  POST: add a new user to the server
    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.createUserUrl, user, this.endpointFactory.getRequestHeaders());
    }

    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
    // items => filtered/sorted result
    findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        return this.http.post<QueryResultsModel>(this.findUsersUrl, queryParams, this.endpointFactory.getRequestHeaders());
    }

    // Permission
    getAllPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(this.allPermissionsUrl);
    }

    getRolePermissions(roleId: number): Observable<Permission[]> {
        return this.http.get<Permission[]>(this.rolePermissionsUrl + '/getRolePermission?=' + roleId,
         this.endpointFactory.getRequestHeaders());
    }

    // Roles
    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.allRolesUrl, this.endpointFactory.getRequestHeaders())
            .pipe<Role[]>(
                catchError(error => {
                    return this.endpointFactory.handleError(error, () => this.getUserByToken());
                }));
    }

    getRoleById(roleId: number): Observable<Role> {
        return this.http.get<Role>(this.roleByIdUrl + `/${roleId}`, this.endpointFactory.getRequestHeaders());
    }

    // CREATE =>  POST: add a new role to the server
    createRole(role: Role): Observable<Role> {
        return this.http.post<Role>(this.createRoleUrl, role, this.endpointFactory.getRequestHeaders());
    }

    // UPDATE => PUT: update the role on the server
    updateRole(role: Role): Observable<any> {
        return this.http.put(this.updateRoleUrl, role, this.endpointFactory.getRequestHeaders());
    }

    // DELETE => delete the role from the server
    deleteRole(roleId: number): Observable<Role> {
        const endpointUrl = `${this.deleteRoleUrl}/${roleId}`;
        return this.http.delete<Role>(endpointUrl, this.endpointFactory.getRequestHeaders());

        // return this.http.delete<Role>(endpointUrl, this.endpointFactory.getRequestHeaders()).pipe<Role>(
        // 	catchError(error => {
        // 		return this.endpointFactory.handleError(error, () => this.deleteRole(roleId));
        // 	}));
    }

    // Check Role Before deletion
    isRoleAssignedToUsers(roleId: number, userId: number): Observable<boolean> {
		return this.http.get<boolean>(`${this.isRoleAssignedToUsersUrl}/${roleId}/${userId}`,
        this.endpointFactory.getRequestHeaders());
    }

    findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        return this.http.post<QueryResultsModel>(this.findRolesUrl, queryParams, this.endpointFactory.getRequestHeaders());
    }

    /*
	 * Handle Http operation that failed.
	 * Let the app continue.
   *
   * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
    private handleHttpError<T>(_operation = 'operation', result?: any) {
        return (error: any): Observable<T> => {
			// console.log(message); // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result);
		};
    }
}
