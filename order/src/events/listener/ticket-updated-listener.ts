import { Listener, Subjects, TicketUpdatedEvent } from "@goodmanltd/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { QueueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QueueGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    // find the ticket first

    //const ticket = await Ticket.findById(data.id);
    // with concurrency control -> find by id and version
    // const ticket = await Ticket.findOne({
    //   _id: data.id,
    //   // the data from latest event is only one version ahead of record in replica db
    //   // make sure we don't miss anything in between
    //   version: data.version - 1
    // })
    // better extract above to statics in model
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error("Ticket not found");

    // update the ticket and save
    ticket.title = data.title;
    ticket.price = data.price;

    // not using mongoose-update-if-current package
    ticket.version = data.version



    // the updateIfCurrentPlugin will increase the version of replica db by one
    // this will make it make the version from incoming event
    await ticket.save();

    // call ack when we successfully processed the msg
    msg.ack();
  }
}
