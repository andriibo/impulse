export interface ClientEntity {
  id: string;
  secret: string;
  grants: string[];
  scopes: string[];
  accessTokenLifetime: number;
  refreshTokenLifetime: number;
  privateKey: string;
  publicKey: string;
  cert: string;
  certExpiresAt: Date;
  createdAt: Date;
  deletedAt: Date;
}
