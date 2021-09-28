import * as KrixModule from '@krix/module';
import type * as KrixStateStore from '@krix/state-store';
import * as Core from '@krix/devtool-core';

import { MessageRetranslator } from './data-flow/message-retranslator';
import { EndpointConnector } from './data-flow/endpoint-connector';
import { PackageStore } from './package.store';

@KrixModule.Dependency()
export class DevToolConnector {

  constructor (
    private messageRetranslator: MessageRetranslator,
    private packageStore: PackageStore,
    private endpointConnector: EndpointConnector,
  ) {
    this.endpointConnector.connect();
  }

  /**
   * Connects the state store instance to the Dev Tool extension by the specific name.
   *
   * @param  {string} storeName - state store name
   * @param  {KrixStateStore.StateStore} stateStore - state store instance
   */
  connectStateStore (
    storeName: string,
    stateStore: KrixStateStore.StateStore,
  ): void {
    this.packageStore.setPackageInst(Core.Enums.PackageName.StateStore, storeName, stateStore);

    // Subscibe on changes of `Store Command` flow of the state store
    stateStore.getStoreCommandObserver()
      .subscribe((storeCommand) => {
        this.messageRetranslator.sendPackageMessage(
          Core.Enums.PackageName.StateStore,
          storeName,
          storeCommand,
        );
      });
  }
}
