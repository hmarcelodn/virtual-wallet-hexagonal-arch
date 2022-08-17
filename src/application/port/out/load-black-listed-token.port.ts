export interface LoadBlackListerTokenPort {
  getToken(token: string): Promise<any>;
}
