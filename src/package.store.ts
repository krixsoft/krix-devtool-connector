import * as KrixModule from '@krix/module';
import type * as KrixStateStore from '@krix/state-store';
import * as Core from '@krix/devtool-core';

import { MessageRetranslator } from './data-flow/message-retranslator';

type PackageType = KrixStateStore.StateStore;

@KrixModule.Dependency()
export class PackageStore {
  /**
   * Store which keeps `Package Instance` stores.
   */
  private packageStoreMap: Map<Core.Enums.PackageName, Map<string, PackageType>>;

  constructor (
    private messageRetranslator: MessageRetranslator,
  ) {
    this.packageStoreMap = new Map();
  }

  /**
   * Sets a package instance at a `Package Instance` store for the specific package.
   *
   * @param  {Core.Enums.PackageName} packageName
   * @param  {string} packageId
   * @param  {PackageType} packageInst
   * @return {void}
   */
  setPackageInst (
    packageName: Core.Enums.PackageName,
    packageId: string,
    packageInst: PackageType,
  ): void {
    // Create a `Package Instance` store if it doesn't exist
    if (this.packageStoreMap.has(packageName) === false) {
      this.packageStoreMap.set(packageName, new Map());
    }

    // Get the `Package Instance` store and save the new instance to it
    const packageInstStoreMap = this.packageStoreMap.get(packageName);
    packageInstStoreMap.set(packageId, packageInst);

    const packageIds = this.getAllPackageIds(packageName);
    this.messageRetranslator.sendMessage<Core.Interfaces.EndpointMessagePayload.Response.UpdatePackageListCommand>(
      Core.Enums.MsgCommands.DevToolPlugin.UpdatePackageList,
      {
        packageName: packageName,
        packageIds: packageIds,
      },
    );
  }

  /**
   * Gets a package instance from a `Package Instance Store` by the package name and the package identifier.
   *
   * @param  {Core.Enums.PackageName} packageName
   * @param  {string} packageId
   * @return {PackageType}
   */
  getPackageInst (
    packageName: Core.Enums.PackageName,
    packageId: string,
  ): PackageType {
    // Throw an error if a `Package Instance` store doesn't exist
    if (this.packageStoreMap.has(packageName) === false) {
      throw new Error(`Package store ${packageName} doesn't exist`);
    }

    // Get the `Package Instance` store and extract a package instance from it
    const packageInstStoreMap = this.packageStoreMap.get(packageName);
    const packageInst = packageInstStoreMap.get(packageId);
    return packageInst;
  }

  /**
   * Gets all package identifiers for the specific package.
   *
   * @param  {Core.Enums.PackageName} packageName
   * @return {string[]}
   */
  getAllPackageIds (
    packageName: Core.Enums.PackageName,
  ): string[] {
    // Throw an error if a `Package Instance` store doesn't exist
    if (this.packageStoreMap.has(packageName) === false) {
      throw new Error(`Package store ${packageName} doesn't exist`);
    }

    // Get the `Package Instance` store and extract all package identifiers from it
    const packageInstStoreMap = this.packageStoreMap.get(packageName);
    const stateStoresNames = Array.from(packageInstStoreMap.keys());
    return stateStoresNames;
  }
}
