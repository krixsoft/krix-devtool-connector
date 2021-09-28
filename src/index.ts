import 'reflect-metadata';
import * as KrixModule from '@krix/module';

import { EndpointConnector } from './data-flow/endpoint-connector';
import { MessageHandler } from './data-flow/message-handler';
import { MessageRetranslator } from './data-flow/message-retranslator';
import { PackageStore } from './package.store';
import { DevToolConnector } from './devtool-connector';

const kxModule = KrixModule.KxModule.init({
  dependencies: [
    EndpointConnector,
    MessageHandler,
    MessageRetranslator,
    PackageStore,
    DevToolConnector,
  ],
});

export async function getConnector (
): Promise<DevToolConnector> {
  const devToolConnector = await kxModule.get<DevToolConnector>(DevToolConnector);
  return devToolConnector;
}
