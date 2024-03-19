export interface IConsoleService {
  createClient(options: { scopes: string[]; grants?: string[] }): Promise<void>;
}

export const IConsoleService = Symbol('IConsoleService');
