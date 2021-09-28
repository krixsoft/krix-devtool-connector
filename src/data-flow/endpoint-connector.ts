import * as KrixModule from '@krix/module';
import * as Core from '@krix/devtool-core';

import * as PkgConfig from '../config';

import { MessageHandler } from './message-handler';

@KrixModule.Dependency()
export class EndpointConnector {

  constructor (
    private messageHandler: MessageHandler,
  ) {
  }

  /**
   * Creates a connection to the CS.
   * - subscribes to `message` window events (calls the `onMessage` logic after every event).
   *
   * @return {void}
   */
  public connect (
  ): void {
    // eslint-disable-next-line no-unused-expressions
    if (PkgConfig.production === false) {
      console.log(`DTP.EndpointConnector.connect: Successful`);
    }

    try {
      // Subscribe to `message` window events
      window.addEventListener('message', (event: MessageEvent) => {
        this.onMessage(event);
      }, false);
    } catch (error) {
      throw new Error(`EndpointConnector.connect: Global "window" variable not supported. `
        + `Krix DevTool Connector can only be started in browser environment. `);
    }
  }

  /**
   * Handles a `Message` event.
   * - skips messages from an outside endpoint (not current tab);
   * - extracts a message from the message event;
   * - skips unsupported endpoints;
   * - dispatches the message to the CS message handler.
   *
   * @param  {MessageEvent} event
   * @return {void}
   */
  private onMessage (
    event: MessageEvent,
  ): void {
    // Skips messages from an outside endpoint (not current tab);
    if (event.source !== window) {
      // eslint-disable-next-line no-unused-expressions
      if (PkgConfig.production === false) {
        console.log(`DTP.MessageHandler.onMessage: Catch signal from unsupported provider`);
      }
      return;
    }
    // Extracts a message from the message event
    const message: Core.Interfaces.EndpointMessage = event.data;

    // Skip unsupported endpoints
    if (message.target !== Core.Enums.AppEndpoint.DevToolPlugin) {
      return;
    }

    // Dispatche the message to the CS message handler
    this.messageHandler.onMessage(message);
  }
}
