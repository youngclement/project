interface PhantomEvent {
  type: string;
  data: unknown;
}

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: { toString(): string } | null;
  isPhantom: boolean;
  signMessage(message: Uint8Array, encoding: string): Promise<{ signature: Uint8Array; publicKey: { toString(): string } }>;
  connect(opts?: Partial<ConnectOpts>): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  on(event: string, handler: (event: PhantomEvent) => void): void;
  request(method: object): Promise<object>;
}

interface Window {
  solana?: PhantomProvider;
}