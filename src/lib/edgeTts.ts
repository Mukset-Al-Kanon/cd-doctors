import crypto from 'crypto';

/**
 * High-Quality Microsoft Neural Bengali (Bangladesh) TTS Engine
 * Voice: bn-BD-NabanitaNeural (Natural Bangladeshi Accent)
 */
export async function generateBanglaNeuralAudio(text: string, voice = 'bn-BD-NabanitaNeural'): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const connId = crypto.randomUUID().replace(/-/g, '');
      const reqId = crypto.randomUUID().replace(/-/g, '');
      const dateStr = new Date().toUTCString();

      const wsUrl = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=${connId}`;

      const ws = new WebSocket(wsUrl, {
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
          'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
        },
      } as any);

      const audioChunks: Buffer[] = [];
      let isCompleted = false;

      const timeout = setTimeout(() => {
        if (!isCompleted) {
          try { ws.close(); } catch {}
          reject(new Error('TTS timeout'));
        }
      }, 12000);

      ws.onopen = () => {
        // 1. Send speech config
        const configMsg = `Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
        ws.send(configMsg);

        // 2. Escape XML text
        const cleanText = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');

        // 3. Send SSML request
        const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='bn-BD'><voice name='${voice}'><prosody pitch='+0Hz' rate='-2%' volume='+0%'>${cleanText}</prosody></voice></speak>`;
        const ssmlMsg = `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${dateStr}Z\r\nPath:ssml\r\n\r\n${ssml}`;
        ws.send(ssmlMsg);
      };

      ws.onmessage = async (event) => {
        try {
          if (typeof event.data === 'string') {
            if (event.data.includes('Path:turn.end')) {
              isCompleted = true;
              clearTimeout(timeout);
              try { ws.close(); } catch {}
              const finalBuffer = Buffer.concat(audioChunks);
              if (finalBuffer.length > 0) {
                resolve(finalBuffer);
              } else {
                reject(new Error('Empty audio received'));
              }
            }
          } else {
            // Binary Audio Frame
            let buffer: Buffer;
            if (event.data instanceof ArrayBuffer) {
              buffer = Buffer.from(event.data);
            } else if (Buffer.isBuffer(event.data)) {
              buffer = event.data;
            } else if (event.data && typeof (event.data as any).arrayBuffer === 'function') {
              const ab = await (event.data as any).arrayBuffer();
              buffer = Buffer.from(ab);
            } else {
              return;
            }

            if (buffer.length > 2) {
              const headerLength = buffer.readUInt16BE(0);
              if (buffer.length > 2 + headerLength) {
                const headerText = buffer.toString('utf-8', 2, 2 + headerLength);
                if (headerText.includes('Path:audio')) {
                  const audioData = buffer.subarray(2 + headerLength);
                  audioChunks.push(audioData);
                }
              }
            }
          }
        } catch (err) {
          console.error('Error parsing TTS frame:', err);
        }
      };

      ws.onerror = (err) => {
        clearTimeout(timeout);
        reject(err);
      };

      ws.onclose = () => {
        if (!isCompleted) {
          clearTimeout(timeout);
          if (audioChunks.length > 0) {
            resolve(Buffer.concat(audioChunks));
          } else {
            reject(new Error('WebSocket closed before audio completion'));
          }
        }
      };
    } catch (err) {
      reject(err);
    }
  });
}
