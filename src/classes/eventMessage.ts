export class EventMessage {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private channel?: string;
  private user?: string;
  private outboundMessage?: string;
  private inboundMessage?: string;

  // constructor is private. User object sould be created by one of the get or create commands
  public constructor (channel?: string, user?: string, outboundMessage?: string, inboundMessage?: string) {
    this.channel = channel;
    this.user = user;
    this.outboundMessage = outboundMessage;
    this.inboundMessage = inboundMessage;
  }

  // Getters
  public getChannel () : string {
    return this.channel ? this.channel : "";
  }

  public getUser () : string {
    return this.user ? this.user : "";
  }

  public getOutboundMessage () : string {
    return this.outboundMessage ? this.outboundMessage : "";
  }

  public getInboundMessage () : string {
    return this.inboundMessage ? this.inboundMessage : "";
  }

  // Setters
  public setChannel (channel : string) {
    this.channel = channel;
  }

  public setUser (user : string) {
    this.user = user;
  }

  public setOutboundMessage (outboundMessage : string) {
    this.outboundMessage = outboundMessage;
  }

  public setInboundMessage (inboundMessage : string) {
    this.inboundMessage = inboundMessage;
  }
}
