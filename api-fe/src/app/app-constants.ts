export class AppConstants {

  public static get baseServidor(): string {return 'http://localhost:8082/'}

  public static get baseLogin(): string {return this.baseServidor + 'api-be/login'}

  public static get baseUrl(): string {return this.baseServidor + 'api-be/usuario/'}

}
