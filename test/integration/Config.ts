import type { IModuleState } from 'componentsjs';
import { ComponentsManager } from 'componentsjs';
import * as rimraf from 'rimraf';
import { joinFilePath } from '../../src/util/PathUtil';

export const BASE = 'http://test.com';
let cachedModuleState: IModuleState;

/**
 * Returns a component instantiated from a Components.js configuration.
 */
export async function instantiateFromConfig(componentUrl: string, configPaths: string | string[],
  variables?: Record<string, any>): Promise<any> {
  // Initialize the Components.js loader
  const mainModulePath = joinFilePath(__dirname, '../../');
  const manager = await ComponentsManager.build({ mainModulePath, logLevel: 'error', moduleState: cachedModuleState });
  cachedModuleState = manager.moduleState;

  if (!Array.isArray(configPaths)) {
    configPaths = [ configPaths ];
  }

  // Instantiate the component from the config(s)
  for (const configPath of configPaths) {
    await manager.configRegistry.register(configPath);
  }
  return await manager.instantiate(componentUrl, { variables });
}

export function getTestConfigPath(configFile: string): string {
  return joinFilePath(__dirname, 'config', configFile);
}

export function getPresetConfigPath(configFile: string): string {
  return joinFilePath(__dirname, '../../config', configFile);
}

export function getTestFolder(name: string): string {
  return joinFilePath(__dirname, '../tmp', name);
}

export function removeFolder(folder: string): void {
  rimraf.sync(folder, { glob: false });
}
